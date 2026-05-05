# Deploy to Vercel

## 1) Prepare project

```bash
cd /Users/davirian/dev/daojia/web
npm install
npm run build
```

## 2) Deploy with Vercel CLI

```bash
npx vercel
```

First deploy follow prompts:
- Set scope/team
- Link or create project
- Confirm root directory as `web`

Production deploy:

```bash
npx vercel --prod
```

## 3) Notes

- This site is static-first and already passes `npm run build`.
- Content source is `web/content/chapters.json`.
- If content changes, recopy from `data/processed/chapters.json` then redeploy.
