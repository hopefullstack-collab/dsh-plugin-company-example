											className: "dshCompanyButton dshCompanyButtonSecondary",
											onClick: () => setInstall({ status: "idle" }),
											children: t("cancelCompanyPack")
										})]
									})
								]
							}) : null
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
								children: t("installRestartNow")
							})
						})]
					}) : null
				]
			});
		}
		//#endregion
		//#region src/client/CompanyExampleSection.tsx
		const PACKAGE_NAME = "dsh-plugin-company-example";
		const PACKAGE_VERSION = "0.1.0";
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
				className: "dshCompanyExamplePage",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dshCompanyExampleGroup",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dshCompanyExampleGroupHeading",
							children: t("generalTitle")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dshCompanyExampleRow",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "dshCompanyExampleRowText",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dshCompanyExampleTitle",
									children: t("identityTitle")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dshCompanyExampleDesc",
									children: t("identityDesc")
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dshCompanyExampleValue",
								children: EXAMPLE_COMPANY_IDENTITY.displayName
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dshCompanyExampleRow",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "dshCompanyExampleRowText",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dshCompanyExampleTitle",
									children: t("ssoTitle")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dshCompanyExampleDesc",
									children: t("ssoDesc")
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dshCompanyExampleValue",
								children: t("ssoIdle")
							})]
						})
					]
				})
			});
		}
		/** Settings.section hub owned by this company plugin. */
		function CompanyExampleSection({ t }) {
			const [page, setPage] = (0, react.useState)("builtin");
