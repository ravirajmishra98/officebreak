# Vercel Deployment Checklist

## Pre-Deployment

- [x] Build succeeds: `npm run build`
- [x] No console errors in production build
- [x] Environment variables documented
- [x] Analytics API routes configured
- [x] Vercel serverless function format correct

## Environment Variables (Set in Vercel Dashboard)

Required:
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage token
- `VITE_ADMIN_ANALYTICS_KEY` - Secret key for analytics dashboard

## Deployment Steps

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy (automatic on push or manual)

## Post-Deployment Verification

- [ ] Home page loads: `https://your-app.vercel.app/`
- [ ] Games load and play correctly
- [ ] No console errors in browser
- [ ] Analytics events fire (check network tab)
- [ ] Analytics dashboard accessible: `https://your-app.vercel.app/__admin/analytics?key=YOUR_KEY`
- [ ] Performance mode toggle works
- [ ] All routes work (no 404s)

## Notes

- Analytics API: `/api/analytics` (serverless function)
- Build output: `dist/`
- Framework: Vite (auto-detected)
- Analytics fails gracefully if Blob token missing
