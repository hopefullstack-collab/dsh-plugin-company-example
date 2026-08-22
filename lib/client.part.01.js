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
		//#region src/client/market-actions.ts
		/**
		* Market + Company Pack HTTP helpers used by the company Settings hub.
		* Catalog selection prefers company-1024store, then falls back to dsh-1024store.
		*/
		async function readJson(response) {
			const value = await response.json();
			if (!response.ok) throw new Error(typeof value.error === "string" ? value.error : `request failed: ${response.status}`);
			return value;
		}
		async function readMarketSources(signal) {
			return (await readJson(await fetch("/api/community-market/state", {
				cache: "no-store",
				...signal === void 0 ? {} : { signal }
			}))).sources;
		}
		async function mutateMarketSource(mutation, signal) {
			return (await readJson(await fetch("/api/community-market/sources", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(mutation),
				...signal === void 0 ? {} : { signal }
			}))).sources;
		}
		/**
		* User-initiated: add/select company catalog when Host supports it;
		* otherwise fall back to public 1024Store.
		*/
		async function selectCompanyCatalog(signal) {
			let sources = [...await readMarketSources(signal)];
			let usedFallback = false;
			let activeKey = COMPANY_CATALOG_SOURCE_KEY;
			for (const key of companyCatalogBuiltinKeys()) {
				let source = sources.find((item) => item.builtInProviderKey === key);
				if (source === void 0) try {
					sources = [...await mutateMarketSource({
						action: "add-builtin",
						key
					}, signal)];
					source = sources.find((item) => item.builtInProviderKey === key);
				} catch {
					if (key === "company-1024store") {
						usedFallback = true;
						continue;
					}
					throw new Error("built-in catalog source unavailable");
				}
				if (source === void 0) {
					if (key === "company-1024store") {
						usedFallback = true;
						continue;
					}
