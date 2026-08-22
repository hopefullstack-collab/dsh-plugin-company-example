/**
 * Featured / curated recommendations that travel with the company plugin.
 * Not an allowlist; catalog listing is not a security review.
 */

export type RecommendedPluginRole =
  | 'workspace-shell'
  | 'workspace-context'
  | 'workspace-mobile'
  | 'office-dingtalk'
  | 'office-wecom'
  | 'company-pack'

export interface RecommendedPlugin {
  readonly packageName: string
  readonly displayName: string
  readonly role: RecommendedPluginRole
  readonly repositoryUrl: string
}

/** Workspace plugins recommended after Company Pack confirm. */
export const WORKSPACE_RECOMMENDED_PLUGINS: readonly RecommendedPlugin[] = Object.freeze([
  {
    packageName: 'dsh-better-sidebar',
    displayName: 'DSH-better-sidebar',
    role: 'workspace-shell',
    repositoryUrl: 'https://github.com/omdsh-dev/DSH-better-sidebar',
  },
  {
    packageName: 'dsh-context',
    displayName: 'dsh-context',
    role: 'workspace-context',
    repositoryUrl: 'https://github.com/bowenliang123/dsh-context',
  },
])

/** Later optional narrow-screen recommendation. */
export const LATER_RECOMMENDED_PLUGINS: readonly RecommendedPlugin[] = Object.freeze([
  {
    packageName: 'dsh-web-mobile',
    displayName: 'dsh-web-mobile',
    role: 'workspace-mobile',
    repositoryUrl: 'https://github.com/mexiaosqwq/dsh-web-mobile',
  },
])

/** Starting office-IM recommendations (not an allowlist). */
export const OFFICE_IM_RECOMMENDED_PLUGINS: readonly RecommendedPlugin[] = Object.freeze([
  {
    packageName: 'dsh-dingtalk-channel',
    displayName: 'dsh-dingtalk-channel',
    role: 'office-dingtalk',
    repositoryUrl: 'https://github.com/ttmouse/dsh-dingtalk-channel',
  },
  {
    packageName: 'dsh-wecom',
    displayName: 'dsh-wecom',
    role: 'office-wecom',
    repositoryUrl: 'https://github.com/TtTRz/dsh-wecom',
  },
])

/** Optional Company Pack entry shown under Enterprise. */
export const COMPANY_PACK_RECOMMENDED_ENTRY: RecommendedPlugin = Object.freeze({
  packageName: 'dsh-plugin-company-pack',
  displayName: 'Company Pack (example)',
  role: 'company-pack',
  repositoryUrl: 'https://github.com/hopefullstack-collab/deepseek-harness-desktop/tree/master/dsh-plugin-company-pack',
})

export type InstallKind = 'workspace' | 'office-im' | 'later' | 'company-pack'

export function recommendedPluginsFor(kind: InstallKind): readonly RecommendedPlugin[] {
  switch (kind) {
    case 'workspace':
    case 'company-pack':
      return WORKSPACE_RECOMMENDED_PLUGINS
    case 'office-im':
      return OFFICE_IM_RECOMMENDED_PLUGINS
    case 'later':
      return LATER_RECOMMENDED_PLUGINS
  }
}

export function isRecommendedPackage(packageName: string): boolean {
  return [
    COMPANY_PACK_RECOMMENDED_ENTRY,
    ...WORKSPACE_RECOMMENDED_PLUGINS,
    ...LATER_RECOMMENDED_PLUGINS,
    ...OFFICE_IM_RECOMMENDED_PLUGINS,
  ].some(plugin => plugin.packageName === packageName)
}

export type InstallStatus = 'installed' | 'already' | 'missing' | 'failed'

export interface InstallResult {
  readonly packageName: string
  readonly status: InstallStatus
  readonly error?: string
}

export function recommendedPackageInstalled(
  packageName: string,
  installations: readonly { readonly packageName?: string; readonly receipt?: { readonly packageName: string } }[],
): boolean {
  return installations.some(row => (
    row.packageName === packageName || row.receipt?.packageName === packageName
  ))
}

export function summarizeInstallResults(results: readonly InstallResult[]): string {
  if (results.length === 0) return 'installError'
  if (results.some(result => result.status === 'failed')) return 'installError'
  if (results.every(result => result.status === 'missing')) return 'installMissing'
  if (results.some(result => result.status === 'missing')) return 'installPartial'
  if (results.some(result => result.status === 'installed')) return 'installRestart'
  return 'installRestart'
}

export function findCatalogItemForPackage(
  items: readonly { readonly id: string; readonly package?: { readonly name?: string } }[],
  packageName: string,
): { readonly id: string; readonly package?: { readonly name?: string } } | undefined {
  return items.find(item => item.package?.name === packageName)
}
