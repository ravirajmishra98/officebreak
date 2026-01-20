import { games } from '../src/config/gamesConfig.js'

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default async function handler(req, res) {
  try {
    const origin = req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host']
      ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
      : (req.headers.host ? `https://${req.headers.host}` : '')

    const urls = []
    urls.push(`${origin}/`)

    games
      .filter(g => !g.underImprovement)
      .forEach(g => urls.push(`${origin}${g.route}`))

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${escapeXml(u)}</loc></url>`).join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.status(200).send(xml)
  } catch (e) {
    res.status(500).send('')
  }
}
