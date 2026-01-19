import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ANALYTICS_DIR = path.join(__dirname, '.analytics')

function ensureDir() {
  if (!fs.existsSync(ANALYTICS_DIR)) {
    fs.mkdirSync(ANALYTICS_DIR, { recursive: true })
  }
}

function getFilePath(filename) {
  return path.join(ANALYTICS_DIR, filename)
}

function getBlobData(filename) {
  ensureDir()
  const filePath = getFilePath(filename)
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
  }
  return getDefaultData(filename)
}

function putBlobData(filename, data) {
  ensureDir()
  const filePath = getFilePath(filename)
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
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
      const visits = getBlobData('visits.json')
      visits.total = (visits.total || 0) + 1
      visits.byDay[today] = (visits.byDay[today] || 0) + 1
      putBlobData('visits.json', visits)
    }

    if (type === 'game_open') {
      const games = getBlobData('games.json')
      const gameId = data.gameId
      if (!games[gameId]) {
        games[gameId] = { opens: 0, completions: 0 }
      }
      games[gameId].opens = (games[gameId].opens || 0) + 1
      putBlobData('games.json', games)
    }

    if (type === 'game_complete') {
      const games = getBlobData('games.json')
      const gameId = data.gameId
      if (!games[gameId]) {
        games[gameId] = { opens: 0, completions: 0 }
      }
      games[gameId].completions = (games[gameId].completions || 0) + 1
      putBlobData('games.json', games)
    }

    if (type === 'session_end') {
      const sessions = getBlobData('sessions.json')
      sessions.count = (sessions.count || 0) + 1
      sessions.totalDuration = (sessions.totalDuration || 0) + (data.duration || 0)
      putBlobData('sessions.json', sessions)
    }

    if (data.performanceMode) {
      const perf = getBlobData('performance.json')
      perf[data.performanceMode] = (perf[data.performanceMode] || 0) + 1
      putBlobData('performance.json', perf)
    }

    return { success: true }
  } catch (error) {
    console.error('Analytics error:', error)
    return { success: false, error: error.message }
  }
}

function getAnalyticsData() {
  try {
    const visits = getBlobData('visits.json')
    const games = getBlobData('games.json')
    const sessions = getBlobData('sessions.json')
    const performance = getBlobData('performance.json')

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

export function createLocalAnalyticsServer() {
  return async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    
    if (url.pathname !== '/api/analytics') {
      return new Response('Not found', { status: 404 })
    }

    if (req.method === 'POST') {
      try {
        const body = await req.json()
        const result = handleAnalyticsEvent(body)
        return Response.json(result, { status: 200 })
      } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 })
      }
    } else if (req.method === 'GET') {
      try {
        const data = getAnalyticsData()
        return Response.json(data, { status: 200 })
      } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
      }
    } else {
      return Response.json({ error: 'Method not allowed' }, { status: 405 })
    }
  }
}
