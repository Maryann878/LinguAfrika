# Deployment Guide: Railway (Backend) + Cloudflare Pages (Frontend)

This guide will help you deploy LinguAfrika to production with both demo account and normal user signup functionality.

## Prerequisites

1. **MongoDB Atlas Account** (free tier works)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string

2. **Railway Account**
   - Sign up at https://railway.app
   - Connect your GitHub account

3. **Cloudflare Account**
   - Sign up at https://dash.cloudflare.com
   - Connect your GitHub account

4. **GitHub Repository**
   - Push your code to GitHub if not already done

---

## Part 1: Backend Deployment on Railway

### Step 1: Prepare MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. Create a new cluster (or use existing)
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/linguafrika?retryWrites=true&w=majority`)
5. Replace `<password>` with your actual database password
6. Keep this connection string handy for Railway

### Step 2: Deploy to Railway

1. **Create New Project**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Service**
   - Railway will auto-detect your backend
   - If not, click "New" → "GitHub Repo" → Select your repo
   - **CRITICAL**: Set **Root Directory** to `backend` (this is required for monorepo setup!)
     - Go to your service → Settings → General
     - Find "Root Directory" field
     - Enter: `backend`
     - This tells Railway to treat the `backend` folder as the project root

3. **Set Environment Variables**
   - Click on your service → "Variables" tab
   - Add the following variables:

   ```bash
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://your-app.pages.dev,https://your-custom-domain.com
   JWT_SECRET=generate_a_secure_random_string_here
   ENSURE_DEMO_ACCOUNT=true
   RESEND_API_KEY=your_resend_api_key_if_using_email
   ```

   **Important Notes:**
   - Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB connection string
   - For `CORS_ORIGIN`, add your Cloudflare Pages URL (you'll get this after deploying frontend)
   - For `JWT_SECRET`, generate a secure random string (you can use: `openssl rand -base64 32`)
   - `ENSURE_DEMO_ACCOUNT=true` ensures demo account is created automatically

4. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Note your Railway URL (e.g., `https://your-app.up.railway.app`)

5. **Verify Demo Account**
   - After first deployment, check Railway logs
   - You should see: "✅ Demo account and data created successfully!"
   - If demo account already exists, you'll see: "✅ Demo account already exists"

### Step 3: Get Railway Backend URL

1. Click on your service in Railway
2. Go to "Settings" → "Domains"
3. Railway provides a default domain (e.g., `your-app.up.railway.app`)
4. Copy this URL - you'll need it for frontend configuration

---

## Part 2: Frontend Deployment on Cloudflare Pages

### Step 1: Prepare Frontend

1. **Update API Configuration** (Already done in code)
   - The frontend is configured to use `VITE_API_URL` environment variable
   - For local dev, it uses `/api` proxy
   - For production, it will use the Railway backend URL

### Step 2: Deploy to Cloudflare Pages

1. **Create New Project**
   - Go to Cloudflare Dashboard → "Workers & Pages"
   - Click "Create application" → "Pages" → "Connect to Git"
   - Select your GitHub repository

