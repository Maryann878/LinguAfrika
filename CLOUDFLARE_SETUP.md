# Cloudflare Pages Build Configuration

## Critical Settings for Monorepo

When deploying to Cloudflare Pages, you need to configure these settings correctly:

### Build Settings

1. **Root directory**: `frontend`
   - This tells Cloudflare to treat the `frontend` folder as the project root
   - All commands will run from inside `frontend`

2. **Build command**: `npm install && npm run build`
   - Since root directory is `frontend`, this runs from `frontend/`
   - No need for `cd frontend` since we're already there

3. **Build output directory**: `dist`
   - Relative to the root directory (`frontend`)
   - So Cloudflare will look for `frontend/dist`

4. **Framework preset**: `Vite` (preferred) or `None`
   - `Vite` is recommended as it's the framework you're using

5. **Deploy command**: **LEAVE EMPTY** ⚠️
   - **DO NOT set a deploy command**
   - Cloudflare Pages automatically deploys static sites after build
   - If you see a deploy command set to `npx wrangler deploy`, remove it
   - Wrangler is for Workers, not static Pages sites

### Environment Variables

Add these in Cloudflare Pages → Settings → Environment variables:

```
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

Replace `your-railway-app.up.railway.app` with your actual Railway backend URL.

### Important: Commit and Push Changes First!

**Before deploying, make sure you've committed and pushed the directory rename:**

```bash
git add .
git commit -m "Rename Components to components for cross-platform compatibility"
git push
```

The directory rename (`Components` → `components`) must be in your Git repository for Cloudflare to see it.

### Troubleshooting

If you still get errors after updating settings:

1. **Clear Cloudflare build cache**
   - Go to Cloudflare Pages → Your Project → Settings
   - Scroll to "Builds & deployments"
   - Click "Clear build cache"
   - Redeploy

2. **Verify Git has the changes**
   - Check that `frontend/src/components` (lowercase) exists in your GitHub repo
   - If you see `frontend/src/Components` (uppercase), the rename wasn't committed

3. **Check build logs**
   - Look for the actual file paths in error messages
   - Ensure they show `components` (lowercase), not `Components`

4. **Wrangler Deploy Error**
   - If you see: `✘ [ERROR] Missing entry-point to Worker script`
   - This means a deploy command is set (should be empty)
   - Go to Settings → Builds & deployments
   - Remove/clear the "Deploy command" field
   - Cloudflare Pages handles static site deployment automatically

