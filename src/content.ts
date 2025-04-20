import { playRandomDraw } from './audio'
import { createWesternScene } from './components/WesternScene'
import { guns } from './gun'

console.log('Content script loaded')

// Select the Remington 1858 for this session
const sessionGun = guns.remington1858

let westernScene: ReturnType<typeof createWesternScene> | null = null

// Initialize timer variables
let idleTimer: number | null = null
const IDLE_TIMEOUT = 1000 // 5 seconds

// Reset the idle timer
const resetIdleTimer = () => {
  if (idleTimer) {
    clearTimeout(idleTimer)
  }

  // Don't start timer if scene is already active or page is hidden
  if (westernScene || document.hidden) {
    return
  }

  // Start new timer
  idleTimer = window.setTimeout(() => {
    console.log('Scene opened')
    playRandomDraw() // Play the draw sound when scene appears
    westernScene = createWesternScene()
  }, IDLE_TIMEOUT)
}

// Handle visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (westernScene) {
      westernScene.destroy()
      westernScene = null
    }
  }
  resetIdleTimer()
})

// Handle mouse movement to prevent scene from appearing
document.addEventListener('mousemove', () => {
  if (westernScene) {
    return // Don't reset timer if scene is active
  }
  resetIdleTimer()
})

// Start the idle timer
resetIdleTimer()
