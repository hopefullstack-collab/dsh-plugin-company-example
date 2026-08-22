import { type ReactNode } from 'react';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
export type CompanyExampleSectionProps = PropsRuntime<'settings.section'> & PropsLocale<'company-example'>;
/** Settings.section hub owned by this company plugin. */
export declare function CompanyExampleSection({ t }: CompanyExampleSectionProps): ReactNode;
