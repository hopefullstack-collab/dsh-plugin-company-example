									disabled: busy || WORKSPACE_RECOMMENDED_PLUGINS.every((plugin) => isInstalled(plugin.packageName)),
									onClick: () => installKind("company-pack"),
									children: t("installWorkspace")
								})
							}),
							WORKSPACE_RECOMMENDED_PLUGINS.map((plugin) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecommendedPluginCard, {
								plugin,
								t,
								installed: isInstalled(plugin.packageName),
								busy,
								onInstall: (packageName) => runInstall([packageName])
							}, plugin.packageName))
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanySection",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("laterTitle") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("laterBody") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyActions",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dshCompanyButton dshCompanyButtonSecondary",
									disabled: busy || LATER_RECOMMENDED_PLUGINS.every((plugin) => isInstalled(plugin.packageName)),
									onClick: () => installKind("later"),
									children: t("installLater")
								})
							}),
							LATER_RECOMMENDED_PLUGINS.map((plugin) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecommendedPluginCard, {
								plugin,
								t,
								installed: isInstalled(plugin.packageName),
								busy,
								onInstall: (packageName) => runInstall([packageName])
							}, plugin.packageName))
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanySection",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("officeImTitle") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("officeImBody") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dshCompanyActions",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dshCompanyButton",
									disabled: busy || OFFICE_IM_RECOMMENDED_PLUGINS.every((plugin) => isInstalled(plugin.packageName)),
									onClick: () => installKind("office-im"),
									children: t("installOfficeIm")
								})
							}),
							OFFICE_IM_RECOMMENDED_PLUGINS.map((plugin) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecommendedPluginCard, {
								plugin,
								t,
								installed: isInstalled(plugin.packageName),
								busy,
								onInstall: (packageName) => runInstall([packageName])
							}, plugin.packageName))
						]
					}),
					install.status === "busy" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dshCompanyStatus",
						children: t("installBusy")
					}) : null,
					install.status === "done" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanySection",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dshCompanyStatus",
							"data-tone": install.tone,
							children: t(install.message)
						}), install.restartToken === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dshCompanyActions",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dshCompanyButton",
								onClick: restartNow,
