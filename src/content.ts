import { playRandomDraw } from './audio'
import { createWesternScene } from './components/WesternScene'
import { guns } from './gun'

console.log('Content script loaded')

// Select the Remington 1858 for this session
const sessionGun = guns.remington1858

let westernScene: ReturnType<typeof createWesternScene> | null = null

// Check if we're in the High Noon community
const findTestPost = () => {
  // Look for posts containing "test post"
  const postText = document.querySelector('div[data-testid="tweetText"]')
  if (!postText?.textContent?.toLowerCase().includes('test post')) return null

  // Find the article element containing this post
  const article = postText.closest('article')
  if (!article) return null

  return article
}

// Function to check and potentially start the game
const checkAndStartGame = () => {
  console.log('checkAndStartGame')
  const testPost = findTestPost()

  // If we're not in the community anymore but the scene is active, destroy it
  if (!testPost && westernScene) {
    console.log('Left community, destroying scene')
    westernScene.destroy()
    westernScene = null
    return
  }

  // Start the game if we found the post and it's not already running
  if (!westernScene && !document.hidden && testPost) {
    console.log('Scene opened')
    playRandomDraw() // Play the draw sound when scene appears

    // Create a container for the game
    const gameContainer = document.createElement('div')
    gameContainer.style.width = '100%'
    gameContainer.style.height = '400px'
    gameContainer.style.marginTop = '10px'
    gameContainer.style.marginBottom = '10px'
    gameContainer.style.backgroundColor = '#d3b98d'
    gameContainer.style.borderRadius = '16px'
    gameContainer.style.overflow = 'hidden'

    // Insert the container after the article
    testPost.parentNode?.insertBefore(gameContainer, testPost.nextSibling)

    // Create the western scene inside the container
    westernScene = createWesternScene({
      width: gameContainer.clientWidth,
      height: gameContainer.clientHeight,
      container: gameContainer,
    })
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
