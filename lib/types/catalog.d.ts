/**
 * Company catalog source selection.
 * Prefer a future company 1024Store; fall back to the public DSH 1024Store.
 * Selection is always user-initiated — never silent at boot.
 */
/** Placeholder built-in key for a future company-internal 1024Store. */
export declare const COMPANY_CATALOG_SOURCE_KEY = "company-1024store";
/** Public DSH catalog used until the company store is registered in Market. */
export declare const FALLBACK_CATALOG_SOURCE_KEY = "dsh-1024store";
export interface CatalogSourceView {
    readonly sourceRecordId: string;
    readonly enabled: boolean;
    readonly builtInProviderKey?: string;
}
/** True when the preferred company catalog (or fallback) is selected. */
export declare function companyCatalogSelected(sources: readonly CatalogSourceView[], preferredKey?: string, fallbackKey?: string): boolean;
/** Pick the active catalog source record: company key first, then fallback. */
export declare function resolveCompanyCatalogSource(sources: readonly CatalogSourceView[], preferredKey?: string, fallbackKey?: string): CatalogSourceView | undefined;
/** Ordered keys to try when adding/selecting a built-in catalog. */
export declare function companyCatalogBuiltinKeys(preferredKey?: string, fallbackKey?: string): readonly string[];
