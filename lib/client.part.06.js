								children: t("installRestartNow")
							})
						})]
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanySection",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("catalogTitle") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("catalogBody") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyActions",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dshCompanyButton",
									disabled: catalog.status === "busy" || catalog.status === "ready" && catalog.selected,
									onClick: addCatalog,
									children: t("addCatalog")
								})
							}),
							catalog.status === "busy" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dshCompanyStatus",
								children: t("catalogBusy")
							}) : null,
							catalog.status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dshCompanyStatus",
								"data-tone": "error",
								children: t("catalogError")
							}) : null,
							catalog.status === "ready" && catalog.selected ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dshCompanyStatus",
								"data-tone": "ok",
								children: t("catalogReady")
							}), catalog.usedFallback ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dshCompanyStatus",
								children: t("catalogUsingFallback")
							}) : null] }) : null
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
				className: "dshCompanyRoot dshCompanyExamplePage",
