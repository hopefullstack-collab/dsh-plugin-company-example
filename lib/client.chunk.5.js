			catalogError: "Could not add the catalog source. Add it manually under Plugin market > Sources.",
			catalogUsingFallback: "Company catalog is not registered yet; fell back to public 1024Store."
		};
		//#endregion
		//#region src/client/styles.ts
		const STYLE_ID = "dsh-plugin-company-example/client";
		const css = `
.dshCompanyExampleSection{flex-direction:column;gap:14px;width:100%;max-width:760px;display:flex}
.dshCompanyExampleIntro{color:var(--dsw-alias-label-tertiary);margin:0;padding:0 2px;font-size:13px;line-height:20px}
.dshCompanyExampleVersionBadge{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);border-radius:999px;align-self:flex-start;align-items:center;gap:8px;padding:4px 12px 4px 14px;font-size:12px;line-height:18px;display:inline-flex}
.dshCompanyExampleVersionBadgeName{color:var(--dsw-alias-label-primary);font-weight:600}
.dshCompanyExampleVersionBadgeTag{background:var(--dsw-alias-accent-soft,var(--dsw-alias-border-l2));color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;border-radius:999px;padding:1px 8px}
.dshCompanyExampleGroup{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:16px;flex-direction:column;flex:none;gap:8px;padding:18px 20px 20px;display:flex}
.dshCompanyExampleGroupHeading{color:var(--dsw-alias-label-primary);align-items:baseline;gap:7px;padding:0 2px 6px;font-size:13px;font-weight:600;line-height:20px;display:flex}
.dshCompanyExampleRow{border-bottom:1px solid var(--dsw-alias-border-l2);justify-content:space-between;align-items:center;gap:16px;padding:12px 2px;display:flex}
.dshCompanyExampleRow:last-child{border-bottom:none}
.dshCompanyExampleRowText{flex-direction:column;gap:4px;min-width:0;display:flex}
.dshCompanyExampleTitle{color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px}
.dshCompanyExampleDesc{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dshCompanyExampleValue{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;white-space:nowrap}
.dshCompanyExampleSubnav{display:flex;flex-wrap:wrap;gap:8px;padding:0 2px}
.dshCompanyExampleSubnav button{appearance:none;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);border-radius:999px;padding:6px 12px;font:inherit;font-size:12px;line-height:18px;cursor:pointer}
.dshCompanyExampleSubnav button[data-active="true"]{border-color:var(--dsw-alias-border-l4);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);font-weight:600}
.dshCompanyExampleSubnav button:focus-visible{outline:2px solid var(--dsw-alias-border-l4);outline-offset:1px}
.dshCompanyExamplePage{flex-direction:column;gap:12px;display:flex}
.dshCompanyRoot{display:flex;flex-direction:column;gap:16px;min-width:0;color:var(--dsw-alias-label-primary)}
.dshCompanySection{display:flex;flex-direction:column;gap:8px;min-width:0}
.dshCompanySection h2{margin:0;font-size:16px;line-height:24px;font-weight:600}
.dshCompanySection p{margin:0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}
.dshCompanyCard{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-container)}
.dshCompanyCard h3{margin:0;font-size:14px;line-height:22px;font-weight:600}
.dshCompanyMeta{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center}
.dshCompanyCode{font-family:var(--ds-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:12px;line-height:18px}
.dshCompanyButton{appearance:none;min-height:32px;padding:6px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-brand,var(--dsw-alias-label-primary));color:var(--dsw-alias-label-on-brand,#fff);font:inherit;cursor:pointer}
.dshCompanyButton:disabled{opacity:0.55;cursor:default}
.dshCompanyButtonSecondary{background:var(--dsw-alias-bg-container);color:var(--dsw-alias-label-primary)}
.dshCompanyActions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.dshCompanyStatus[data-tone="error"]{color:var(--dsw-alias-label-danger,#c43c3c)}
.dshCompanyStatus[data-tone="ok"]{color:var(--dsw-alias-label-secondary)}
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