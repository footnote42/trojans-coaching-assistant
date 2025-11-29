# Vercel Deployment Guide - Trojans Coaching Assistant

## Pre-Deployment Status ✅

The application has been fully prepared for Vercel deployment with the following completed:

- ✅ Vercel serverless function configured (`api/generate-session.ts`)
- ✅ Production build tested and working (`npm run build`)
- ✅ vercel.json configuration updated
- ✅ Environment variables documented in `.env.example`
- ✅ All recent features tested (Session save/load, PDF export, History view)
- ✅ API proxy properly configured for secure Claude API access

## Architecture Overview

**Frontend:** React 18 + TypeScript + Vite → Static files served from `/dist/public`
**Backend:** Vercel Serverless Function → `/api/generate-session.ts`
**API Security:** Anthropic API key stored in Vercel environment variables (never exposed to client)

## Deployment Steps

### 1. Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Link Project to Vercel

From the project root directory:

```bash
cd trojans-coaching-assistant
vercel
```

This will:
- Prompt you to link to an existing project or create a new one
- Auto-detect configuration from `vercel.json`
- Set up the deployment

### 4. Configure Environment Variables

**CRITICAL:** Add environment variables before first deployment.

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

#### Option B: Via Vercel CLI
```bash
vercel env add ANTHROPIC_API_KEY
# When prompted:
# - Enter your Anthropic API key
# - Select: Production, Preview, Development (all three)
```

### 5. Deploy to Production

```bash
vercel --prod
```

Or simply push to your main branch if you've enabled Git integration:
```bash
git push origin main
```

### 6. Verify Deployment

After deployment, Vercel will provide a URL (e.g., `https://trojans-coaching-assistant.vercel.app`)

Test the following:
- [ ] Homepage loads correctly
- [ ] Generate a test session plan
- [ ] PDF export works
- [ ] Session history saves and loads
- [ ] WhatsApp summary copy works
- [ ] Check browser console for errors

## Environment Variables Reference

### Required Variables

```bash
# REQUIRED: Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
# Get from: https://console.anthropic.com/settings/keys
```

### Optional Variables

```bash
# Optional: Database URL (currently minimal usage)
DATABASE_URL=postgresql://username:password@host.region.neon.tech/database

# Optional: Node environment (auto-set by Vercel)
NODE_ENV=production
```

## Vercel Configuration Details

### vercel.json Structure

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

### API Routes
- `/api/generate-session` → Serverless function at `api/generate-session.ts`
- All other routes → Static frontend from `dist/public/index.html`

## Git Integration (Recommended)

### Enable Automatic Deployments

1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Connect your GitHub/GitLab/Bitbucket repository
3. Configure:
   - **Production Branch:** `main` or `master`
   - **Preview Deployments:** Enable for all branches
   - **Auto Deploy:** Enable

### Deployment Workflow
```bash
# Make changes locally
git add .
git commit -m "Feature: Add new functionality"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Runs npm install
# 3. Runs npm run build
# 4. Deploys to production
# 5. Sends deployment notification
```

## Troubleshooting

### Build Fails

**Issue:** Build fails with module not found
```bash
# Solution: Ensure all dependencies are in package.json, not just devDependencies
npm install --save <missing-package>
git commit -am "Fix: Add missing dependency"
git push
```

### API Key Not Working

**Issue:** API returns "API key not configured"
```bash
# Solution: Verify environment variable is set
vercel env ls

# If missing, add it:
vercel env add ANTHROPIC_API_KEY
# Then redeploy:
vercel --prod
```

### Serverless Function Timeout

**Issue:** API calls take too long and timeout
- Vercel serverless functions have a 10-second timeout on Hobby plan
- Upgrade to Pro plan for 60-second timeout if needed
- Consider optimizing prompts to reduce Claude response time

### 404 on API Routes

**Issue:** `/api/generate-session` returns 404
```bash
# Solution: Verify api/generate-session.ts exists
ls -la api/

# Redeploy:
vercel --prod
```

## Performance Optimization

### Current Status
- Build size: ~650KB (main bundle)
- Initial load: ~1.3MB total
- API response time: 10-30 seconds (Claude generation)

### Recommended Optimizations (Future)
- [ ] Implement code splitting for PDF export library
- [ ] Use dynamic imports for heavy components
- [ ] Add service worker for offline functionality
- [ ] Implement response caching (with user consent)

## Security Checklist

- [x] API key stored in environment variables (not in code)
- [x] API key never exposed to client/browser
- [x] CORS configured properly (backend proxy handles this)
- [x] Input validation on serverless function
- [x] Error messages don't leak sensitive info
- [x] `.env` files in `.gitignore`

## Monitoring & Analytics

### Vercel Analytics (Built-in)
Enable in Vercel Dashboard → Your Project → Analytics
- Page views
- Visitor metrics
- Performance scores

### Error Tracking
View logs:
```bash
vercel logs <deployment-url>
```

Or in dashboard:
Vercel Dashboard → Your Project → Deployments → [Select Deployment] → Functions → Logs

## Deployment Checklist

Before each production deployment:

- [ ] All tests pass locally
- [ ] `npm run build` completes successfully
- [ ] Environment variables configured in Vercel
- [ ] Git repository is up to date
- [ ] Version number updated (if applicable)
- [ ] CLAUDE.md and README.md are up to date
- [ ] No sensitive data in code (API keys, passwords, etc.)

## Rollback Procedure

If deployment causes issues:

### Quick Rollback (Vercel Dashboard)
1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the last working deployment
3. Click **"..."** → **"Promote to Production"**

### Via CLI
```bash
vercel rollback
```

## Custom Domain Setup (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `coaching.trojansrfc.com`)
3. Configure DNS as instructed by Vercel
4. Vercel automatically provisions SSL certificate

## Cost Estimates

**Vercel Hobby Plan (Free):**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless function executions: 100 hours/month
- ⚠️ 10-second serverless timeout
- ⚠️ No team features

**Vercel Pro Plan ($20/month):**
- ✅ Everything in Hobby
- ✅ 60-second serverless timeout
- ✅ Team collaboration
- ✅ Enhanced analytics
- ✅ Priority support

**Estimated Usage:**
- Typical session generation: ~15-30 seconds API call
- Recommended: Start with Hobby, upgrade to Pro if needed

## Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Vercel CLI Reference:** https://vercel.com/docs/cli
- **Serverless Functions:** https://vercel.com/docs/functions/serverless-functions
- **Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

## Next Steps After Deployment

1. Test all features on production URL
2. Set up custom domain (if desired)
3. Enable Vercel Analytics
4. Configure error monitoring
5. Share production URL with coaching team
6. Gather user feedback
7. Plan next feature iteration

---

**Last Updated:** November 2025
**Status:** ✅ Ready for Production Deployment
