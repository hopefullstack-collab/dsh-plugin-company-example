				"aria-label": t("enterpriseTitle"),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanySection",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("companyPackTitle") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("companyPackBody") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
								className: "dshCompanyCard",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: COMPANY_PACK_RECOMMENDED_ENTRY.displayName }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("pluginCompanyPack") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dshCompanyMeta",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("pluginPackage") }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
												className: "dshCompanyCode",
												children: COMPANY_PACK_RECOMMENDED_ENTRY.packageName
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
												href: COMPANY_PACK_RECOMMENDED_ENTRY.repositoryUrl,
												target: "_blank",
												rel: "noreferrer",
												children: t("openRepository")
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "dshCompanyActions",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dshCompanyButton",
											disabled: busy || companyPackEnabled,
											onClick: beginCompanyPackConfirm,
											children: companyPackEnabled ? t("installed") : t("installCompanyPack")
										})
									})
								]
							}),
							companyPackEnabled ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dshCompanyStatus",
								"data-tone": "ok",
								children: t("companyPackRecommendationsHint")
							}) : null,
							install.status === "confirm-company-pack" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dshCompanySection",
								role: "dialog",
								"aria-label": t("confirmCompanyPackTitle"),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("confirmCompanyPackTitle") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("confirmCompanyPackBody") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: install.entries.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
											className: "dshCompanyCode",
											children: entry.packageName
										}),
										" ",
										"—",
										" ",
										entry.displayName,
										" ",
										"(",
										entry.kind,
										")"
									] }, `${entry.kind}:${entry.packageName}`)) }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dshCompanyActions",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dshCompanyButton",
											onClick: confirmCompanyPack,
											children: t("confirmCompanyPack")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
