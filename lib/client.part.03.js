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
		function RecommendedPluginCard({ plugin, t, installed, busy, onInstall }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: "dshCompanyCard",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: plugin.displayName }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t(ROLE_KEY[plugin.role]) }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanyMeta",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("pluginPackage") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
								className: "dshCompanyCode",
								children: plugin.packageName
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
								href: plugin.repositoryUrl,
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
							className: "dshCompanyButton dshCompanyButtonSecondary",
							disabled: busy || installed,
