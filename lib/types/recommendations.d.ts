/**
 * Featured / curated recommendations that travel with the company plugin.
 * Not an allowlist; catalog listing is not a security review.
 */
export type RecommendedPluginRole = 'workspace-shell' | 'workspace-context' | 'workspace-mobile' | 'office-dingtalk' | 'office-wecom' | 'company-pack';
export interface RecommendedPlugin {
    readonly packageName: string;
    readonly displayName: string;
    readonly role: RecommendedPluginRole;
    readonly repositoryUrl: string;
}
/** Workspace plugins recommended after Company Pack confirm. */
export declare const WORKSPACE_RECOMMENDED_PLUGINS: readonly RecommendedPlugin[];
/** Later optional narrow-screen recommendation. */
export declare const LATER_RECOMMENDED_PLUGINS: readonly RecommendedPlugin[];
/** Starting office-IM recommendations (not an allowlist). */
export declare const OFFICE_IM_RECOMMENDED_PLUGINS: readonly RecommendedPlugin[];
/** Optional Company Pack umbrella shown under Enterprise (install via Plugin market). */
export declare const COMPANY_PACK_RECOMMENDED_ENTRY: RecommendedPlugin;
/** Rows shown in the Enterprise confirm dialog (informational; installs go through Plugin market). */
export interface CompanyPackConfirmEntry {
    readonly packageName: string;
    readonly displayName: string;
    readonly kind: 'pack' | 'company-child' | 'community';
}
/** Build the confirm dialog list without a desktop-specific preview API. */
export declare function buildCompanyPackConfirmEntries(): readonly CompanyPackConfirmEntry[];
export type InstallKind = 'workspace' | 'office-im' | 'later' | 'company-pack';
export declare function recommendedPluginsFor(kind: InstallKind): readonly RecommendedPlugin[];
export declare function isRecommendedPackage(packageName: string): boolean;
export type InstallStatus = 'installed' | 'already' | 'missing' | 'failed';
export interface InstallResult {
    readonly packageName: string;
    readonly status: InstallStatus;
    readonly error?: string;
}
export declare function recommendedPackageInstalled(packageName: string, installations: readonly {
    readonly packageName?: string;
    readonly receipt?: {
        readonly packageName: string;
    };
}[]): boolean;
export declare function summarizeInstallResults(results: readonly InstallResult[]): string;
export declare function findCatalogItemForPackage(items: readonly {
    readonly id: string;
    readonly package?: {
        readonly name?: string;
    };
}[], packageName: string): {
    readonly id: string;
    readonly package?: {
        readonly name?: string;
    };
} | undefined;
