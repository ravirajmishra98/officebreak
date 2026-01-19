import { getPerformanceMode } from './storage'

class VisualEngine {
  constructor(performanceMode = null) {
    this.performanceMode = performanceMode || getPerformanceMode()
    this.animationId = null
    this.frameCount = 0
    this.time = 0
    this.callbacks = []
    this.isRunning = false
  }

  start(callback) {
    if (this.isRunning) return
    this.isRunning = true
    this.frameCount = 0
    this.time = performance.now()

    const loop = (currentTime) => {
      const delta = currentTime - this.time
      this.time = currentTime
      this.frameCount++

      const currentMode = getPerformanceMode()
      if (currentMode === 'low' && this.frameCount % 3 === 0) {
        this.animationId = requestAnimationFrame(loop)
        return
      }

      if (currentMode === 'medium' && this.frameCount % 2 === 0) {
        this.animationId = requestAnimationFrame(loop)
        return
      }

      callback(delta, this.frameCount)
      this.animationId = requestAnimationFrame(loop)
    }

    this.animationId = requestAnimationFrame(loop)
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.isRunning = false
  }

  setPerformanceMode(mode) {
    this.performanceMode = mode
  }
}

export const noise = {
  generate(x, y, time = 0) {
    const value = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time)
    return (value + 1) / 2
  },

  perlin(x, y, time = 0) {
    const n1 = Math.sin(x * 0.1 + time) * 43758.5453
    const n2 = Math.sin(y * 0.1 + time) * 43758.5453
    return ((n1 + n2) % 1)
  }
}

export const curves = {
  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },

  easeOut(t) {
    return t * (2 - t)
  },

  easeIn(t) {
    return t * t
  },

  bounce(t) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
    }
  }
}

export const glow = {
  apply(element, strength = 1, color = '#3b82f6') {
    if (!element) return
    const intensity = strength * 20
    element.style.filter = `drop-shadow(0 0 ${intensity}px ${color}) drop-shadow(0 0 ${intensity * 2}px ${color})`
  },

  remove(element) {
    if (!element) return
    element.style.filter = 'none'
  }
}

export default VisualEngine
