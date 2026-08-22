import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type CompanyLocaleKey } from './locales.ts';
export declare const COMPANY_EXAMPLE_SETTINGS_SECTION_ID = "company-example";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'company-example': CompanyLocaleKey;
    }
}
/** Services required by the company Settings hub. */
export declare const inject: string[];
/** Register the Example Company settings hub on the client. */
export declare function apply(ctx: ClientContext): void;
