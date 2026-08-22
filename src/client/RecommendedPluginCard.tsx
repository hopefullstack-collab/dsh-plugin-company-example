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

export function RecommendedPluginCard({
  plugin,
  t,
  installed,
  busy,
  onInstall,
}: {
  readonly plugin: RecommendedPlugin
  readonly t: (key: CompanyLocaleKey) => string
  readonly installed: boolean
  readonly busy: boolean
  readonly onInstall: (packageName: string) => void
}): ReactNode {
  return (
    <article className="dshCompanyCard">
      <h3>{plugin.displayName}</h3>
      <p>{t(ROLE_KEY[plugin.role])}</p>
      <div className="dshCompanyMeta">
        <span>{t('pluginPackage')}</span>
        <code className="dshCompanyCode">{plugin.packageName}</code>
        <a href={plugin.repositoryUrl} target="_blank" rel="noreferrer">{t('openRepository')}</a>
      </div>
      <div className="dshCompanyActions">
        <button
          type="button"
          className="dshCompanyButton dshCompanyButtonSecondary"
          disabled={busy || installed}
          onClick={() => onInstall(plugin.packageName)}
        >
          {installed ? t('installed') : t('installPlugin')}
        </button>
      </div>
    </article>
  )
}
