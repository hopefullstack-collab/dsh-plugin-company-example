import { useEffect, useState, type ReactNode } from 'react'
import {
  LATER_RECOMMENDED_PLUGINS,
  OFFICE_IM_RECOMMENDED_PLUGINS,
  WORKSPACE_RECOMMENDED_PLUGINS,
  recommendedPackageInstalled,
  recommendedPluginsFor,
  summarizeInstallResults,
  type InstallKind,
  type RecommendedPlugin,
} from '../recommendations.ts'
import type { CompanyLocaleKey } from './locales.ts'
import {
  companyCatalogSelected,
  installRecommendedPlugins,
  readInstallations,
  readMarketSources,
  requestRestart,
  selectCompanyCatalog,
} from './market-actions.ts'
import { RecommendedPluginCard } from './RecommendedPluginCard.tsx'

type CatalogState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly selected: boolean; readonly usedFallback?: boolean }
  | { readonly status: 'busy' }
  | { readonly status: 'error' }

type InstallState =
  | { readonly status: 'idle' }
  | { readonly status: 'busy' }
  | { readonly status: 'done'; readonly tone: 'ok' | 'error'; readonly message: CompanyLocaleKey; readonly restartToken?: string }

function PluginSection({
  title,
  body,
  actionLabel,
  actionDisabled,
  onAction,
  plugins,
  t,
  isInstalled,
  busy,
  onInstall,
}: {
  readonly title: string
  readonly body: string
  readonly actionLabel: string
  readonly actionDisabled: boolean
  readonly onAction: () => void
  readonly plugins: readonly RecommendedPlugin[]
  readonly t: (key: CompanyLocaleKey) => string
  readonly isInstalled: (packageName: string) => boolean
  readonly busy: boolean
  readonly onInstall: (packageName: string) => void
}): ReactNode {
  return (
    <div className="dshCompanySection">
      <div className="dshCompanySectionHead">
        <div>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
      </div>
      <div className="dshCompanyToolbar">
        <button type="button" className="dshCompanyButton" disabled={actionDisabled} onClick={onAction}>
          {actionLabel}
        </button>
        <span className="dshCompanyPill dshCompanyPillStatic">{plugins.length}</span>
      </div>
      <div className="dshCompanyGrid">
        {plugins.map(plugin => (
          <RecommendedPluginCard
            key={plugin.packageName}
            plugin={plugin}
            t={t}
            installed={isInstalled(plugin.packageName)}
            busy={busy}
            onInstall={onInstall}
            sourceLabel={t('sourceFeatured')}
          />
        ))}
      </div>
    </div>
  )
}

