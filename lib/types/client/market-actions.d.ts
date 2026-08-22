/**
 * Plugin market HTTP helpers for the Example Company Settings hub.
 * Works on standard DSH Desktop with dsh-community-market composed into the profile.
 * Catalog selection prefers company-1024store, then falls back to dsh-1024store.
 */
import { companyCatalogSelected, type CatalogSourceView } from '../catalog.ts';
import { type InstallResult } from '../recommendations.ts';
export { companyCatalogSelected };
export declare function readMarketSources(signal?: AbortSignal): Promise<readonly CatalogSourceView[]>;
export interface SelectCatalogOutcome {
    readonly sources: readonly CatalogSourceView[];
    readonly usedFallback: boolean;
    readonly activeKey: string;
}
/**
 * User-initiated: add/select company catalog when Host supports it;
 * otherwise fall back to public 1024Store.
 */
export declare function selectCompanyCatalog(signal?: AbortSignal): Promise<SelectCatalogOutcome>;
export declare function readInstallations(signal?: AbortSignal): Promise<readonly {
    readonly packageName?: string;
    readonly receipt?: {
        readonly packageName: string;
    };
}[]>;
export declare function installRecommendedPlugins(packageNames: readonly string[], signal?: AbortSignal): Promise<{
    readonly results: readonly InstallResult[];
    readonly restartToken?: string;
}>;
export declare function requestRestart(restartToken: string, signal?: AbortSignal): Promise<void>;
/** Install the optional Company Pack through Plugin market (no desktop-specific API). */
export declare function installCompanyPackWithCascade(signal?: AbortSignal): Promise<{
    readonly packEnabled: boolean;
    readonly results: readonly InstallResult[];
    readonly restartToken?: string;
}>;
