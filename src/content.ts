import van from 'vanjs-core'
import { Overlay } from './components/Overlay'
import { guns } from './gun'

console.log('Content script loaded')

// Select the Remington 1858 for this session
const sessionGun = guns.remington1858

// Create state for overlay visibility
const isOverlayVisible = van.state(false)

// Initialize timer variables
let idleTimer: number | null = null
const IDLE_TIMEOUT = 5000 // 30 seconds in milliseconds

// Reset the idle timer
const resetIdleTimer = () => {
  if (idleTimer) {
    clearTimeout(idleTimer)
  }

  // Start new timer
  idleTimer = window.setTimeout(() => {
    isOverlayVisible.val = true
    van.add(document.body, Overlay(sessionGun))
  }, IDLE_TIMEOUT)
}

// Add mouse movement listener
document.addEventListener('mousemove', resetIdleTimer)

// Start the initial timer
resetIdleTimer()
