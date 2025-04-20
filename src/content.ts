import van from 'vanjs-core'
import { playRandomDraw } from './audio'
import { Overlay } from './components/Overlay'
import { guns } from './gun'

console.log('Content script loaded')

// Select the Remington 1858 for this session
const sessionGun = guns.remington1858

// Create state for overlay visibility
const isOverlayVisible = van.state(false)

// Initialize timer variables
let idleTimer: number | null = null
const IDLE_TIMEOUT = 1000 // 1 second for testing

// Reset the idle timer
const resetIdleTimer = () => {
  if (idleTimer) {
    clearTimeout(idleTimer)
  }

  // Don't start timer if overlay is visible or page is hidden
  if (isOverlayVisible.val || document.hidden) {
    return
  }

  // Start new timer
  idleTimer = window.setTimeout(() => {
    isOverlayVisible.val = true
    console.log('Overlay opened')
    playRandomDraw() // Play the draw sound when overlay appears
    const overlay = Overlay({
      gun: sessionGun,
      onClose: () => {
        console.log('Overlay closed')
        document.body.removeChild(overlay)
        isOverlayVisible.val = false
        resetIdleTimer() // Restart the timer after closing
      },
    })
    van.add(document.body, overlay)
  }, IDLE_TIMEOUT)
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  console.log('visibilitychange', document.hidden)
  if (document.hidden && idleTimer) {
    clearTimeout(idleTimer)
  } else {
    resetIdleTimer()
  }
})

// Add mouse and keyboard event listeners
document.addEventListener('mousemove', resetIdleTimer)
document.addEventListener('keydown', resetIdleTimer)
document.addEventListener('mousedown', resetIdleTimer)
document.addEventListener('keyup', resetIdleTimer)

// Start the initial timer only if page is visible
if (!document.hidden) {
  resetIdleTimer()
}