2. **Configure Build Settings**
   - **Framework preset**: `Vite` (or `None` if Vite isn't available)
   - **Root directory**: `frontend` (IMPORTANT: Set this to `frontend`)
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `dist`
   - **Deploy command**: Leave EMPTY or remove if present (Cloudflare Pages handles deployment automatically)
   
   **Important Notes:**
   - Setting "Root directory" to `frontend` tells Cloudflare to run all commands from the `frontend` folder
   - This means `npm install` and `npm run build` will run inside the `frontend` directory
   - The build output will be in `frontend/dist`, but since root is `frontend`, Cloudflare looks for `dist` relative to that
   - **DO NOT set a deploy command** - Cloudflare Pages automatically deploys static sites after build
   - If you see a "Deploy command" field, leave it empty or delete any value in it
   - A `wrangler.json` file in the repo root helps Cloudflare identify the build output location (already included in the repo)

3. **Set Environment Variables**
   - Go to "Settings" → "Environment variables"
   - Add:
     ```
     VITE_API_URL=https://your-railway-app.up.railway.app/api
     ```
   - Replace `your-railway-app.up.railway.app` with your actual Railway URL

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete
   - Your site will be available at `https://your-project.pages.dev`

### Step 3: Update CORS in Railway

1. Go back to Railway
2. Update `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://your-project.pages.dev,https://your-custom-domain.com
   ```
3. Redeploy the backend service

---

## Part 3: Custom Domain (Optional)

### Cloudflare Pages Custom Domain

1. In Cloudflare Pages, go to "Custom domains"
2. Add your domain
3. Follow DNS setup instructions
4. Update Railway `CORS_ORIGIN` to include your custom domain

### Railway Custom Domain

1. In Railway, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS setup instructions

---

## Part 4: Testing

### Test Demo Account

1. Go to your deployed frontend URL
2. Click "Login"
3. Use credentials:
   - **Email**: `demo@linguafrika.com`
   - **Password**: `Demo123!`
4. Verify you can access dashboard, courses, community, etc.

### Test Normal Signup

1. Go to your deployed frontend URL
2. Click "Sign Up"
3. Create a new account with different email
4. Verify you can:
   - Complete signup
   - Login with new account
   - Access all features
   - Both demo and new account work independently

---

## Part 5: Maintenance

### Resetting Demo Data

If you need to reset demo data:

1. Go to Railway → Your service → "Deployments"
2. Click on latest deployment → "View Logs"
3. Or use Railway CLI:
   ```bash
   railway run npm run seed:demo:clear
   railway run npm run seed:demo
   ```

### Updating Demo Account

The demo account is automatically ensured on every deployment. If you need to manually recreate it:

1. Use Railway console/terminal
2. Run: `npm run seed:demo:clear`
3. Then: `npm run seed:demo`

### Monitoring

- **Railway**: Check logs in Railway dashboard
- **Cloudflare**: Check build logs in Cloudflare Pages dashboard
- **MongoDB Atlas**: Monitor database usage and performance

---

## Troubleshooting

### Demo Account Not Created

1. Check Railway logs for errors
2. Verify `ENSURE_DEMO_ACCOUNT` is set to `true`
3. Check MongoDB connection is working
4. Manually run: `railway run npm run ensure:demo`

### CORS Errors

1. Verify `CORS_ORIGIN` in Railway includes your Cloudflare Pages URL
2. Check that URLs match exactly (including https://)
3. Redeploy backend after updating CORS_ORIGIN

### API Connection Issues

1. Verify `VITE_API_URL` in Cloudflare Pages is correct
2. Check Railway backend is running (visit Railway URL/health)
3. Verify Railway URL is accessible (not blocked by firewall)

### Build Failures

1. Check Cloudflare build logs
2. Verify all dependencies are in `package.json`
3. Check Node.js version compatibility

---

## Environment Variables Summary

### Railway (Backend)
```bash
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-app.pages.dev
JWT_SECRET=your_secure_secret
ENSURE_DEMO_ACCOUNT=true
RESEND_API_KEY=your_key (optional)
```

### Cloudflare Pages (Frontend)
```bash
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

---

## Security Checklist

- [ ] Use strong `JWT_SECRET` (random 32+ character string)
- [ ] Use MongoDB Atlas with IP whitelist enabled
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS only (Railway and Cloudflare provide this)
- [ ] Keep environment variables secure (never commit to Git)
- [ ] Regularly update dependencies
- [ ] Monitor for security vulnerabilities

---

## Troubleshooting

### Railway: "No start command was found"

**Error:**
```
No start command was found
Railpack will check:
1. A "start" script in your package.json
2. A "main" field in your package.json
3. An index.js or index.ts file in your project root
```

**Solution:**
This happens when Railway detects the monorepo but doesn't know which directory to use.

1. Go to Railway Dashboard → Your Service → Settings → General
2. Find "Root Directory" field
3. Set it to: `backend`
4. Save and redeploy

**Why this happens:**
- Railway detects the workspace (monorepo) structure
- It looks for a start command in the root `package.json`
- But the start command is in `backend/package.json`
- Setting Root Directory to `backend` tells Railway to use that folder

### Cloudflare: "Could not load /opt/buildhome/repo/frontend/src/components/ui/toaster"

**Error:**
```
Could not load /opt/buildhome/repo/frontend/src/components/ui/toaster
ENOENT: no such file or directory
```

**Solution:**
1. Make sure you've committed and pushed the directory rename (`Components` → `components`)
2. In Cloudflare Pages → Settings → Builds & deployments:
   - Set **Root directory** to: `frontend`
   - Set **Build command** to: `npm install && npm run build`
   - Set **Build output directory** to: `dist`
3. Clear build cache and redeploy

### Cloudflare: "Missing entry-point to Worker script" or Wrangler Deploy Error

**Error:**
```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
Executing user deploy command: npx wrangler deploy
```

**Solution:**
This happens when Cloudflare Pages doesn't know where your build output is (common with monorepos).

1. **Ensure `wrangler.jsonc` exists in repo root** (already included):
   ```jsonc
   {
     "name": "linguafrika",
     "compatibility_date": "2025-12-08",
     "assets": {
       "directory": "./frontend/dist"
     }
   }
   ```
   This tells Cloudflare:
   - Your static assets are in `frontend/dist` (monorepo path)
   - You're deploying static assets, not a Worker script
   - Where to find the build output directory

2. Go to Cloudflare Pages → Your Project → Settings → Builds & deployments
3. Check for a **"Deploy command"** field
4. **Remove or clear any value** in the Deploy command field (leave it empty)
5. Ensure **Framework preset** is set to `Vite` (not "Workers")
6. Verify these settings:
   - **Root directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `dist`
   - **Deploy command**: (empty/blank)
7. Commit and push the `wrangler.json` file if you just created it
8. Save and redeploy

**Why this happens:**
- With monorepos, Cloudflare needs explicit configuration to find build output
- The `wrangler.json` file tells Cloudflare where your static site files are
- Cloudflare Pages automatically deploys static sites after build (no deploy command needed)

### Railway: Server Keeps Crashing

**Symptoms:**
- Railway deployment starts but then crashes
- Logs show server starting then immediately stopping
- "Application failed to respond" errors

**Common Causes & Solutions:**

1. **MongoDB Connection Issues**
   - **Check**: Railway logs for "MongoDB connection error"
   - **Fix**: 
     - Verify `MONGODB_URI` is set correctly in Railway environment variables
     - Check MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allows all IPs)
     - Verify connection string format: `mongodb+srv://username:password@cluster.mongodb.net/linguafrika?retryWrites=true&w=majority`
     - Ensure MongoDB username and password don't contain special characters that need URL encoding

2. **Missing Environment Variables**
   - **Check**: Railway logs for "undefined" or missing config errors
   - **Fix**: Ensure all required variables are set:
     - `MONGODB_URI` (required)
     - `JWT_SECRET` (required - use a strong random string)
     - `PORT` (optional - Railway sets this automatically)
     - `NODE_ENV=production`
     - `CORS_ORIGIN` (should include your Cloudflare Pages URL)

3. **Port Configuration**
   - **Check**: Railway logs for "EADDRINUSE" or port errors
   - **Fix**: Railway automatically sets `PORT` - don't hardcode it. The server now listens on `0.0.0.0` to accept connections from Railway's network.

4. **Uncaught Exceptions**
   - **Check**: Railway logs for "UNCAUGHT EXCEPTION" or "UNHANDLED REJECTION"
   - **Fix**: The server now has global error handlers, but check logs for the specific error causing the crash

5. **Root Directory Not Set**
   - **Check**: Railway logs show "No start command was found"
   - **Fix**: Set Root Directory to `backend` in Railway settings

**How to Debug:**
1. Go to Railway → Your Service → Deployments
2. Click on the failed deployment
3. Check the "Logs" tab for error messages
4. Look for the last error before the crash
5. Common error patterns:
   - `MongoDB connection error` → Check `MONGODB_URI`
   - `Cannot find module` → Check Root Directory is `backend`
   - `Port already in use` → Railway handles this automatically
   - `JWT_SECRET is required` → Set environment variable

### Backend not connecting to MongoDB

**Symptoms:**
- Backend starts but can't connect to database
- Errors in Railway logs about MongoDB connection

**Solution:**
1. Verify `MONGODB_URI` is set correctly in Railway environment variables
2. Check MongoDB Atlas IP whitelist includes Railway's IPs (or use `0.0.0.0/0` for testing)
3. Verify MongoDB username and password are correct
4. Check connection string format: `mongodb+srv://username:password@cluster.mongodb.net/linguafrika?retryWrites=true&w=majority`
5. The server now waits for DB connection before starting - check logs to see if connection succeeds

---

## Support

If you encounter issues:
1. Check Railway logs
2. Check Cloudflare build logs
3. Verify all environment variables are set correctly
4. Check the troubleshooting section above
4. Test API endpoints directly using Railway URL

Good luck with your deployment! 🚀

