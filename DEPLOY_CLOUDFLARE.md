# Deploy to Cloudflare Pages/Workers

This project is configured with `@opennextjs/cloudflare` and `wrangler`.

## 1) Prepare project

```bash
cd /Users/davirian/dev/daojia/web
npm install
npm run cf:build
```

Build output:
- Worker entry: `.open-next/worker.js`
- Static assets: `.open-next/assets`
- Config file: `web/wrangler.jsonc`

## 2) Authenticate Cloudflare

```bash
npx wrangler login
```

## 3) Deploy

```bash
npm run cf:deploy
```

Or use the migration-generated script:

```bash
npm run deploy
```

## 4) Preview locally

```bash
npm run cf:preview
```

## 5) Notes

- Deployment target name is from `web/wrangler.toml` (`qitiyuanliu-site`).
- Deployment target name is from `web/wrangler.jsonc` (currently `web`).
- If content changes, refresh `web/content/chapters.json`, rebuild, and redeploy.
