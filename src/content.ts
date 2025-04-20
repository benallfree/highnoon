import { playRandomDraw } from './audio'
import { createWesternScene } from './components/WesternScene'
import { guns } from './gun'

console.log('Content script loaded')

// Select the Remington 1858 for this session
const sessionGun = guns.remington1858

let westernScene: ReturnType<typeof createWesternScene> | null = null

// High Noon community ID
const HIGH_NOON_COMMUNITY_ID = '1913997881985675401'

// Check if we're in the High Noon community
const isHighNoonCommunity = () => {
  // Look for the community link specifically in the header area
  const communityLink = document.querySelector(
    'h2[role="heading"] + div a[href*="/communities/' + HIGH_NOON_COMMUNITY_ID + '"]'
  )
  console.log('communityLink', communityLink)
  return !!communityLink
}

// Function to check and potentially start the game
const checkAndStartGame = () => {
  console.log('checkAndStartGame')
  const inCommunity = isHighNoonCommunity()

  // If we're not in the community anymore but the scene is active, destroy it
  if (!inCommunity && westernScene) {
    console.log('Left community, destroying scene')
    westernScene.destroy()
    westernScene = null
    return
  }

  // Start the game if we're in the community and it's not already running
  if (!westernScene && !document.hidden && inCommunity) {
    console.log('Scene opened')
    playRandomDraw() // Play the draw sound when scene appears
    westernScene = createWesternScene()
  }
}

// Handle visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (westernScene) {
      westernScene.destroy()
      westernScene = null
    }
  } else {
    checkAndStartGame()
  }
})

// Create a mutation observer to watch for URL/content changes
const observer = new MutationObserver(() => {
  console.log('mutation observer')
  checkAndStartGame()
})

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
})

// Initial check
checkAndStartGame()
