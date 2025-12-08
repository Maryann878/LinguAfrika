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

4. **Framework preset**: `None` or `Vite`
   - Either works, but we're overriding the build command anyway

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

