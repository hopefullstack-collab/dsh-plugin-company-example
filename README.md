# dsh-plugin-company-example

Standalone **Example Company** plugin for **standard DSH Desktop** (and any DSH profile with Plugin market).

## What it is

- **Host face**: idle SSO / org identity extension point (no secrets)
- **Client face**: Settings section **Example Company** with three inner pages:
  - **Built-in** — identity + SSO status
  - **Enterprise** — optional Company Pack install through Plugin market
  - **Featured** — curated community installs through Plugin market

This plugin is **not** bundled with DSH Desktop. Install it explicitly when your organization wants the Example Company hub.

## Requirements

- DSH Desktop (or another desktop profile) with **`dsh-community-market`** composed so `/api/community-market/*` routes exist
- User-initiated installs only — nothing selects catalogs or installs plugins at boot

## Catalog sources

Featured prefers built-in key `company-1024store` (future company-internal store).  
If Market has not registered that key yet, selection falls back to public `dsh-1024store`.  
The user must click **Add and select**; nothing is selected silently at boot.

Building the company 1024Store service itself is **out of scope** for this repo.

## Install on DSH Desktop

```sh
# Active desktop profile (often named desktop)
dsh plugin --profile desktop add dsh-plugin-company-example

# Or pin a git ref
dsh plugin --profile desktop add hopefullstack-collab/dsh-plugin-company-example
```

After install, restart DSH Desktop. **Settings → Example Company** appears when the plugin’s Host row is active in the profile.

Cordis patch shipped with the plugin:

```yaml
- insert:
    - id: company-example
      name: dsh-plugin-company-example
```

## Enterprise vs AI Buddy / custom desktops

- **Enterprise** installs `dsh-plugin-company-pack` only through the standard Plugin market APIs.
- There is **no** dependency on product-specific routes such as `/api/desktop/company-pack`.
- Custom desktop forks should not pin this plugin in `cordis.patch.yml`; users or org profiles add it explicitly.

## Develop

```bash
corepack enable
corepack yarn install
corepack yarn check
```

Requires Node `^22.19.0 || >=24` and Yarn `4.18.0`.

## License

MIT
