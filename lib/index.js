import { EXAMPLE_COMPANY_IDENTITY } from "./identity.js";
import { COMPANY_CATALOG_SOURCE_KEY, FALLBACK_CATALOG_SOURCE_KEY, companyCatalogBuiltinKeys, companyCatalogSelected, resolveCompanyCatalogSource } from "./catalog.js";
import { COMPANY_PACK_RECOMMENDED_ENTRY, LATER_RECOMMENDED_PLUGINS, OFFICE_IM_RECOMMENDED_PLUGINS, WORKSPACE_RECOMMENDED_PLUGINS, isRecommendedPackage, recommendedPackageInstalled, recommendedPluginsFor, summarizeInstallResults } from "./recommendations.js";
//#region src/index.ts
/** Stable Cordis plugin name. */
const name = "company-example";
/**
* Register the example company Host face.
* Real company plugins should inject SSO here without embedding secrets.
*/
function apply(ctx) {
	ctx.logger.info(`company-example: loaded for ${EXAMPLE_COMPANY_IDENTITY.displayName} (SSO extension point idle; no secrets in package)`);
}
//#endregion
export { COMPANY_CATALOG_SOURCE_KEY, COMPANY_PACK_RECOMMENDED_ENTRY, EXAMPLE_COMPANY_IDENTITY, FALLBACK_CATALOG_SOURCE_KEY, LATER_RECOMMENDED_PLUGINS, OFFICE_IM_RECOMMENDED_PLUGINS, WORKSPACE_RECOMMENDED_PLUGINS, apply, companyCatalogBuiltinKeys, companyCatalogSelected, isRecommendedPackage, name, recommendedPackageInstalled, recommendedPluginsFor, resolveCompanyCatalogSource, summarizeInstallResults };

//# sourceMappingURL=index.js.map