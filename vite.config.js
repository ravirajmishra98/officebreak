import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'analytics-api',
      configureServer(server) {
        if (process.env.NODE_ENV === 'development') {
          server.middlewares.use('/api/analytics', async (req, res, next) => {
            if (req.method === 'POST') {
              try {
                let body = ''
                req.on('data', chunk => { body += chunk })
                req.on('end', () => {
                  const event = JSON.parse(body)
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

                  res.writeHead(200, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ success: true }))
                })
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: false, error: error.message }))
              }
            } else if (req.method === 'GET') {
              try {
                const visits = getBlobData('visits.json')
                const games = getBlobData('games.json')
                const sessions = getBlobData('sessions.json')
                const performance = getBlobData('performance.json')

                const data = {
                  visits,
                  games,
                  sessions,
                  performanceMode: performance
                }

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(data))
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: error.message }))
              }
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Method not allowed' }))
            }
          })
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
