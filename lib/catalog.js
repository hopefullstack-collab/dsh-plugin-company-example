//#region src/catalog.ts
/**
* Company catalog source selection.
* Prefer a future company 1024Store; fall back to the public DSH 1024Store.
* Selection is always user-initiated — never silent at boot.
*/
/** Placeholder built-in key for a future company-internal 1024Store. */
const COMPANY_CATALOG_SOURCE_KEY = "company-1024store";
/** Public DSH catalog used until the company store is registered in Market. */
const FALLBACK_CATALOG_SOURCE_KEY = "dsh-1024store";
/** True when the preferred company catalog (or fallback) is selected. */
function companyCatalogSelected(sources, preferredKey = COMPANY_CATALOG_SOURCE_KEY, fallbackKey = FALLBACK_CATALOG_SOURCE_KEY) {
	if (sources.find((source) => source.builtInProviderKey === preferredKey && source.enabled) !== void 0) return true;
	return sources.some((source) => source.builtInProviderKey === fallbackKey && source.enabled);
}
/** Pick the active catalog source record: company key first, then fallback. */
function resolveCompanyCatalogSource(sources, preferredKey = COMPANY_CATALOG_SOURCE_KEY, fallbackKey = FALLBACK_CATALOG_SOURCE_KEY) {
	return sources.find((source) => source.builtInProviderKey === preferredKey && source.enabled) ?? sources.find((source) => source.builtInProviderKey === fallbackKey && source.enabled);
}
/** Ordered keys to try when adding/selecting a built-in catalog. */
function companyCatalogBuiltinKeys(preferredKey = COMPANY_CATALOG_SOURCE_KEY, fallbackKey = FALLBACK_CATALOG_SOURCE_KEY) {
	return preferredKey === fallbackKey ? [fallbackKey] : [preferredKey, fallbackKey];
}
//#endregion
export { COMPANY_CATALOG_SOURCE_KEY, FALLBACK_CATALOG_SOURCE_KEY, companyCatalogBuiltinKeys, companyCatalogSelected, resolveCompanyCatalogSource };

//# sourceMappingURL=catalog.js.map
