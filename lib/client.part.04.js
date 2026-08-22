							onClick: () => onInstall(plugin.packageName),
							children: installed ? t("installed") : t("installPlugin")
						})
					})
				]
			});
		}
		//#endregion
		//#region src/client/CompanyCuratedPage.tsx
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
				className: "dshCompanyRoot dshCompanyExamplePage",
				"aria-label": t("curatedTitle"),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanySection",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("pluginsTitle") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("pluginsBody") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyActions",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dshCompanyButton",
