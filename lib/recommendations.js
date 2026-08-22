//#region src/recommendations.ts
/** Workspace plugins recommended after Company Pack confirm. */
const WORKSPACE_RECOMMENDED_PLUGINS = Object.freeze([{
	packageName: "dsh-better-sidebar",
	displayName: "DSH-better-sidebar",
	role: "workspace-shell",
	repositoryUrl: "https://github.com/omdsh-dev/DSH-better-sidebar"
}, {
	packageName: "dsh-context",
	displayName: "dsh-context",
	role: "workspace-context",
	repositoryUrl: "https://github.com/bowenliang123/dsh-context"
}]);
/** Later optional narrow-screen recommendation. */
const LATER_RECOMMENDED_PLUGINS = Object.freeze([{
	packageName: "dsh-web-mobile",
	displayName: "dsh-web-mobile",
	role: "workspace-mobile",
	repositoryUrl: "https://github.com/mexiaosqwq/dsh-web-mobile"
}]);
/** Starting office-IM recommendations (not an allowlist). */
const OFFICE_IM_RECOMMENDED_PLUGINS = Object.freeze([{
	packageName: "dsh-dingtalk-channel",
	displayName: "dsh-dingtalk-channel",
	role: "office-dingtalk",
	repositoryUrl: "https://github.com/ttmouse/dsh-dingtalk-channel"
}, {
	packageName: "dsh-wecom",
	displayName: "dsh-wecom",
	role: "office-wecom",
	repositoryUrl: "https://github.com/TtTRz/dsh-wecom"
}]);
/** Optional Company Pack entry shown under Enterprise. */
const COMPANY_PACK_RECOMMENDED_ENTRY = Object.freeze({
	packageName: "dsh-plugin-company-pack",
	displayName: "Company Pack (example)",
	role: "company-pack",
	repositoryUrl: "https://github.com/hopefullstack-collab/deepseek-harness-desktop/tree/master/dsh-plugin-company-pack"
});
function recommendedPluginsFor(kind) {
	switch (kind) {
		case "workspace":
		case "company-pack": return WORKSPACE_RECOMMENDED_PLUGINS;
		case "office-im": return OFFICE_IM_RECOMMENDED_PLUGINS;
		case "later": return LATER_RECOMMENDED_PLUGINS;
	}
}
function isRecommendedPackage(packageName) {
	return [
		COMPANY_PACK_RECOMMENDED_ENTRY,
		...WORKSPACE_RECOMMENDED_PLUGINS,
		...LATER_RECOMMENDED_PLUGINS,
		...OFFICE_IM_RECOMMENDED_PLUGINS
	].some((plugin) => plugin.packageName === packageName);
}
function recommendedPackageInstalled(packageName, installations) {
	return installations.some((row) => row.packageName === packageName || row.receipt?.packageName === packageName);
}
function summarizeInstallResults(results) {
	if (results.length === 0) return "installError";
	if (results.some((result) => result.status === "failed")) return "installError";
	if (results.every((result) => result.status === "missing")) return "installMissing";
	if (results.some((result) => result.status === "missing")) return "installPartial";
	if (results.some((result) => result.status === "installed")) return "installRestart";
	return "installRestart";
}
function findCatalogItemForPackage(items, packageName) {
	return items.find((item) => item.package?.name === packageName);
}
//#endregion
export { COMPANY_PACK_RECOMMENDED_ENTRY, LATER_RECOMMENDED_PLUGINS, OFFICE_IM_RECOMMENDED_PLUGINS, WORKSPACE_RECOMMENDED_PLUGINS, findCatalogItemForPackage, isRecommendedPackage, recommendedPackageInstalled, recommendedPluginsFor, summarizeInstallResults };

//# sourceMappingURL=recommendations.js.map
