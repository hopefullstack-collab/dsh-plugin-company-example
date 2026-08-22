import { useState, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { EXAMPLE_COMPANY_IDENTITY } from '../identity.ts'
import type { CompanyLocaleKey } from './locales.ts'
import { CompanyCuratedPage } from './CompanyCuratedPage.tsx'
import { CompanyEnterprisePage } from './CompanyEnterprisePage.tsx'

const PACKAGE_NAME = 'dsh-plugin-company-example'
const PACKAGE_VERSION = '0.1.1'

type CompanyExamplePage = 'builtin' | 'enterprise' | 'curated'

const PAGES: readonly { readonly id: CompanyExamplePage; readonly label: CompanyLocaleKey }[] = [
  { id: 'builtin', label: 'tabBuiltin' },
  { id: 'enterprise', label: 'tabEnterprise' },
  { id: 'curated', label: 'tabCurated' },
]

export type CompanyExampleSectionProps = PropsRuntime<'settings.section'>
  & PropsLocale<'company-example'>

function BuiltinPage({ t }: { readonly t: CompanyExampleSectionProps['t'] }): ReactNode {
  return (
    <div className="dshCompanyContent">
      <div className="dshCompanySection">
        <div className="dshCompanySectionHead">
          <div>
            <h2>{t('generalTitle')}</h2>
            <p>{t('identityDesc')}</p>
          </div>
        </div>
        <div className="dshCompanyGroup">
          <div className="dshCompanyRow">
            <span className="dshCompanyRowText">
              <span className="dshCompanyRowTitle">{t('identityTitle')}</span>
              <span className="dshCompanyRowDesc">{t('identityDesc')}</span>
            </span>
            <span className="dshCompanyRowValue">{EXAMPLE_COMPANY_IDENTITY.displayName}</span>
          </div>
          <div className="dshCompanyRow">
            <span className="dshCompanyRowText">
              <span className="dshCompanyRowTitle">{t('ssoTitle')}</span>
              <span className="dshCompanyRowDesc">{t('ssoDesc')}</span>
            </span>
            <span className="dshCompanyRowValue">{t('ssoIdle')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Settings.section hub owned by this company plugin — market-matched chrome. */
export function CompanyExampleSection({ t }: CompanyExampleSectionProps): ReactNode {
  const [page, setPage] = useState<CompanyExamplePage>('builtin')
  return (
    <div className="dshCompanyRoot">
      <div className="dshCompanyHeader">
        <div className="dshCompanyHeaderTitle">
          <h2>{t('nav')}</h2>
          <p>{t('intro')}</p>
        </div>
      </div>
      <div className="dshCompanyViewBar">
        <div className="dshCompanyViewSwitch" role="group" aria-label={t('pagesNav')}>
          {PAGES.map(entry => (
            <button
              key={entry.id}
              type="button"
              className="dshCompanyPill"
              data-active={page === entry.id ? 'true' : undefined}
              aria-pressed={page === entry.id}
              onClick={() => { setPage(entry.id) }}
            >
              {t(entry.label)}
            </button>
          ))}
        </div>
        <div className="dshCompanyVersionChip">
          <strong>{PACKAGE_NAME}</strong>
          <span>{`v${PACKAGE_VERSION}`}</span>
        </div>
      </div>
      {page === 'builtin' ? <BuiltinPage t={t} /> : null}
      {page === 'enterprise' ? <CompanyEnterprisePage t={t} /> : null}
      {page === 'curated' ? <CompanyCuratedPage t={t} /> : null}
    </div>
  )
}
