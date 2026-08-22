/**
 * Plugin market HTTP helpers for the Example Company Settings hub.
 * Works on standard DSH Desktop with dsh-community-market composed into the profile.
 * Catalog selection prefers company-1024store, then falls back to dsh-1024store.
 */

import {
  COMPANY_CATALOG_SOURCE_KEY,
  FALLBACK_CATALOG_SOURCE_KEY,
  companyCatalogBuiltinKeys,
  companyCatalogSelected,
  resolveCompanyCatalogSource,
  type CatalogSourceView,
} from '../catalog.ts'
import {
  COMPANY_PACK_RECOMMENDED_ENTRY,
  findCatalogItemForPackage,
  isRecommendedPackage,
  recommendedPackageInstalled,
  type InstallResult,
} from '../recommendations.ts'

export { companyCatalogSelected }

async function readJson<T>(response: Response): Promise<T> {
  const value = await response.json() as T & { error?: unknown }
  if (!response.ok) {
    throw new Error(typeof value.error === 'string' ? value.error : `request failed: ${response.status}`)
  }
  return value
}

export async function readMarketSources(signal?: AbortSignal): Promise<readonly CatalogSourceView[]> {
  const state = await readJson<{ sources: readonly CatalogSourceView[] }>(await fetch('/api/community-market/state', {
    cache: 'no-store',
    ...(signal === undefined ? {} : { signal }),
  }))
  return state.sources
}

async function mutateMarketSource(
  mutation: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<readonly CatalogSourceView[]> {
  const response = await readJson<{ sources: readonly CatalogSourceView[] }>(await fetch('/api/community-market/sources', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(mutation),
    ...(signal === undefined ? {} : { signal }),
  }))
  return response.sources
}

export interface SelectCatalogOutcome {
  readonly sources: readonly CatalogSourceView[]
  readonly usedFallback: boolean
  readonly activeKey: string
}

/**
 * User-initiated: add/select company catalog when Host supports it;
 * otherwise fall back to public 1024Store.
 */
export async function selectCompanyCatalog(signal?: AbortSignal): Promise<SelectCatalogOutcome> {
  let sources = [...await readMarketSources(signal)]
  let usedFallback = false
  let activeKey = COMPANY_CATALOG_SOURCE_KEY
  for (const key of companyCatalogBuiltinKeys()) {
    let source = sources.find(item => item.builtInProviderKey === key)
    if (source === undefined) {
      try {
        sources = [...await mutateMarketSource({ action: 'add-builtin', key }, signal)]
        source = sources.find(item => item.builtInProviderKey === key)
      } catch {
        if (key === COMPANY_CATALOG_SOURCE_KEY) {
          usedFallback = true
          continue
        }
        throw new Error('built-in catalog source unavailable')
      }
    }
    if (source === undefined) {
      if (key === COMPANY_CATALOG_SOURCE_KEY) {
        usedFallback = true
        continue
      }
      throw new Error('built-in catalog source unavailable')
    }
    activeKey = key
    if (key === FALLBACK_CATALOG_SOURCE_KEY) {
      usedFallback = true
    }
    if (!source.enabled) {
      sources = [...await mutateMarketSource({ action: 'select', sourceRecordId: source.sourceRecordId }, signal)]
    }
    return { sources, usedFallback: usedFallback || key === FALLBACK_CATALOG_SOURCE_KEY, activeKey }
  }
  throw new Error('built-in catalog source unavailable')
}

export async function readInstallations(
  signal?: AbortSignal,
): Promise<readonly { readonly packageName?: string; readonly receipt?: { readonly packageName: string } }[]> {
  const response = await readJson<{
    installations: readonly { readonly packageName?: string; readonly receipt?: { readonly packageName: string } }[]
  }>(await fetch('/api/community-market/installations', {
    cache: 'no-store',
    ...(signal === undefined ? {} : { signal }),
  }))
  return response.installations
}

