# Testing Analytics Locally

## Method 1: Local File Storage (Recommended for Development)

The Vite dev server now includes a middleware that handles analytics API calls locally using file storage.

### Setup

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Analytics data will be stored in:**
   ```
   .analytics/
   ├── visits.json
   ├── games.json
   ├── sessions.json
   └── performance.json
   ```

3. **Test analytics:**
   - Open the app in browser
   - Navigate to different games
   - Check `.analytics/` folder for data files
   - View analytics dashboard at: `http://localhost:5173/__admin/analytics?key=YOUR_KEY`

### View Analytics Dashboard

1. Set `VITE_ADMIN_ANALYTICS_KEY` in `.env.local`:
   ```
   VITE_ADMIN_ANALYTICS_KEY=test-key-123
   ```

2. Access dashboard:
   ```
   http://localhost:5173/__admin/analytics?key=test-key-123
   ```

### Reset Analytics Data

Delete the `.analytics` folder:
```bash
rm -rf .analytics
```

---

## Method 2: Using Vercel CLI (For Production Testing)

If you want to test with actual Vercel Blob storage:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   vercel link
   ```

4. **Set environment variables:**
   ```bash
   vercel env add BLOB_READ_WRITE_TOKEN
   vercel env add VITE_ADMIN_ANALYTICS_KEY
   ```

5. **Run dev server with Vercel:**
   ```bash
   vercel dev
   ```

   This will use actual Vercel Blob storage and serverless functions.

---

## Testing Checklist

- [ ] App load tracking works
- [ ] Game open tracking works
- [ ] Game completion tracking works (when games complete)
- [ ] Session end tracking works (on page unload)
- [ ] Performance mode tracking works
- [ ] Analytics dashboard displays data correctly
- [ ] Dashboard requires correct key
- [ ] Dashboard returns 404 with wrong/missing key

---

## Debugging

### Check Browser Console
- Analytics calls should not show errors
- Failed calls are silently ignored (by design)

### Check Analytics Files
```bash
# View current analytics data
cat .analytics/visits.json
cat .analytics/games.json
cat .analytics/sessions.json
cat .analytics/performance.json
```

### Test API Directly
```bash
# Test POST (track event)
curl -X POST http://localhost:5173/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"type":"app_load","data":{"performanceMode":"medium"}}'

# Test GET (fetch analytics)
curl http://localhost:5173/api/analytics
```

---

## Notes

- Local file storage is automatically used when running `npm run dev`
- No Vercel Blob token needed for local development
- Analytics data persists between dev server restarts
- `.analytics/` folder is gitignored (add to `.gitignore`)
