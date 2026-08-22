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
			if (packageNames.some((packageName) => !isRecommendedPackage(packageName))) throw new Error("company plugin can only install its recommended plugins");
			const source = resolveCompanyCatalogSource((await selectCompanyCatalog(signal)).sources);
			if (source === void 0) throw new Error("built-in catalog source unavailable");
			const installations = [...await readInstallations(signal)];
			const results = [];
			let restartToken;
			for (const packageName of packageNames) {
				if (recommendedPackageInstalled(packageName, installations)) {
					results.push({
						packageName,
						status: "already"
					});
					continue;
				}
				try {
					const item = findCatalogItemForPackage(await searchCatalogItems(source.sourceRecordId, packageName, signal), packageName);
					if (item === void 0) {
						results.push({
							packageName,
							status: "missing"
						});
						continue;
					}
					const nextToken = await previewAndExecuteInstall(source.sourceRecordId, item.id, signal);
					if (nextToken !== void 0) restartToken = nextToken;
					installations.push({ packageName });
					results.push({
						packageName,
						status: "installed"
					});
				} catch (cause) {
					results.push({
						packageName,
						status: "failed",
						error: cause instanceof Error ? cause.message : "install failed"
					});
				}
			}
			return restartToken === void 0 ? { results } : {
				results,
				restartToken
			};
		}
		async function requestRestart(restartToken, signal) {
			await readJson(await fetch("/api/community-market/desktop/request-restart", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ restartToken }),
				...signal === void 0 ? {} : { signal }
			}));
		}
		async function readCompanyPackPreview(signal) {
			return await readJson(await fetch("/api/desktop/company-pack", {
				cache: "no-store",
				...signal === void 0 ? {} : { signal }
			}));
		}
		async function confirmCompanyPackInstall(signal) {
			return await readJson(await fetch("/api/desktop/company-pack/confirm", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					confirmed: true,
					communityTargets: []
				}),
				...signal === void 0 ? {} : { signal }
			}));
		}
		async function installCompanyPackWithCascade(signal) {
			const preview = await readCompanyPackPreview(signal);
			if (!preview.enabled) await confirmCompanyPackInstall(signal);
			const communityNames = preview.plan.entries.filter((entry) => entry.kind === "community").map((entry) => entry.packageName);
			if (communityNames.length === 0) return {
				packEnabled: true,
				results: [{
					packageName: preview.packageName,
					status: "installed"
				}]
			};
			const outcome = await installRecommendedPlugins(communityNames, signal);
			return {
				packEnabled: true,
				results: [{
					packageName: preview.packageName,
					status: preview.enabled ? "already" : "installed"
				}, ...outcome.results],
				...outcome.restartToken === void 0 ? {} : { restartToken: outcome.restartToken }
			};
		}
		//#endregion
		//#region src/client/RecommendedPluginCard.tsx
		const ROLE_KEY = {
			"workspace-shell": "pluginWorkspaceShell",
			"workspace-context": "pluginWorkspaceContext",
			"workspace-mobile": "pluginWorkspaceMobile",
			"office-dingtalk": "pluginOfficeDingtalk",
			"office-wecom": "pluginOfficeWecom",
			"company-pack": "pluginCompanyPack"
		};
		function glyphLabel(packageName) {
			const parts = packageName.replace(/^dsh-/, "").split("-").filter(Boolean);
			if (parts.length === 0) return "DSH";
			if (parts.length === 1) return (parts[0] ?? "DSH").slice(0, 2).toUpperCase();
			return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
		}
		/** Market-style plugin card used by Featured / Enterprise pages. */
		function RecommendedPluginCard({ plugin, t, installed, busy, onInstall, sourceLabel }) {
			const actionLabel = installed ? t("installed") : t("installPlugin");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: "dshCompanyCard",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanyCardTop",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dshCompanyGlyph",
							"aria-hidden": "true",
							children: glyphLabel(plugin.packageName)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dshCompanyCardName",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: plugin.displayName }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: plugin.packageName })]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dshCompanySummary",
						children: t(ROLE_KEY[plugin.role])
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanyTags",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dshCompanyTag",
								children: sourceLabel ?? t("sourceFeatured")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dshCompanyTag dshCompanyTagAction",
								disabled: busy || installed,
								onClick: () => onInstall(plugin.packageName),
								children: actionLabel
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
								className: "dshCompanyTag",
								href: plugin.repositoryUrl,
								target: "_blank",
								rel: "noreferrer",
								children: t("openRepository")
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region src/client/CompanyCuratedPage.tsx
		function PluginSection({ title, body, actionLabel, actionDisabled, onAction, plugins, t, isInstalled, busy, onInstall }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dshCompanySection",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dshCompanySectionHead",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: title }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: body })] })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanyToolbar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dshCompanyButton",
							disabled: actionDisabled,
							onClick: onAction,
							children: actionLabel
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dshCompanyPill dshCompanyPillStatic",
							children: plugins.length
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dshCompanyGrid",
						children: plugins.map((plugin) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecommendedPluginCard, {
							plugin,
							t,
							installed: isInstalled(plugin.packageName),
							busy,
							onInstall,
							sourceLabel: t("sourceFeatured")
						}, plugin.packageName))
					})
				]
			});
		}
		function CompanyCuratedPage({ t }) {
			const [catalog, setCatalog] = (0, react.useState)({ status: "loading" });
			const [installedNames, setInstalledNames] = (0, react.useState)([]);
			const [install, setInstall] = (0, react.useState)({ status: "idle" });
			const refreshInstallations = async (signal) => {
				const installations = await readInstallations(signal);
				setInstalledNames([
					...WORKSPACE_RECOMMENDED_PLUGINS,
					...LATER_RECOMMENDED_PLUGINS,
					...OFFICE_IM_RECOMMENDED_PLUGINS
				].filter((plugin) => recommendedPackageInstalled(plugin.packageName, installations)).map((plugin) => plugin.packageName));
			};
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				readMarketSources(controller.signal).then((sources) => {
					setCatalog({
						status: "ready",
						selected: companyCatalogSelected(sources)
					});
				}, () => {
					setCatalog({ status: "error" });
				});
				refreshInstallations(controller.signal).catch(() => void 0);
				return () => controller.abort();
			}, []);
			const addCatalog = () => {
				setCatalog({ status: "busy" });
				selectCompanyCatalog().then((outcome) => {
					setCatalog({
						status: "ready",
						selected: companyCatalogSelected(outcome.sources),
						usedFallback: outcome.usedFallback
					});
				}, () => {
					setCatalog({ status: "error" });
				});
			};
			const runInstall = (packageNames) => {
				setInstall({ status: "busy" });
				installRecommendedPlugins(packageNames).then(async (outcome) => {
					await refreshInstallations().catch(() => void 0);
					setCatalog({
						status: "ready",
						selected: true
					});
					const message = summarizeInstallResults(outcome.results);
					setInstall({
						status: "done",
						tone: message === "installError" || message === "installMissing" ? "error" : "ok",
						message,
						...outcome.restartToken === void 0 ? {} : { restartToken: outcome.restartToken }
					});
				}, () => {
					setInstall({
						status: "done",
						tone: "error",
						message: "installError"
					});
				});
			};
			const installKind = (kind) => {
				runInstall(recommendedPluginsFor(kind).map((plugin) => plugin.packageName));
			};
			const restartNow = () => {
				if (install.status !== "done" || install.restartToken === void 0) return;
				requestRestart(install.restartToken).catch(() => void 0);
			};
			const busy = catalog.status === "busy" || install.status === "busy";
			const isInstalled = (packageName) => installedNames.includes(packageName);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dshCompanyContent",
				"aria-label": t("curatedTitle"),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PluginSection, {
						title: t("pluginsTitle"),
						body: t("pluginsBody"),
						actionLabel: t("installWorkspace"),
						actionDisabled: busy || WORKSPACE_RECOMMENDED_PLUGINS.every((plugin) => isInstalled(plugin.packageName)),
						onAction: () => installKind("company-pack"),
						plugins: WORKSPACE_RECOMMENDED_PLUGINS,
						t,
						isInstalled,
						busy,
						onInstall: (packageName) => runInstall([packageName])
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PluginSection, {
						title: t("laterTitle"),
						body: t("laterBody"),
						actionLabel: t("installLater"),
						actionDisabled: busy || LATER_RECOMMENDED_PLUGINS.every((plugin) => isInstalled(plugin.packageName)),
						onAction: () => installKind("later"),
						plugins: LATER_RECOMMENDED_PLUGINS,
						t,
						isInstalled,
						busy,
						onInstall: (packageName) => runInstall([packageName])
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PluginSection, {
						title: t("officeImTitle"),
						body: t("officeImBody"),
						actionLabel: t("installOfficeIm"),
						actionDisabled: busy || OFFICE_IM_RECOMMENDED_PLUGINS.every((plugin) => isInstalled(plugin.packageName)),
						onAction: () => installKind("office-im"),
						plugins: OFFICE_IM_RECOMMENDED_PLUGINS,
						t,
						isInstalled,
						busy,
						onInstall: (packageName) => runInstall([packageName])
					}),
					install.status === "busy" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dshCompanyBanner",
						children: t("installBusy")
					}) : null,
					install.status === "done" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanyBanner",
						"data-tone": install.tone,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(install.message) }), install.restartToken === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dshCompanyButton",
							onClick: restartNow,
							children: t("installRestartNow")
						})]
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanySection",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanySectionHead",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("catalogTitle") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("catalogBody") })] })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyToolbar",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dshCompanyButton",
									disabled: catalog.status === "busy" || catalog.status === "ready" && catalog.selected,
									onClick: addCatalog,
									children: t("addCatalog")
								})
							}),
							catalog.status === "busy" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyBanner",
								children: t("catalogBusy")
							}) : null,
							catalog.status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyBanner",
								"data-tone": "error",
								children: t("catalogError")
							}) : null,
							catalog.status === "ready" && catalog.selected ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyBanner",
								"data-tone": "ok",
								children: catalog.usedFallback ? t("catalogUsingFallback") : t("catalogReady")
							}) : null
						]
					})
				]
			});
		}
		//#endregion
		//#region src/client/CompanyEnterprisePage.tsx
		function CompanyEnterprisePage({ t }) {
			const [companyPackEnabled, setCompanyPackEnabled] = (0, react.useState)(false);
			const [install, setInstall] = (0, react.useState)({ status: "idle" });
			(0, react.useEffect)(() => {
				const controller = new AbortController();
				readCompanyPackPreview(controller.signal).then((preview) => {
					setCompanyPackEnabled(preview.enabled);
				}, () => void 0);
				return () => controller.abort();
			}, []);
			const beginCompanyPackConfirm = () => {
				readCompanyPackPreview().then((preview) => {
					setInstall({
						status: "confirm-company-pack",
						entries: preview.plan.entries
					});
				}, () => {
					setInstall({
						status: "done",
						tone: "error",
						message: "installError"
					});
				});
			};
			const confirmCompanyPack = () => {
				setInstall({ status: "busy" });
				installCompanyPackWithCascade().then((outcome) => {
					setCompanyPackEnabled(outcome.packEnabled);
					const message = summarizeInstallResults(outcome.results);
					setInstall({
						status: "done",
						tone: message === "installError" || message === "installMissing" ? "error" : "ok",
						message,
						...outcome.restartToken === void 0 ? {} : { restartToken: outcome.restartToken }
					});
				}, () => {
					setInstall({
						status: "done",
						tone: "error",
						message: "installError"
					});
				});
			};
			const restartNow = () => {
				if (install.status !== "done" || install.restartToken === void 0) return;
				requestRestart(install.restartToken).catch(() => void 0);
			};
			const busy = install.status === "busy";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dshCompanyContent",
				"aria-label": t("enterpriseTitle"),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanySection",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanySectionHead",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("companyPackTitle") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("companyPackBody") })] })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyGrid",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecommendedPluginCard, {
									plugin: COMPANY_PACK_RECOMMENDED_ENTRY,
									t,
									installed: companyPackEnabled,
									busy,
									onInstall: () => beginCompanyPackConfirm(),
									sourceLabel: t("sourceEnterprise")
								})
							}),
							companyPackEnabled ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyBanner",
								"data-tone": "ok",
								children: t("companyPackRecommendationsHint")
							}) : null,
							install.status === "confirm-company-pack" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dshCompanySection",
								role: "dialog",
								"aria-label": t("confirmCompanyPackTitle"),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "dshCompanySectionHead",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("confirmCompanyPackTitle") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("confirmCompanyPackBody") })] })
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "dshCompanyBanner",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
											className: "dshCompanyFacts",
											children: install.entries.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: entry.packageName }),
												" — ",
												entry.displayName,
												" (",
												entry.kind,
												")"
											] }, `${entry.kind}:${entry.packageName}`))
										})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dshCompanyToolbar",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dshCompanyButton",
											onClick: confirmCompanyPack,
											children: t("confirmCompanyPack")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dshCompanyButton dshCompanyButtonSecondary",
											onClick: () => setInstall({ status: "idle" }),
											children: t("cancelCompanyPack")
										})]
									})
								]
							}) : null
						]
					}),
					install.status === "busy" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dshCompanyBanner",
						children: t("installBusy")
					}) : null,
					install.status === "done" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanyBanner",
						"data-tone": install.tone,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(install.message) }), install.restartToken === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dshCompanyButton",
							onClick: restartNow,
							children: t("installRestartNow")
						})]
					}) : null
				]
			});
		}
		//#endregion
		//#region src/client/CompanyExampleSection.tsx
		const PACKAGE_NAME = "dsh-plugin-company-example";
		const PACKAGE_VERSION = "0.1.1";
		const PAGES = [
			{
				id: "builtin",
				label: "tabBuiltin"
			},
			{
				id: "enterprise",
				label: "tabEnterprise"
			},
			{
				id: "curated",
				label: "tabCurated"
			}
		];
		function BuiltinPage({ t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dshCompanyContent",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dshCompanySection",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dshCompanySectionHead",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("generalTitle") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("identityDesc") })] })
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanyGroup",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dshCompanyRow",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "dshCompanyRowText",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dshCompanyRowTitle",
									children: t("identityTitle")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dshCompanyRowDesc",
									children: t("identityDesc")
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dshCompanyRowValue",
								children: EXAMPLE_COMPANY_IDENTITY.displayName
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dshCompanyRow",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "dshCompanyRowText",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dshCompanyRowTitle",
									children: t("ssoTitle")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dshCompanyRowDesc",
									children: t("ssoDesc")
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dshCompanyRowValue",
								children: t("ssoIdle")
							})]
						})]
					})]
				})
			});
		}
		/** Settings.section hub owned by this company plugin — market-matched chrome. */
		function CompanyExampleSection({ t }) {
			const [page, setPage] = (0, react.useState)("builtin");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dshCompanyRoot",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dshCompanyHeader",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dshCompanyHeaderTitle",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("nav") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("intro") })]
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanyViewBar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dshCompanyViewSwitch",
							role: "group",
							"aria-label": t("pagesNav"),
							children: PAGES.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dshCompanyPill",
								"data-active": page === entry.id ? "true" : void 0,
								"aria-pressed": page === entry.id,
								onClick: () => {
									setPage(entry.id);
								},
								children: t(entry.label)
							}, entry.id))
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dshCompanyVersionChip",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: PACKAGE_NAME }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: `v${PACKAGE_VERSION}` })]
						})]
					}),
					page === "builtin" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BuiltinPage, { t }) : null,
					page === "enterprise" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CompanyEnterprisePage, { t }) : null,
					page === "curated" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CompanyCuratedPage, { t }) : null
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		const zh = {
			nav: "Example Company",
			pagesNav: "Example Company 页面",
			tabBuiltin: "内置",
			tabEnterprise: "企业内部",
			tabCurated: "精选推荐",
			intro: "跟随公司插件：内置身份、企业内部套件、精选推荐。不会开机自动装。精选优先选用公司目录源，没有时回退到公开 1024Store。",
			generalTitle: "常规",
			identityTitle: "组织显示名",
			identityDesc: "示例公司子插件的展示名称。真实部署可在此接入 SSO，密钥不要写进包里。",
			ssoTitle: "SSO 扩展点",
			ssoDesc: "当前为空闲示例：未绑定组织 ID，也未嵌入任何密钥。",
			ssoIdle: "空闲（未连接）",
			enterpriseTitle: "企业内部",
			companyPackTitle: "可选公司套件",
			companyPackBody: "公司套件随应用打包但不默认启用，也不会开机自动装。确认后会启用套件与公司子插件，并可级联安装推荐社区插件。继续安装请到同页「精选推荐」。不要把密钥写进包里。",
			pluginCompanyPack: "可选公司套件：示例公司子插件与推荐社区插件。仅在确认后安装。",
			installCompanyPack: "安装公司套件…",
			confirmCompanyPackTitle: "确认安装公司套件",
			confirmCompanyPackBody: "将启用公司套件与公司子插件，并安装下列推荐社区插件。不会开机自动装。",
			confirmCompanyPack: "确认安装",
			cancelCompanyPack: "取消",
			companyPackRecommendationsHint: "套件已启用。工作区 / 办公 IM / 窄屏推荐在同页「精选推荐」。",
			curatedTitle: "精选推荐",
			pluginsTitle: "推荐工作区插件",
			pluginsBody: "这些社区插件不会随应用预装。可以一键安装推荐工作区包，或单独安装某一项。安装走插件市场校验，完成后重启才会进入 Loader。",
			pluginWorkspaceShell: "侧边栏工作台：文件、终端、Git 和子代理。",
			pluginWorkspaceContext: "上下文洞察：分类组成、压缩事件和 /context 命令。",
			officeImTitle: "推荐办公 IM",
			officeImBody: "起点是钉钉官方 Stream 和企业微信官方智能机器人。这是推荐，不是白名单。飞书、聚合通道和其他社区插件仍可从插件市场或 dsh plugin add 安装。推荐项不会预装；凭证写在插件配置或本机凭据服务，不要提交密钥。",
			pluginOfficeDingtalk: "钉钉官方 Stream：企业内部应用机器人，Client ID + Secret，本机出网即可，无需公网回调。",
			pluginOfficeWecom: "企业微信官方智能机器人：Bot ID + Secret，走官方 WebSocket 长连接，无需公网回调。",
			laterTitle: "后续可选推荐",
			laterBody: "窄屏可以用社区插件 dsh-web-mobile。这不是默认工作台路径，不会预装，也不会替换官方会话面。",
			pluginWorkspaceMobile: "窄屏适配：把侧栏收成抽屉。只在你需要手机或窄窗口时再装。",
			pluginPackage: "npm 包",
			openRepository: "打开源码仓库",
			installWorkspace: "一键安装推荐工作区插件",
			installOfficeIm: "一键安装推荐办公 IM",
			installLater: "安装窄屏适配",
			installPlugin: "安装",
			sourceFeatured: "来源：精选推荐",
			sourceEnterprise: "来源：企业内部",
			installing: "正在安装…",
			installed: "已安装",
			installBusy: "正在通过插件市场安装推荐包…",
			installRestart: "已写入当前 profile。重启 AI Buddy 后下次启动会加载。",
			installRestartNow: "立即重启",
			installPartial: "部分插件已安装。重启后加载成功的项；找不到的请到插件市场搜索，或用 dsh plugin add。",
			installMissing: "目录里找不到这个包。请到插件市场搜索，或用 dsh plugin add。",
			installError: "无法安装推荐插件。",
			catalogTitle: "插件目录",
			catalogBody: "优先选用公司内部目录源（company-1024store）；若 Host 尚未注册该源，则回退到公开 DSH 1024Store。不会开机自动选用。",
			addCatalog: "添加并选用公司目录（或 1024Store）",
			catalogReady: "已选用目录源。可在上面一键安装推荐包，或打开“插件市场”标签搜索其他包名。",
			catalogBusy: "正在添加目录来源…",
			catalogError: "无法添加目录来源。请到“插件市场 > 来源”手动添加。",
			catalogUsingFallback: "公司目录源尚未注册，已回退到公开 1024Store。"
		};
		const en = {
			nav: "Example Company",
			pagesNav: "Example Company pages",
			tabBuiltin: "Built-in",
			tabEnterprise: "Enterprise",
			tabCurated: "Featured",
			intro: "Travels with the company plugin: Built-in identity, Enterprise pack, and Featured recommendations. Nothing installs at launch. Featured prefers the company catalog source and falls back to public 1024Store.",
			generalTitle: "General",
			identityTitle: "Organization display name",
			identityDesc: "Display name for the example company child. Real deployments wire SSO here; do not put secrets in the package.",
			ssoTitle: "SSO extension point",
			ssoDesc: "Idle example: no organization id and no embedded secrets.",
			ssoIdle: "Idle (not connected)",
			enterpriseTitle: "Enterprise",
			companyPackTitle: "Optional Company Pack",
			companyPackBody: "The Company Pack ships in the app graph but is not enabled by default and never silent-preinstalls at launch. Confirming enables the pack and company children, and may cascade recommended community plugins. Continue installs under Featured on the same page. Do not put secrets in the package.",
			pluginCompanyPack: "Optional Company Pack: example company child plus recommended community plugins. Install only after confirm.",
			installCompanyPack: "Install Company Pack…",
			confirmCompanyPackTitle: "Confirm Company Pack install",
			confirmCompanyPackBody: "This enables the Company Pack and company children, then installs the community recommendations below. Nothing installs at launch.",
			confirmCompanyPack: "Confirm install",
			cancelCompanyPack: "Cancel",
			companyPackRecommendationsHint: "Pack enabled. Workspace / office IM / narrow-screen recommendations are under Featured on this page.",
			curatedTitle: "Featured",
			pluginsTitle: "Recommended workspace plugins",
			pluginsBody: "These community plugins are not preinstalled. Install the recommended workspace pack in one click, or install one plugin at a time. Installs go through Plugin market verification and need a restart before Loader picks them up.",
			pluginWorkspaceShell: "Sidebar workbench for files, terminal, Git, and subagents.",
			pluginWorkspaceContext: "Context insight: category mix, compaction events, and the /context command.",
			officeImTitle: "Recommended office IM",
			officeImBody: "The starting point is official DingTalk Stream and the official WeCom AI Bot. That is a recommendation, not an allowlist. Feishu, aggregators, and other community channels still install from the Plugin market or dsh plugin add. Recommendations are not preinstalled. Put credentials in the plugin config or the local credential store; do not commit secrets.",
			pluginOfficeDingtalk: "Official DingTalk Stream: internal-app robot, Client ID + Secret, outbound network only — no public callback.",
			pluginOfficeWecom: "Official WeCom AI Bot: Bot ID + Secret over the official WebSocket long connection — no public callback.",
			laterTitle: "Later optional recommendation",
			laterBody: "Narrow screens can use the community plugin dsh-web-mobile. It is not the default workbench path, is not preinstalled, and does not replace the official conversation surface.",
			pluginWorkspaceMobile: "Narrow-screen adapter that turns the sidebar into a drawer. Install only if you need a phone or compact window.",
			pluginPackage: "npm package",
			openRepository: "Open source repository",
			installWorkspace: "Install recommended workspace plugins",
			installOfficeIm: "Install recommended office IM",
			installLater: "Install the narrow-screen adapter",
			installPlugin: "Install",
			sourceFeatured: "Source: Featured",
			sourceEnterprise: "Source: Enterprise",
			installing: "Installing…",
			installed: "Installed",
			installBusy: "Installing recommended packages through Plugin market…",
			installRestart: "Wrote the current profile. Restart AI Buddy so they load on the next startup.",
			installRestartNow: "Restart now",
			installPartial: "Some plugins installed. Restart to load the ones that succeeded. Search Plugin market or use dsh plugin add for anything the catalog missed.",
			installMissing: "This package is not in the catalog. Search Plugin market or use dsh plugin add.",
			installError: "Could not install the recommended plugins.",
			catalogTitle: "Plugin catalog",
			catalogBody: "Prefer the company catalog source (company-1024store). If the Host has not registered that built-in yet, fall back to public DSH 1024Store. Nothing is selected at launch.",
			addCatalog: "Add and select company catalog (or 1024Store)",
			catalogReady: "A catalog source is selected. Use one-click install above, or open the Plugin market tab to search other package names.",
			catalogBusy: "Adding the catalog source…",
			catalogError: "Could not add the catalog source. Add it manually under Plugin market > Sources.",
			catalogUsingFallback: "Company catalog is not registered yet; fell back to public 1024Store."
		};
		//#endregion
		//#region src/client/styles.ts
		const STYLE_ID = "dsh-plugin-company-example/client";
		/** Market-matched chrome for the Example Company Settings hub. */
		const css = `
.dshCompanyRoot {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  min-height: 460px;
  color: var(--dsw-alias-label-primary);
}

.dshCompanyHeader,
.dshCompanyViewBar,
.dshCompanySectionHead,
.dshCompanyToolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dshCompanyHeader,
.dshCompanySectionHead {
  align-items: flex-start;
}

.dshCompanyHeaderTitle,
.dshCompanySectionHead > div {
  min-width: 0;
  flex: 1;
}

.dshCompanyHeaderTitle h2,
.dshCompanySectionHead h2 {
  margin: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}

.dshCompanyHeaderTitle p,
.dshCompanySectionHead p {
  margin: 3px 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}

.dshCompanyViewBar {
  justify-content: space-between;
  flex-wrap: wrap;
}

.dshCompanyViewSwitch {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.dshCompanyPill {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 28px;
  padding: 4px 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}

.dshCompanyPill[data-active="true"],
.dshCompanyPill[aria-pressed="true"] {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}

.dshCompanyPill:hover {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2));
}

.dshCompanyPill:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary, var(--dsw-alias-border-l4));
  outline-offset: 2px;
}

.dshCompanyPillStatic {
  cursor: default;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.dshCompanyVersionChip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 4px 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}

.dshCompanyVersionChip strong {
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}

.dshCompanyContent {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dshCompanySection {
  min-width: 0;
}

.dshCompanySectionHead {
  margin-bottom: 12px;
}

.dshCompanyToolbar {
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.dshCompanyBanner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
}

.dshCompanyBanner[data-tone="error"] {
  color: var(--dsw-alias-label-danger, #c43c3c);
}

.dshCompanyBanner[data-tone="ok"] {
  color: var(--dsw-alias-label-secondary);
}

.dshCompanyGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

@media (max-width: 680px) {
  .dshCompanyGrid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.dshCompanyCard {
  appearance: none;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 150px;
  padding: 15px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-3);
  color: inherit;
  font: inherit;
  text-align: left;
}

.dshCompanyCardInteractive {
  cursor: pointer;
}

.dshCompanyCardInteractive:hover:not(:disabled) {
  border-color: var(--dsw-alias-border-l3);
  background: var(--dsw-alias-interactive-bg-hover);
  box-shadow: var(--dsw-shadow-lv1);
}

.dshCompanyCard:disabled {
  cursor: not-allowed;
  opacity: 0.62;
  box-shadow: none;
}

.dshCompanyCardTop {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.dshCompanyGlyph {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--dsw-alias-state-business-tertiary, var(--dsw-alias-bg-layer-2));
  color: var(--dsw-alias-state-business-primary, var(--dsw-alias-label-primary));
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

.dshCompanyCardName {
  min-width: 0;
  flex: 1;
}

.dshCompanyCardName strong,
.dshCompanyCardName span {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dshCompanyCardName strong {
  font-size: 14px;
  line-height: 20px;
}

.dshCompanyCardName span {
  margin-top: 2px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 17px;
}

.dshCompanySummary {
  display: -webkit-box;
  margin: 12px 0;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 19px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.dshCompanyTags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: auto;
  overflow: hidden;
}

.dshCompanyTag {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 1px 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.dshCompanyTagAction {
  appearance: none;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}

.dshCompanyTagAction:hover:not(:disabled) {
  border-color: var(--dsw-alias-border-l3);
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2));
}

.dshCompanyTagAction:disabled {
  opacity: 0.55;
  cursor: default;
}

.dshCompanyButton {
  appearance: none;
  min-height: 32px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--dsw-alias-bg-brand, var(--dsw-alias-label-primary));
  color: var(--dsw-alias-label-on-brand, #fff);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}

.dshCompanyButton:disabled {
  opacity: 0.55;
  cursor: default;
}

.dshCompanyButtonSecondary {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-primary);
}

.dshCompanyFacts {
  margin: 0;
  padding: 0 0 0 18px;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 22px;
}

.dshCompanyFacts code {
  font-family: var(--ds-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 12px;
}

.dshCompanyGroup {
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 4px 16px;
}

.dshCompanyRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dshCompanyRow:last-child {
  border-bottom: none;
}

.dshCompanyRowText {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.dshCompanyRowTitle {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 20px;
}

.dshCompanyRowDesc {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.dshCompanyRowValue {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  white-space: nowrap;
}
`;
		/** Install company settings stylesheet. */
		function installCompanyStyles() {
			const existing = document.getElementById(STYLE_ID);
			if (existing !== null) return () => {
				existing.remove();
			};
			const style = document.createElement("style");
			style.id = STYLE_ID;
			style.textContent = css;
			document.head.appendChild(style);
			return () => {
				style.remove();
			};
		}
		//#endregion
		//#region src/client/index.ts
		const LOCALE_NS = "company-example";
		const COMPANY_EXAMPLE_SETTINGS_SECTION_ID = "company-example";
		/** Services required by the company Settings hub. */
		const inject = ["slots", "locale"];
		/** Register the Example Company settings hub on the client. */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(LOCALE_NS, {
				zh,
				en
			}), "dsh-plugin-company-example: locales");
			ctx.effect(() => installCompanyStyles(), "dsh-plugin-company-example: styles");
			const t = ctx.locale.bind(LOCALE_NS);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: COMPANY_EXAMPLE_SETTINGS_SECTION_ID,
				order: 90,
				label: () => t("nav"),
				locale: LOCALE_NS
			}, CompanyExampleSection));
		}
		//#endregion
		exports.COMPANY_EXAMPLE_SETTINGS_SECTION_ID = COMPANY_EXAMPLE_SETTINGS_SECTION_ID;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map