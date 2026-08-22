# dsh-plugin-company-example

Standalone **Example Company** DeepSeek Harness plugin.

## What it is

- Host face: idle SSO / org identity extension point (no secrets)
- Client face: Settings section **Example Company** with inner pages
  - **Built-in** — identity + SSO status
  - **Enterprise** — confirm-to-install Company Pack (via desktop `/api/desktop/company-pack`)
  - **Featured** — curated community installs through Plugin market

## Catalog sources (step 3 ready)

Featured prefers built-in key `company-1024store` (future company-internal store).  
If Market has not registered that key yet, selection falls back to public `dsh-1024store`.  
Nothing is selected at boot; the user must click **Add and select**.

Building the company 1024Store service itself is **out of scope** for this repo.

## Install

```bash
# From AI Buddy / DSH profile (after publish or git install)
dsh plugin add dsh-plugin-company-example
# or pin a git ref
dsh plugin add hopefullstack-collab/dsh-plugin-company-example
```

Desktop products that ship this plugin should insert the Host row (so the client face is discovered):

```yaml
- insert:
    - id: company-example
      name: dsh-plugin-company-example
```

## Develop

```bash
corepack enable
corepack yarn install
corepack yarn check
```

Requires Node `^22.19.0 || >=24` and Yarn `4.18.0`.

## License

MIT
