import { useState, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { EXAMPLE_COMPANY_IDENTITY } from '../identity.ts'
import type { CompanyLocaleKey } from './locales.ts'
import { CompanyCuratedPage } from './CompanyCuratedPage.tsx'
import { CompanyEnterprisePage } from './CompanyEnterprisePage.tsx'

const PACKAGE_NAME = 'dsh-plugin-company-example'
const PACKAGE_VERSION = '0.1.0'

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
    <div className="dshCompanyExamplePage">
      <div className="dshCompanyExampleGroup">
        <div className="dshCompanyExampleGroupHeading">{t('generalTitle')}</div>
        <div className="dshCompanyExampleRow">
          <span className="dshCompanyExampleRowText">
            <span className="dshCompanyExampleTitle">{t('identityTitle')}</span>
            <span className="dshCompanyExampleDesc">{t('identityDesc')}</span>
          </span>
          <span className="dshCompanyExampleValue">{EXAMPLE_COMPANY_IDENTITY.displayName}</span>
        </div>
        <div className="dshCompanyExampleRow">
          <span className="dshCompanyExampleRowText">
            <span className="dshCompanyExampleTitle">{t('ssoTitle')}</span>
            <span className="dshCompanyExampleDesc">{t('ssoDesc')}</span>
          </span>
          <span className="dshCompanyExampleValue">{t('ssoIdle')}</span>
        </div>
      </div>
    </div>
  )
}

/** Settings.section hub owned by this company plugin. */
export function CompanyExampleSection({ t }: CompanyExampleSectionProps): ReactNode {
  const [page, setPage] = useState<CompanyExamplePage>('builtin')
  return (
    <div className="dshCompanyExampleSection">
      <p className="dshCompanyExampleIntro">{t('intro')}</p>
      <div className="dshCompanyExampleVersionBadge">
        <span className="dshCompanyExampleVersionBadgeName">{PACKAGE_NAME}</span>
        <span className="dshCompanyExampleVersionBadgeTag">{`v${PACKAGE_VERSION}`}</span>
      </div>
      <nav className="dshCompanyExampleSubnav" aria-label={t('pagesNav')}>
        {PAGES.map(entry => (
          <button
            key={entry.id}
            type="button"
            data-active={page === entry.id ? 'true' : undefined}
            onClick={() => { setPage(entry.id) }}
          >
            {t(entry.label)}
          </button>
        ))}
      </nav>
      {page === 'builtin' ? <BuiltinPage t={t} /> : null}
      {page === 'enterprise' ? <CompanyEnterprisePage t={t} /> : null}
      {page === 'curated' ? <CompanyCuratedPage t={t} /> : null}
    </div>
  )
}
