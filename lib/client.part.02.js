					throw new Error("built-in catalog source unavailable");
				}
				activeKey = key;
				if (key === "dsh-1024store") usedFallback = true;
				if (!source.enabled) sources = [...await mutateMarketSource({
					action: "select",
					sourceRecordId: source.sourceRecordId
				}, signal)];
				return {
					sources,
					usedFallback: usedFallback || key === "dsh-1024store",
					activeKey
				};
			}
			throw new Error("built-in catalog source unavailable");
		}
		async function readInstallations(signal) {
			return (await readJson(await fetch("/api/community-market/installations", {
				cache: "no-store",
				...signal === void 0 ? {} : { signal }
			}))).installations;
		}
		async function searchCatalogItems(sourceRecordId, packageName, signal) {
			const url = new URL("/api/community-market/catalog", window.location.origin);
			url.searchParams.set("sourceRecordId", sourceRecordId);
			url.searchParams.set("q", packageName);
			url.searchParams.set("limit", "50");
			url.searchParams.set("locale", "zh");
			return (await readJson(await fetch(url, {
				cache: "no-store",
				...signal === void 0 ? {} : { signal }
			}))).results.flatMap((result) => result.snapshot?.items ?? []);
		}
		async function previewAndExecuteInstall(sourceRecordId, itemId, signal) {
			const preview = await readJson(await fetch("/api/community-market/operations/preview", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					action: "install",
					sourceRecordId,
					itemId
				}),
				...signal === void 0 ? {} : { signal }
			}));
			if (preview.action !== "install") throw new Error("operation preview action mismatch");
			const executed = await readJson(await fetch("/api/community-market/operations/execute", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ previewId: preview.previewId }),
				...signal === void 0 ? {} : { signal }
			}));
			if (executed.action !== "install") throw new Error("operation response action mismatch");
			return executed.restartToken;
		}
		async function installRecommendedPlugins(packageNames, signal) {
			if (packageNames.length === 0) throw new Error("no recommended plugins requested");
			if (packageNames.some((packageName) => !isRecommendedPackage(packageName))) throw new Error("company plugin can only install its recommended plugins");
			const source = resolveCompanyCatalogSource((await selectCompanyCatalog(signal)).sources);
			if (source === void 0) throw new Error("built-in catalog source unavailable");
			const installations = [...await readInstallations(signal)];
			const results = [];
			let restartToken;
			for (const packageName of packageNames) {
				if (recommendedPackageInstalled(packageName, installations)) {
					results.push({
						packageName,
						status: "already"
					});
					continue;
				}
				try {
					const item = findCatalogItemForPackage(await searchCatalogItems(source.sourceRecordId, packageName, signal), packageName);
					if (item === void 0) {
						results.push({
							packageName,
							status: "missing"
						});
						continue;
					}
					const nextToken = await previewAndExecuteInstall(source.sourceRecordId, item.id, signal);
					if (nextToken !== void 0) restartToken = nextToken;
					installations.push({ packageName });
					results.push({
						packageName,
						status: "installed"
					});
				} catch (cause) {
					results.push({
						packageName,