async function searchCatalogItems(
  sourceRecordId: string,
  packageName: string,
  signal?: AbortSignal,
): Promise<readonly { readonly id: string; readonly package?: { readonly name?: string } }[]> {
  const url = new URL('/api/community-market/catalog', window.location.origin)
  url.searchParams.set('sourceRecordId', sourceRecordId)
  url.searchParams.set('q', packageName)
  url.searchParams.set('limit', '50')
  url.searchParams.set('locale', 'zh')
  const response = await readJson<{
    results: readonly {
      snapshot?: { items?: readonly { readonly id: string; readonly package?: { readonly name?: string } }[] }
    }[]
  }>(await fetch(url, {
    cache: 'no-store',
    ...(signal === undefined ? {} : { signal }),
  }))
  return response.results.flatMap(result => result.snapshot?.items ?? [])
}

async function previewAndExecuteInstall(
  sourceRecordId: string,
  itemId: string,
  signal?: AbortSignal,
): Promise<string | undefined> {
  const preview = await readJson<{ previewId: string; action: string }>(await fetch('/api/community-market/operations/preview', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'install', sourceRecordId, itemId }),
    ...(signal === undefined ? {} : { signal }),
  }))
  if (preview.action !== 'install') throw new Error('operation preview action mismatch')
  const executed = await readJson<{ action: string; restartToken?: string }>(await fetch('/api/community-market/operations/execute', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ previewId: preview.previewId }),
    ...(signal === undefined ? {} : { signal }),
  }))
  if (executed.action !== 'install') throw new Error('operation response action mismatch')
  return executed.restartToken
}

export async function installRecommendedPlugins(
  packageNames: readonly string[],
  signal?: AbortSignal,
): Promise<{ readonly results: readonly InstallResult[]; readonly restartToken?: string }> {
  if (packageNames.length === 0) throw new Error('no recommended plugins requested')
  if (packageNames.some(packageName => !isRecommendedPackage(packageName))) {
    throw new Error('company plugin can only install its recommended plugins')
  }
  const selected = await selectCompanyCatalog(signal)
  const source = resolveCompanyCatalogSource(selected.sources)
  if (source === undefined) throw new Error('built-in catalog source unavailable')
  const installations = [...await readInstallations(signal)]
  const results: InstallResult[] = []
  let restartToken: string | undefined
  for (const packageName of packageNames) {
    if (recommendedPackageInstalled(packageName, installations)) {
      results.push({ packageName, status: 'already' })
      continue
    }
    try {
      const item = findCatalogItemForPackage(
        await searchCatalogItems(source.sourceRecordId, packageName, signal),
        packageName,
      )
      if (item === undefined) {
        results.push({ packageName, status: 'missing' })
        continue
      }
      const nextToken = await previewAndExecuteInstall(source.sourceRecordId, item.id, signal)
      if (nextToken !== undefined) restartToken = nextToken
      installations.push({ packageName })
      results.push({ packageName, status: 'installed' })
    } catch (cause) {
      results.push({
        packageName,
        status: 'failed',
        error: cause instanceof Error ? cause.message : 'install failed',
      })
    }
  }
  return restartToken === undefined ? { results } : { results, restartToken }
}

export async function requestRestart(
  restartToken: string,
  signal?: AbortSignal,
): Promise<void> {
  await readJson<{ ok: true }>(await fetch('/api/community-market/desktop/request-restart', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ restartToken }),
    ...(signal === undefined ? {} : { signal }),
  }))
}

/** Install the optional Company Pack through Plugin market (no desktop-specific API). */
export async function installCompanyPackWithCascade(signal?: AbortSignal): Promise<{
  readonly packEnabled: boolean
  readonly results: readonly InstallResult[]
  readonly restartToken?: string
}> {
  const outcome = await installRecommendedPlugins([COMPANY_PACK_RECOMMENDED_ENTRY.packageName], signal)
  const packResult = outcome.results.find(result => result.packageName === COMPANY_PACK_RECOMMENDED_ENTRY.packageName)
  const packEnabled = packResult?.status === 'installed' || packResult?.status === 'already'
  return {
    packEnabled,
    results: outcome.results,
    ...(outcome.restartToken === undefined ? {} : { restartToken: outcome.restartToken }),
  }
}
