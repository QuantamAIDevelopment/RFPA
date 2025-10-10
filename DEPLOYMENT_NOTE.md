Deployment notes for Azure App Service

Problem:
When building in Azure App Service with production npm installation, `devDependencies` are not installed. If `vite` is in `devDependencies`, `npm run build` in the startup script can fail with errors like:

  Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/node_modules/dist/node/cli.js' imported from /node_modules/.bin/vite

Options to fix:

1) Keep the current change (move `vite` & plugin to `dependencies`) — simple and effective.
   - Pros: Build tooling available at runtime; minimal config needed.
   - Cons: Increases size of production `node_modules`.

2) Prebuild during CI and deploy the `dist/` output only.
   - Run `npm run build` in CI and deploy the static `dist` folder to App Service (or use static hosting). This removes the need for `vite` in production entirely.

3) Ensure devDependencies are installed during Azure build step.
   - Set `NPM_CONFIG_PRODUCTION=false` in the build environment so `npm install` installs devDependencies. On Azure you can set this in App Settings or use a custom deployment script.

4) Use `npm ci --only=production` carefully in deploy scripts.
   - If you need to run build at startup, avoid `--only=production` as it omits devDependencies.

Recommended:
- For simple deployments, moving Vite to `dependencies` (what we applied) is the easiest fast fix.
- For smaller production images, prefer prebuilding in CI and deploying the `dist/` folder.

Notes:
- If you use GitHub Actions for CI, add a build step that runs `npm ci && npm run build` and uploads `dist/` as an artifact or deploys it directly.
