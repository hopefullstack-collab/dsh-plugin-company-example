window.__ModuleLoader__.load({
	id: "dsh-plugin-company-example",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/identity.ts
		/** Example identity surface with no credentials. */
		const EXAMPLE_COMPANY_IDENTITY = Object.freeze({ displayName: "Example Company" });
		//#endregion
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
		/** Optional Company Pack umbrella shown under Enterprise (install via Plugin market). */
		const COMPANY_PACK_RECOMMENDED_ENTRY = Object.freeze({
			packageName: "dsh-plugin-company-pack",
			displayName: "Company Pack (example)",
			role: "company-pack",
			repositoryUrl: "https://github.com/hopefullstack-collab/dsh-plugin-company-example#optional-company-pack"
		});
		/** Build the confirm dialog list without a desktop-specific preview API. */
		function buildCompanyPackConfirmEntries() {
			return Object.freeze([
				{
					packageName: COMPANY_PACK_RECOMMENDED_ENTRY.packageName,
					displayName: COMPANY_PACK_RECOMMENDED_ENTRY.displayName,
					kind: "pack"
				},
				{
					packageName: "dsh-plugin-company-example",
					displayName: "Example Company",
					kind: "company-child"
				},
				...WORKSPACE_RECOMMENDED_PLUGINS.map((plugin) => ({
					packageName: plugin.packageName,
					displayName: plugin.displayName,
					kind: "community"
				}))
			]);
		}
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
		//#region src/client/market-actions.ts
		/**
		* Plugin market HTTP helpers for the Example Company Settings hub.
		* Works on standard DSH Desktop with dsh-community-market composed into the profile.
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
					throw new Error("built-in catalog source unavailable");
				}
				activeKey = key;
				if (key === "dsh-1024store") usedFallback = true;
				if (!source.enabled) sources = [...await mutateMarketSource({
					action: "select",
					sourceRecordId: source.sourceRecordId
				}, signal)];
				return {
					sources,
					usedFallback: usedFallback || key === "dsh-1024store",
					activeKey
				};
			}
			throw new Error("built-in catalog source unavailable");
		}
		async function readInstallations(signal) {
			return (await readJson(await fetch("/api/community-market/installations", {
				cache: "no-store",
				...signal === void 0 ? {} : { signal }
			}))).installations;
		}
		async function searchCatalogItems(sourceRecordId, packageName, signal) {
			const url = new URL("/api/community-market/catalog", window.location.origin);
			url.searchParams.set("sourceRecordId", sourceRecordId);
			url.searchParams.set("q", packageName);
			url.searchParams.set("limit", "50");
			url.searchParams.set("locale", "zh");
			return (await readJson(await fetch(url, {
				cache: "no-store",
				...signal === void 0 ? {} : { signal }
			}))).results.flatMap((result) => result.snapshot?.items ?? []);
		}
		async function previewAndExecuteInstall(sourceRecordId, itemId, signal) {
			const preview = await readJson(await fetch("/api/community-market/operations/preview", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					action: "install",
					sourceRecordId,
					itemId
				}),
				...signal === void 0 ? {} : { signal }
			}));
			if (preview.action !== "install") throw new Error("operation preview action mismatch");
			const executed = await readJson(await fetch("/api/community-market/operations/execute", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ previewId: preview.previewId }),
				...signal === void 0 ? {} : { signal }
			}));
			if (executed.action !== "install") throw new Error("operation response action mismatch");
			return executed.restartToken;
		}
		async function installRecommendedPlugins(packageNames, signal) {
			if (packageNames.length === 0) throw new Error("no recommended plugins requested");
			if (packageNames.some((packageName) => !isRecommendedPackage(packageName))) throw new Error("company plugin can only install its r