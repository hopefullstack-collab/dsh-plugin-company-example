import type { ReactNode } from 'react'
import type { RecommendedPlugin } from '../recommendations.ts'
import type { CompanyLocaleKey } from './locales.ts'

const ROLE_KEY: Record<RecommendedPlugin['role'], CompanyLocaleKey> = {
  'workspace-shell': 'pluginWorkspaceShell',
  'workspace-context': 'pluginWorkspaceContext',
  'workspace-mobile': 'pluginWorkspaceMobile',
  'office-dingtalk': 'pluginOfficeDingtalk',
  'office-wecom': 'pluginOfficeWecom',
  'company-pack': 'pluginCompanyPack',
}

function glyphLabel(packageName: string): string {
  const parts = packageName.replace(/^dsh-/, '').split('-').filter(Boolean)
  if (parts.length === 0) return 'DSH'
  if (parts.length === 1) return (parts[0] ?? 'DSH').slice(0, 2).toUpperCase()
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
}

/** Market-style plugin card used by Featured / Enterprise pages. */
export function RecommendedPluginCard({
  plugin,
  t,
  installed,
  busy,
  onInstall,
  sourceLabel,
}: {
  readonly plugin: RecommendedPlugin
  readonly t: (key: CompanyLocaleKey) => string
  readonly installed: boolean
  readonly busy: boolean
  readonly onInstall: (packageName: string) => void
  readonly sourceLabel?: string
}): ReactNode {
  const actionLabel = installed ? t('installed') : t('installPlugin')
  return (
    <article className="dshCompanyCard">
      <div className="dshCompanyCardTop">
        <div className="dshCompanyGlyph" aria-hidden="true">{glyphLabel(plugin.packageName)}</div>
        <div className="dshCompanyCardName">
          <strong>{plugin.displayName}</strong>
          <span>{plugin.packageName}</span>
        </div>
      </div>
      <p className="dshCompanySummary">{t(ROLE_KEY[plugin.role])}</p>
      <div className="dshCompanyTags">
        <span className="dshCompanyTag">{sourceLabel ?? t('sourceFeatured')}</span>
        <button
          type="button"
          className="dshCompanyTag dshCompanyTagAction"
          disabled={busy || installed}
          onClick={() => onInstall(plugin.packageName)}
        >
          {actionLabel}
        </button>
        <a className="dshCompanyTag" href={plugin.repositoryUrl} target="_blank" rel="noreferrer">
          {t('openRepository')}
        </a>
      </div>
    </article>
  )
}
