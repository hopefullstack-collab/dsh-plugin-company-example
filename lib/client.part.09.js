			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dshCompanyExampleSection",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dshCompanyExampleIntro",
						children: t("intro")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dshCompanyExampleVersionBadge",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dshCompanyExampleVersionBadgeName",
							children: PACKAGE_NAME
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dshCompanyExampleVersionBadgeTag",
							children: `v${PACKAGE_VERSION}`
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("nav", {
						className: "dshCompanyExampleSubnav",
						"aria-label": t("pagesNav"),
						children: PAGES.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							"data-active": page === entry.id ? "true" : void 0,
							onClick: () => {
								setPage(entry.id);
							},
							children: t(entry.label)
						}, entry.id))
					}),
					page === "builtin" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BuiltinPage, { t }) : null,
					page === "enterprise" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CompanyEnterprisePage, { t }) : null,
					page === "curated" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CompanyCuratedPage, { t }) : null
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		const zh = {
			nav: "Example Company",
			pagesNav: "Example Company 页面",
			tabBuiltin: "内置",
			tabEnterprise: "企业内部",
			tabCurated: "精选推荐",
			intro: "跟随公司插件：内置身份、企业内部套件、精选推荐。不会开机自动装。精选优先选用公司目录源，没有时回退到公开 1024Store。",
			generalTitle: "常规",
			identityTitle: "组织显示名",
			identityDesc: "示例公司子插件的展示名称。真实部署可在此接入 SSO，密钥不要写进包里。",
			ssoTitle: "SSO 扩展点",
			ssoDesc: "当前为空闲示例：未绑定组织 ID，也未嵌入任何密钥。",
			ssoIdle: "空闲（未连接）",
			enterpriseTitle: "企业内部",
			companyPackTitle: "可选公司套件",
			companyPackBody: "公司套件随应用打包但不默认启用，也不会开机自动装。确认后会启用套件与公司子插件，并可级联安装推荐社区插件。继续安装请到同页「精选推荐」。不要把密钥写进包里。",
			pluginCompanyPack: "可选公司套件：示例公司子插件与推荐社区插件。仅在确认后安装。",
			installCompanyPack: "安装公司套件…",
			confirmCompanyPackTitle: "确认安装公司套件",
			confirmCompanyPackBody: "将启用公司套件与公司子插件，并安装下列推荐社区插件。不会开机自动装。",
			confirmCompanyPack: "确认安装",
			cancelCompanyPack: "取消",
			companyPackRecommendationsHint: "套件已启用。工作区 / 办公 IM / 窄屏推荐在同页「精选推荐」。",
			curatedTitle: "精选推荐",
			pluginsTitle: "推荐工作区插件",
			pluginsBody: "这些社区插件不会随应用预装。可以一键安装推荐工作区包，或单独安装某一项。安装走插件市场校验，完成后重启才会进入 Loader。",
			pluginWorkspaceShell: "侧边栏工作台：文件、终端、Git 和子代理。",
			pluginWorkspaceContext: "上下文洞察：分类组成、压缩事件和 /context 命令。",
			officeImTitle: "推荐办公 IM",
			officeImBody: "起点是钉钉官方 Stream 和企业微信官方智能机器人。这是推荐，不是白名单。飞书、聚合通道和其他社区插件仍可从插件市场或 dsh plugin add 安装。推荐项不会预装；凭证写在插件配置或本机凭据服务，不要提交密钥。",
			pluginOfficeDingtalk: "钉钉官方 Stream：企业内部应用机器人，Client ID + Secret，本机出网即可，无需公网回调。",
			pluginOfficeWecom: "企业微信官方智能机器人：Bot ID + Secret，走官方 WebSocket 长连接，无需公网回调。",
			laterTitle: "后续可选推荐",
			laterBody: "窄屏可以用社区插件 dsh-web-mobile。这不是默认工作台路径，不会预装，也不会替换官方会话面。",
			pluginWorkspaceMobile: "窄屏适配：把侧栏收成抽屉。只在你需要手机或窄窗口时再装。",
			pluginPackage: "npm 包",
			openRepository: "打开源码仓库",
			installWorkspace: "一键安装推荐工作区插件",
			installOfficeIm: "一键安装推荐办公 IM",
			installLater: "安装窄屏适配",
			installPlugin: "安装",
			installing: "正在安装…",
			installed: "已安装",
			installBusy: "正在通过插件市场安装推荐包…",
			installRestart: "已写入当前 profile。重启 AI Buddy 后下次启动会加载。",
			installRestartNow: "立即重启",
