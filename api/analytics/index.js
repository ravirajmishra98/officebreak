import { put, list } from '@vercel/blob'

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

async function getBlobData(filename) {
  try {
    if (!BLOB_TOKEN) {
      return getDefaultData(filename)
    }

    const { blobs } = await list({
      token: BLOB_TOKEN,
      prefix: `analytics/${filename}`
    })
    
    if (blobs.length > 0) {
      // Sort by uploadedAt to get the most recent
      const sortedBlobs = blobs.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
      
      const response = await fetch(sortedBlobs[0].url)
      if (response.ok) {
        return await response.json()
      }
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
  }
  return getDefaultData(filename)
}

async function putBlobData(filename, data) {
  try {
    if (!BLOB_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not set, skipping write')
      return
    }

    await put(`analytics/${filename}`, JSON.stringify(data, null, 2), {
      access: 'public',
      token: BLOB_TOKEN,
      contentType: 'application/json',
      addRandomSuffix: false
    })
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

function getDefaultData(filename) {
  if (filename === 'visits.json') {
    return { total: 0, byDay: {} }
  }
  if (filename === 'games.json') {
    return {}
  }
  if (filename === 'sessions.json') {
    return { count: 0, totalDuration: 0 }
  }
  if (filename === 'performance.json') {
    return { low: 0, medium: 0, high: 0 }
  }
  return {}
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

async function handleAnalyticsEvent(event) {
  try {
    const { type, data } = event
    const today = getTodayKey()

    if (type === 'app_load') {
      const visits = await getBlobData('visits.json')
      visits.total = (visits.total || 0) + 1
      visits.byDay[today] = (visits.byDay[today] || 0) + 1
      await putBlobData('visits.json', visits)
    }

    if (type === 'game_open') {
      const games = await getBlobData('games.json')
      const gameId = data.gameId
      if (!games[gameId]) {
        games[gameId] = { opens: 0, completions: 0 }
      }
      games[gameId].opens = (games[gameId].opens || 0) + 1
      await putBlobData('games.json', games)
    }

    if (type === 'game_complete') {
      const games = await getBlobData('games.json')
      const gameId = data.gameId
      if (!games[gameId]) {
        games[gameId] = { opens: 0, completions: 0 }
      }
      games[gameId].completions = (games[gameId].completions || 0) + 1
      await putBlobData('games.json', games)
    }

    if (type === 'session_end') {
      const sessions = await getBlobData('sessions.json')
      sessions.count = (sessions.count || 0) + 1
      sessions.totalDuration = (sessions.totalDuration || 0) + (data.duration || 0)
      await putBlobData('sessions.json', sessions)
    }

    if (data.performanceMode) {
      const perf = await getBlobData('performance.json')
      perf[data.performanceMode] = (perf[data.performanceMode] || 0) + 1
      await putBlobData('performance.json', perf)
    }

    return { success: true }
  } catch (error) {
    console.error('Analytics error:', error)
    return { success: false, error: error.message }
  }
}

async function getAnalyticsData() {
  try {
    const [visits, games, sessions, performance] = await Promise.all([
      getBlobData('visits.json'),
      getBlobData('games.json'),
      getBlobData('sessions.json'),
      getBlobData('performance.json')
    ])

    return {
      visits,
      games,
      sessions,
      performanceMode: performance
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return {
      visits: getDefaultData('visits.json'),
      games: getDefaultData('games.json'),
      sessions: getDefaultData('sessions.json'),
      performanceMode: getDefaultData('performance.json')
    }
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'POST') {
      const result = await handleAnalyticsEvent(req.body)
      return res.status(200).json(result)
    } else if (req.method === 'GET') {
      console.log('=== GET /api/analytics called ===')
      console.log('BLOB_TOKEN present:', !!BLOB_TOKEN)
      const data = await getAnalyticsData()
      console.log('Returning data:', JSON.stringify(data, null, 2))
      return res.status(200).json(data)
    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Analytics API error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}
