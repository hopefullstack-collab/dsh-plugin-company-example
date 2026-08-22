import { useEffect, useState, type ReactNode } from 'react'
import {
  LATER_RECOMMENDED_PLUGINS,
  OFFICE_IM_RECOMMENDED_PLUGINS,
  WORKSPACE_RECOMMENDED_PLUGINS,
  recommendedPackageInstalled,
  recommendedPluginsFor,
  summarizeInstallResults,
  type InstallKind,
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
    <div className="dshCompanyRoot dshCompanyExamplePage" aria-label={t('curatedTitle')}>
      <div className="dshCompanySection">
        <h2>{t('pluginsTitle')}</h2>
        <p>{t('pluginsBody')}</p>
        <div className="dshCompanyActions">
          <button
            type="button"
            className="dshCompanyButton"
            disabled={busy || WORKSPACE_RECOMMENDED_PLUGINS.every(plugin => isInstalled(plugin.packageName))}
            onClick={() => installKind('company-pack')}
          >
            {t('installWorkspace')}
          </button>
        </div>
        {WORKSPACE_RECOMMENDED_PLUGINS.map(plugin => (
          <RecommendedPluginCard
            key={plugin.packageName}
            plugin={plugin}
            t={t}
            installed={isInstalled(plugin.packageName)}
            busy={busy}
            onInstall={packageName => runInstall([packageName])}
          />
        ))}
      </div>
      <div className="dshCompanySection">
        <h2>{t('laterTitle')}</h2>
        <p>{t('laterBody')}</p>
        <div className="dshCompanyActions">
          <button
            type="button"
            className="dshCompanyButton dshCompanyButtonSecondary"
            disabled={busy || LATER_RECOMMENDED_PLUGINS.every(plugin => isInstalled(plugin.packageName))}
            onClick={() => installKind('later')}
          >
            {t('installLater')}
          </button>
        </div>
        {LATER_RECOMMENDED_PLUGINS.map(plugin => (
          <RecommendedPluginCard
            key={plugin.packageName}
            plugin={plugin}
            t={t}
            installed={isInstalled(plugin.packageName)}
            busy={busy}
            onInstall={packageName => runInstall([packageName])}
          />
        ))}
      </div>
      <div className="dshCompanySection">
        <h2>{t('officeImTitle')}</h2>
        <p>{t('officeImBody')}</p>
        <div className="dshCompanyActions">
          <button
            type="button"
            className="dshCompanyButton"
            disabled={busy || OFFICE_IM_RECOMMENDED_PLUGINS.every(plugin => isInstalled(plugin.packageName))}
            onClick={() => installKind('office-im')}
          >
            {t('installOfficeIm')}
          </button>
        </div>
        {OFFICE_IM_RECOMMENDED_PLUGINS.map(plugin => (
          <RecommendedPluginCard
            key={plugin.packageName}
            plugin={plugin}
            t={t}
            installed={isInstalled(plugin.packageName)}
            busy={busy}
            onInstall={packageName => runInstall([packageName])}
          />
        ))}
      </div>
      {install.status === 'busy' ? <p className="dshCompanyStatus">{t('installBusy')}</p> : null}
      {install.status === 'done'
        ? (
            <div className="dshCompanySection">
              <p className="dshCompanyStatus" data-tone={install.tone}>{t(install.message)}</p>
              {install.restartToken === undefined
                ? null
                : (
                    <div className="dshCompanyActions">
                      <button type="button" className="dshCompanyButton" onClick={restartNow}>
                        {t('installRestartNow')}
                      </button>
                    </div>
                  )}
            </div>
          )
        : null}
      <div className="dshCompanySection">
        <h2>{t('catalogTitle')}</h2>
        <p>{t('catalogBody')}</p>
        <div className="dshCompanyActions">
          <button
            type="button"
            className="dshCompanyButton"
            disabled={catalog.status === 'busy' || (catalog.status === 'ready' && catalog.selected)}
            onClick={addCatalog}
          >
            {t('addCatalog')}
          </button>
        </div>
        {catalog.status === 'busy' ? <p className="dshCompanyStatus">{t('catalogBusy')}</p> : null}
        {catalog.status === 'error' ? <p className="dshCompanyStatus" data-tone="error">{t('catalogError')}</p> : null}
        {catalog.status === 'ready' && catalog.selected
          ? (
              <>
                <p className="dshCompanyStatus" data-tone="ok">{t('catalogReady')}</p>
                {catalog.usedFallback
                  ? <p className="dshCompanyStatus">{t('catalogUsingFallback')}</p>
                  : null}
              </>
            )
          : null}
      </div>
    </div>
  )
}
