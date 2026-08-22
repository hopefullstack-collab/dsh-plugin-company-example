import { useEffect, useState, type ReactNode } from 'react'
import {
  buildCompanyPackConfirmEntries,
  COMPANY_PACK_RECOMMENDED_ENTRY,
  recommendedPackageInstalled,
  summarizeInstallResults,
} from '../recommendations.ts'
import type { CompanyLocaleKey } from './locales.ts'
import {
  installCompanyPackWithCascade,
  readInstallations,
  requestRestart,
} from './market-actions.ts'
import { RecommendedPluginCard } from './RecommendedPluginCard.tsx'

type InstallState =
  | { readonly status: 'idle' }
  | { readonly status: 'busy' }
  | {
    readonly status: 'confirm-company-pack'
    readonly entries: ReturnType<typeof buildCompanyPackConfirmEntries>
  }
  | { readonly status: 'done'; readonly tone: 'ok' | 'error'; readonly message: CompanyLocaleKey; readonly restartToken?: string }

export function CompanyEnterprisePage({
  t,
}: {
  readonly t: (key: CompanyLocaleKey) => string
}): ReactNode {
  const [companyPackEnabled, setCompanyPackEnabled] = useState(false)
  const [install, setInstall] = useState<InstallState>({ status: 'idle' })

  useEffect(() => {
    const controller = new AbortController()
    void readInstallations(controller.signal).then(
      (installations) => {
        setCompanyPackEnabled(
          recommendedPackageInstalled(COMPANY_PACK_RECOMMENDED_ENTRY.packageName, installations),
        )
      },
      () => undefined,
    )
    return () => controller.abort()
  }, [])

  const beginCompanyPackConfirm = (): void => {
    setInstall({
      status: 'confirm-company-pack',
      entries: buildCompanyPackConfirmEntries(),
    })
  }

  const confirmCompanyPack = (): void => {
    setInstall({ status: 'busy' })
    void installCompanyPackWithCascade().then(
      (outcome) => {
        setCompanyPackEnabled(outcome.packEnabled)
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

  const restartNow = (): void => {
    if (install.status !== 'done' || install.restartToken === undefined) return
    void requestRestart(install.restartToken).catch(() => undefined)
  }

  const busy = install.status === 'busy'

  return (
    <div className="dshCompanyContent" aria-label={t('enterpriseTitle')}>
      <div className="dshCompanySection">
        <div className="dshCompanySectionHead">
          <div>
            <h2>{t('companyPackTitle')}</h2>
            <p>{t('companyPackBody')}</p>
          </div>
        </div>
        <div className="dshCompanyGrid">
          <RecommendedPluginCard
            plugin={COMPANY_PACK_RECOMMENDED_ENTRY}
            t={t}
            installed={companyPackEnabled}
            busy={busy}
            onInstall={() => beginCompanyPackConfirm()}
            sourceLabel={t('sourceEnterprise')}
          />
        </div>
        {companyPackEnabled
          ? <div className="dshCompanyBanner" data-tone="ok">{t('companyPackRecommendationsHint')}</div>
          : null}
        {install.status === 'confirm-company-pack'
          ? (
              <div className="dshCompanySection" role="dialog" aria-label={t('confirmCompanyPackTitle')}>
                <div className="dshCompanySectionHead">
                  <div>
                    <h2>{t('confirmCompanyPackTitle')}</h2>
                    <p>{t('confirmCompanyPackBody')}</p>
                  </div>
                </div>
                <div className="dshCompanyBanner">
                  <ul className="dshCompanyFacts">
                    {install.entries.map(entry => (
                      <li key={`${entry.kind}:${entry.packageName}`}>
                        <code>{entry.packageName}</code>
                        {' — '}
                        {entry.displayName}
                        {' ('}
                        {entry.kind}
                        {')'}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dshCompanyToolbar">
                  <button type="button" className="dshCompanyButton" onClick={confirmCompanyPack}>
                    {t('confirmCompanyPack')}
                  </button>
                  <button
                    type="button"
                    className="dshCompanyButton dshCompanyButtonSecondary"
                    onClick={() => setInstall({ status: 'idle' })}
                  >
                    {t('cancelCompanyPack')}
                  </button>
                </div>
              </div>
            )
          : null}
      </div>
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
    </div>
  )
}
