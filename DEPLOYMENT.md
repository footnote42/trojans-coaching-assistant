# Deployment Guide

## Deploying to Vercel

This application is configured for deployment to Vercel with a secure backend proxy for Claude API calls.

### Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. An Anthropic API key (get one at https://console.anthropic.com/settings/keys)
3. Vercel CLI installed (optional, for local testing)

### Deployment Steps

#### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

#### 2. Link Your Project

```bash
vercel link
```

#### 3. Set Environment Variables

You have two options:

**Option A: Via Vercel Dashboard**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your Anthropic API key (starts with `sk-ant-api03-...`)
   - **Environments:** Check Production, Preview, and Development

**Option B: Via Vercel CLI**

```bash
vercel env add ANTHROPIC_API_KEY
```

When prompted, paste your API key and select which environments to apply it to.

#### 4. Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Alternatively, push to your connected Git repository (GitHub, GitLab, Bitbucket) and Vercel will automatically deploy.

### Project Structure

The application uses:

- **Vercel Serverless Functions** in the `/api` directory
- **Edge Function:** `/api/generate-session.ts` - Proxies requests to Claude API
- **Frontend:** React + Vite build served as static files

### API Endpoint

Once deployed, the Claude API proxy is available at:

```
https://your-project.vercel.app/api/generate-session
```

### Security Notes

- **Never commit `.env`** - It's already in `.gitignore`
- API keys are stored server-side only in Vercel environment variables
- The frontend never has direct access to the Anthropic API key
- All Claude API requests are proxied through the backend

### Local Development with Vercel

To test the Vercel Edge Function locally:

```bash
# Install dependencies
npm install

# Create .env from .env.example
cp .env.example .env

# Add your API key to .env
# ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Run Vercel dev server (includes Edge Functions)
vercel dev
```

### Troubleshooting

**Issue: API key not configured**

- Verify `ANTHROPIC_API_KEY` is set in Vercel environment variables
- Redeploy after adding environment variables
- Check variable is enabled for the correct environment (Production/Preview/Development)

**Issue: Build fails**

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `npm run build` works locally

**Issue: 404 on API routes**

- Verify `/api` directory exists in your repository
- Check `vercel.json` configuration is committed
- Ensure TypeScript files in `/api` are included in deployment

### Database Configuration (Optional)

If you need to use the database features:

1. Set up a PostgreSQL database (e.g., Neon, Supabase, Railway)
2. Add `DATABASE_URL` environment variable in Vercel:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```
3. Run database migrations before deploying

### Monitoring

- View logs in Vercel Dashboard > Deployment > Function Logs
- Monitor API usage at https://console.anthropic.com
- Set up Vercel Analytics for frontend monitoring

### Cost Considerations

- Vercel Free Tier: 100GB bandwidth, 100GB-hours serverless execution
- Anthropic API: Pay per token (see https://www.anthropic.com/pricing)
- Neon Database Free Tier: 0.5GB storage, 1 compute unit

### Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] `.env` added to `.gitignore` (already done)
- [ ] API key tested and working
- [ ] Build succeeds locally (`npm run build`)
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)
- [ ] Error monitoring set up (optional)

### Further Reading

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Anthropic API Documentation](https://docs.anthropic.com)
