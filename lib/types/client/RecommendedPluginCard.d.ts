import type { ReactNode } from 'react';
import type { RecommendedPlugin } from '../recommendations.ts';
import type { CompanyLocaleKey } from './locales.ts';
/** Market-style plugin card used by Featured / Enterprise pages. */
export declare function RecommendedPluginCard({ plugin, t, installed, busy, onInstall, sourceLabel, }: {
    readonly plugin: RecommendedPlugin;
    readonly t: (key: CompanyLocaleKey) => string;
    readonly installed: boolean;
    readonly busy: boolean;
    readonly onInstall: (packageName: string) => void;
    readonly sourceLabel?: string;
}): ReactNode;
