/** Example company sub-plugin. Extension point for SSO and org policy — no secrets. */
import type { Context } from '@deepseek-ai/cordis';
export { EXAMPLE_COMPANY_IDENTITY } from './identity.ts';
export type { CompanyIdentityExtension } from './identity.ts';
export { COMPANY_CATALOG_SOURCE_KEY, FALLBACK_CATALOG_SOURCE_KEY, companyCatalogBuiltinKeys, companyCatalogSelected, resolveCompanyCatalogSource, } from './catalog.ts';
export type { CatalogSourceView } from './catalog.ts';
export { COMPANY_PACK_RECOMMENDED_ENTRY, LATER_RECOMMENDED_PLUGINS, OFFICE_IM_RECOMMENDED_PLUGINS, WORKSPACE_RECOMMENDED_PLUGINS, isRecommendedPackage, recommendedPackageInstalled, recommendedPluginsFor, summarizeInstallResults, } from './recommendations.ts';
export type { InstallKind, InstallResult, RecommendedPlugin, RecommendedPluginRole, } from './recommendations.ts';
/** Stable Cordis plugin name. */
export declare const name = "company-example";
/**
 * Register the example company Host face.
 * Real company plugins should inject SSO here without embedding secrets.
 */
export declare function apply(ctx: Context): void;
