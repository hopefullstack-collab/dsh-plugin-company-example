import { useEffect, useState, type ReactNode } from 'react'
import { COMPANY_PACK_RECOMMENDED_ENTRY, summarizeInstallResults } from '../recommendations.ts'
import type { CompanyLocaleKey } from './locales.ts'
import {
  installCompanyPackWithCascade,
  readCompanyPackPreview,
  requestRestart,
} from './market-actions.ts'

type InstallState =
  | { readonly status: 'idle' }
  | { readonly status: 'busy' }
  | {
    readonly status: 'confirm-company-pack'
    readonly entries: readonly { readonly packageName: string; readonly displayName: string; readonly kind: string }[]
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
    void readCompanyPackPreview(controller.signal).then(
      (preview) => { setCompanyPackEnabled(preview.enabled) },
      () => undefined,
    )
    return () => controller.abort()
  }, [])

  const beginCompanyPackConfirm = (): void => {
    void readCompanyPackPreview().then(
      (preview) => {
        setInstall({
          status: 'confirm-company-pack',
          entries: preview.plan.entries,
        })
      },
      () => { setInstall({ status: 'done', tone: 'error', message: 'installError' }) },
    )
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
    <div className="dshCompanyRoot dshCompanyExamplePage" aria-label={t('enterpriseTitle')}>
      <div className="dshCompanySection">
        <h2>{t('companyPackTitle')}</h2>
        <p>{t('companyPackBody')}</p>
        <article className="dshCompanyCard">
          <h3>{COMPANY_PACK_RECOMMENDED_ENTRY.displayName}</h3>
          <p>{t('pluginCompanyPack')}</p>
          <div className="dshCompanyMeta">
            <span>{t('pluginPackage')}</span>
            <code className="dshCompanyCode">{COMPANY_PACK_RECOMMENDED_ENTRY.packageName}</code>
            <a href={COMPANY_PACK_RECOMMENDED_ENTRY.repositoryUrl} target="_blank" rel="noreferrer">{t('openRepository')}</a>
          </div>
          <div className="dshCompanyActions">
            <button
              type="button"
              className="dshCompanyButton"
              disabled={busy || companyPackEnabled}
              onClick={beginCompanyPackConfirm}
            >
              {companyPackEnabled ? t('installed') : t('installCompanyPack')}
            </button>
          </div>
        </article>
        {companyPackEnabled
          ? <p className="dshCompanyStatus" data-tone="ok">{t('companyPackRecommendationsHint')}</p>
          : null}
        {install.status === 'confirm-company-pack'
          ? (
              <div className="dshCompanySection" role="dialog" aria-label={t('confirmCompanyPackTitle')}>
                <h2>{t('confirmCompanyPackTitle')}</h2>
                <p>{t('confirmCompanyPackBody')}</p>
                <ul>
                  {install.entries.map(entry => (
                    <li key={`${entry.kind}:${entry.packageName}`}>
                      <code className="dshCompanyCode">{entry.packageName}</code>
                      {' '}
                      —
                      {' '}
                      {entry.displayName}
                      {' '}
                      (
                      {entry.kind}
                      )
                    </li>
                  ))}
                </ul>
                <div className="dshCompanyActions">
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
    </div>
  )
}