export function CompanyCuratedPage({
  t,
}: {
  readonly t: (key: CompanyLocaleKey) => string
}): ReactNode {
  const [catalog, setCatalog] = useState<CatalogState>({ status: 'loading' })
  const [installedNames, setInstalledNames] = useState<readonly string[]>([])
  const [install, setInstall] = useState<InstallState>({ status: 'idle' })

  const refreshInstallations = async (signal?: AbortSignal): Promise<void> => {
    const installations = await readInstallations(signal)
    setInstalledNames([
      ...WORKSPACE_RECOMMENDED_PLUGINS,
      ...LATER_RECOMMENDED_PLUGINS,
      ...OFFICE_IM_RECOMMENDED_PLUGINS,
    ].filter(plugin => recommendedPackageInstalled(plugin.packageName, installations)).map(plugin => plugin.packageName))
  }

  useEffect(() => {
    const controller = new AbortController()
    void readMarketSources(controller.signal).then(
      (sources) => {
        setCatalog({ status: 'ready', selected: companyCatalogSelected(sources) })
      },
      () => { setCatalog({ status: 'error' }) },
    )
    void refreshInstallations(controller.signal).catch(() => undefined)
    return () => controller.abort()
  }, [])

  const addCatalog = (): void => {
    setCatalog({ status: 'busy' })
    void selectCompanyCatalog().then(
      (outcome) => {
        setCatalog({
          status: 'ready',
          selected: companyCatalogSelected(outcome.sources),
          usedFallback: outcome.usedFallback,
        })
      },
      () => { setCatalog({ status: 'error' }) },
    )
  }

  const runInstall = (packageNames: readonly string[]): void => {
    setInstall({ status: 'busy' })
    void installRecommendedPlugins(packageNames).then(
      async (outcome) => {
        await refreshInstallations().catch(() => undefined)
        setCatalog({ status: 'ready', selected: true })
        const message = summarizeInstallResults(outcome.results) as CompanyLocaleKey
        setInstall({
          status: 'done',
          tone: message === 'installError' || message === 'installMissing' ? 'error' : 'ok',
          message,
          ...(outcome.restartToken === undefined ? {} : { restartToken: outcome.restartToken }),
        })
      },
      () => { setInstall({ status: 'done', tone: 'error', message: 'installError' }) },
    )
  }

  const installKind = (kind: InstallKind): void => {
    runInstall(recommendedPluginsFor(kind).map(plugin => plugin.packageName))
  }

  const restartNow = (): void => {
    if (install.status !== 'done' || install.restartToken === undefined) return
    void requestRestart(install.restartToken).catch(() => undefined)
  }

  const busy = catalog.status === 'busy' || install.status === 'busy'
  const isInstalled = (packageName: string): boolean => installedNames.includes(packageName)

  return (
    <div className="dshCompanyContent" aria-label={t('curatedTitle')}>
      <PluginSection
        title={t('pluginsTitle')}
        body={t('pluginsBody')}
        actionLabel={t('installWorkspace')}
        actionDisabled={busy || WORKSPACE_RECOMMENDED_PLUGINS.every(plugin => isInstalled(plugin.packageName))}
        onAction={() => installKind('company-pack')}
        plugins={WORKSPACE_RECOMMENDED_PLUGINS}
        t={t}
        isInstalled={isInstalled}
        busy={busy}
        onInstall={packageName => runInstall([packageName])}
      />
      <PluginSection
        title={t('laterTitle')}
        body={t('laterBody')}
        actionLabel={t('installLater')}
        actionDisabled={busy || LATER_RECOMMENDED_PLUGINS.every(plugin => isInstalled(plugin.packageName))}
        onAction={() => installKind('later')}
        plugins={LATER_RECOMMENDED_PLUGINS}
        t={t}
        isInstalled={isInstalled}
        busy={busy}
        onInstall={packageName => runInstall([packageName])}
      />
      <PluginSection
        title={t('officeImTitle')}
        body={t('officeImBody')}
        actionLabel={t('installOfficeIm')}
        actionDisabled={busy || OFFICE_IM_RECOMMENDED_PLUGINS.every(plugin => isInstalled(plugin.packageName))}
        onAction={() => installKind('office-im')}
        plugins={OFFICE_IM_RECOMMENDED_PLUGINS}
        t={t}
        isInstalled={isInstalled}
        busy={busy}
        onInstall={packageName => runInstall([packageName])}
      />
      {install.status === 'busy' ? <div className="dshCompanyBanner">{t('installBusy')}</div> : null}
      {install.status === 'done'
        ? (
            <div className="dshCompanyBanner" data-tone={install.tone}>
              <span>{t(install.message)}</span>
              {install.restartToken === undefined
                ? null
                : (
                    <button type="button" className="dshCompanyButton" onClick={restartNow}>
                      {t('installRestartNow')}
                    </button>
                  )}
            </div>
          )
        : null}
      <div className="dshCompanySection">
        <div className="dshCompanySectionHead">
          <div>
            <h2>{t('catalogTitle')}</h2>
            <p>{t('catalogBody')}</p>
          </div>
        </div>
        <div className="dshCompanyToolbar">
          <button
            type="button"
            className="dshCompanyButton"
            disabled={catalog.status === 'busy' || (catalog.status === 'ready' && catalog.selected)}
            onClick={addCatalog}
          >
            {t('addCatalog')}
          </button>
        </div>
        {catalog.status === 'busy' ? <div className="dshCompanyBanner">{t('catalogBusy')}</div> : null}
        {catalog.status === 'error' ? <div className="dshCompanyBanner" data-tone="error">{t('catalogError')}</div> : null}
        {catalog.status === 'ready' && catalog.selected
          ? (
              <div className="dshCompanyBanner" data-tone="ok">
                {catalog.usedFallback ? t('catalogUsingFallback') : t('catalogReady')}
              </div>
            )
          : null}
      </div>
    </div>
  )
}
