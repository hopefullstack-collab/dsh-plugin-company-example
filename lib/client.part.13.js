18px;
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