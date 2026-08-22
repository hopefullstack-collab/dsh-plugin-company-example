/**
 * Market + Company Pack HTTP helpers used by the company Settings hub.
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
export interface CompanyPackPreview {
    readonly enabled: boolean;
    readonly packageName: string;
    readonly displayName: string;
    readonly plan: {
        readonly entries: readonly {
            readonly packageName: string;
            readonly displayName: string;
            readonly kind: 'pack' | 'company-child' | 'community';
        }[];
    };
}
export declare function readCompanyPackPreview(signal?: AbortSignal): Promise<CompanyPackPreview>;
export declare function confirmCompanyPackInstall(signal?: AbortSignal): Promise<{
    readonly ok: true;
    readonly packEnabled: boolean;
}>;
export declare function installCompanyPackWithCascade(signal?: AbortSignal): Promise<{
    readonly packEnabled: boolean;
    readonly results: readonly InstallResult[];
    readonly restartToken?: string;
}>;
