/**
 * Company catalog source selection.
 * Prefer a future company 1024Store; fall back to the public DSH 1024Store.
 * Selection is always user-initiated — never silent at boot.
 */

/** Placeholder built-in key for a future company-internal 1024Store. */
export const COMPANY_CATALOG_SOURCE_KEY = 'company-1024store'

/** Public DSH catalog used until the company store is registered in Market. */
export const FALLBACK_CATALOG_SOURCE_KEY = 'dsh-1024store'

export interface CatalogSourceView {
  readonly sourceRecordId: string
  readonly enabled: boolean
  readonly builtInProviderKey?: string
}

/** True when the preferred company catalog (or fallback) is selected. */
export function companyCatalogSelected(
  sources: readonly CatalogSourceView[],
  preferredKey: string = COMPANY_CATALOG_SOURCE_KEY,
  fallbackKey: string = FALLBACK_CATALOG_SOURCE_KEY,
): boolean {
  const preferred = sources.find(source => source.builtInProviderKey === preferredKey && source.enabled)
  if (preferred !== undefined) return true
  return sources.some(source => source.builtInProviderKey === fallbackKey && source.enabled)
}

/** Pick the active catalog source record: company key first, then fallback. */
export function resolveCompanyCatalogSource(
  sources: readonly CatalogSourceView[],
  preferredKey: string = COMPANY_CATALOG_SOURCE_KEY,
  fallbackKey: string = FALLBACK_CATALOG_SOURCE_KEY,
): CatalogSourceView | undefined {
  return sources.find(source => source.builtInProviderKey === preferredKey && source.enabled)
    ?? sources.find(source => source.builtInProviderKey === fallbackKey && source.enabled)
}

/** Ordered keys to try when adding/selecting a built-in catalog. */
export function companyCatalogBuiltinKeys(
  preferredKey: string = COMPANY_CATALOG_SOURCE_KEY,
  fallbackKey: string = FALLBACK_CATALOG_SOURCE_KEY,
): readonly string[] {
  return preferredKey === fallbackKey ? [fallbackKey] : [preferredKey, fallbackKey]
}
