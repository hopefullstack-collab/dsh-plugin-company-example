import type { ReactNode } from 'react';
import type { RecommendedPlugin } from '../recommendations.ts';
import type { CompanyLocaleKey } from './locales.ts';
export declare function RecommendedPluginCard({ plugin, t, installed, busy, onInstall, }: {
    readonly plugin: RecommendedPlugin;
    readonly t: (key: CompanyLocaleKey) => string;
    readonly installed: boolean;
    readonly busy: boolean;
    readonly onInstall: (packageName: string) => void;
}): ReactNode;
