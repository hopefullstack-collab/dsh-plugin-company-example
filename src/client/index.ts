import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { CompanyExampleSection } from './CompanyExampleSection.tsx'
import { en, zh, type CompanyLocaleKey } from './locales.ts'
import { installCompanyStyles } from './styles.ts'

const LOCALE_NS = 'company-example'
export const COMPANY_EXAMPLE_SETTINGS_SECTION_ID = 'company-example'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'company-example': CompanyLocaleKey
  }
}

/** Services required by the company Settings hub. */
export const inject = ['slots', 'locale']

/** Register the Example Company settings hub on the client. */
export function apply(ctx: ClientContext): void {
  ctx.effect(
    () => ctx.locale.register(LOCALE_NS, { zh, en }),
    'dsh-plugin-company-example: locales',
  )
  ctx.effect(
    () => installCompanyStyles(),
    'dsh-plugin-company-example: styles',
  )
  const t = ctx.locale.bind(LOCALE_NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: COMPANY_EXAMPLE_SETTINGS_SECTION_ID,
    order: 90,
    label: () => t('nav'),
    locale: LOCALE_NS,
  }, CompanyExampleSection))
}
