import { put, list } from '@vercel/blob'

// Tell Vercel to run this as an Edge Function so fetch/Response work as written
export const config = { runtime: 'edge' }

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
      const response = await fetch(blobs[0].url)
      if (response.ok) {
        return await response.json()
      }
    }
  } catch (error) {
    if (error?.statusCode !== 404) {
      console.error(`Error reading ${filename}:`, error)
    }
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
      contentType: 'application/json'
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
    throw error
  }
}

export default async function handler(request) {
  try {
    if (request.method === 'POST') {
      const body = await request.json()
      const result = await handleAnalyticsEvent(body)
      return Response.json(result, { status: 200 })
    } else if (request.method === 'GET') {
      const data = await getAnalyticsData()
      return Response.json(data, { status: 200 })
    } else {
      return Response.json({ error: 'Method not allowed' }, { status: 405 })
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
