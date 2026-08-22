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