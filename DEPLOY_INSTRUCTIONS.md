# Vercel Deployment Instructions

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com/new
2. **Import your Git repository** (GitHub/GitLab/Bitbucket)
3. **Configure project**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Add Environment Variables**:
   - `BLOB_READ_WRITE_TOKEN` - Your Vercel Blob token
   - `VITE_ADMIN_ANALYTICS_KEY` - Your admin dashboard secret key
5. **Click Deploy**

## Option 2: Deploy via CLI (If logged in)

```bash
# Login first (if not already)
npx vercel login

# Deploy to production
npx vercel --prod

# Or deploy to preview
npx vercel
```

## Environment Variables Setup

After deployment, add these in Vercel Dashboard:
- **Settings** → **Environment Variables**
- Add:
  - `BLOB_READ_WRITE_TOKEN` (Production, Preview, Development)
  - `VITE_ADMIN_ANALYTICS_KEY` (Production, Preview, Development)

## Post-Deployment

1. Visit your deployed URL
2. Test analytics dashboard: `https://your-app.vercel.app/__admin/analytics?key=YOUR_KEY`
3. Verify games load correctly
4. Check browser console for errors

## Troubleshooting

If CLI deployment fails:
- Use Vercel Dashboard (Option 1) - more reliable
- Ensure Git repository is pushed
- Check environment variables are set correctly
