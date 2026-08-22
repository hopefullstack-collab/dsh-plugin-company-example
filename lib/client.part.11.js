			laterTitle: "Later optional recommendation",
			laterBody: "Narrow screens can use the community plugin dsh-web-mobile. It is not the default workbench path, is not preinstalled, and does not replace the official conversation surface.",
			pluginWorkspaceMobile: "Narrow-screen adapter that turns the sidebar into a drawer. Install only if you need a phone or compact window.",
			pluginPackage: "npm package",
			openRepository: "Open source repository",
			installWorkspace: "Install recommended workspace plugins",
			installOfficeIm: "Install recommended office IM",
			installLater: "Install the narrow-screen adapter",
			installPlugin: "Install",
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
