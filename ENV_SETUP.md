# Environment Variables Required

## Vercel Deployment

Set these in Vercel dashboard under Project Settings > Environment Variables:

- `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage read/write token
- `VITE_ADMIN_ANALYTICS_KEY` - Secret key for accessing analytics dashboard

## Local Development

Create `.env.local` file:

```
BLOB_READ_WRITE_TOKEN=your_blob_token_here
VITE_ADMIN_ANALYTICS_KEY=your_secret_key_here
```

## Analytics Dashboard Access

Access the private analytics dashboard at:
`/__admin/analytics?key=YOUR_ADMIN_KEY`

The dashboard is NOT linked anywhere in the UI and requires the correct key query parameter.
