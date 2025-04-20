import van from 'vanjs-core'
import { playRandomDraw } from './audio'
import { createWesternScene } from './components/WesternScene'
import { guns } from './gun'

const { div } = van.tags

console.log('Content script loaded')

// Global flag to track if game is already embedded
let isGameEmbedded = false

// Select the Remington 1858 for this session
const sessionGun = guns.remington1858

let westernScene: ReturnType<typeof createWesternScene> | null = null

// Check if we're in the High Noon community
const findTestPost = () => {
  // Only proceed if we're on a specific post URL
  if (!window.location.pathname.match(/\/[^\/]+\/status\/\d+$/)) return null

  // Look for any top-level post (not replies)
  const postText = document.querySelector('div[data-testid="tweetText"]')
  if (!postText) return null

  // Find the article element containing this post
  const article = postText.closest('article')
  if (!article) return null

  // Check if this is a top-level post by looking for reply indicators
  const isReply = article.querySelector('[data-testid="socialContext"]')
  if (isReply) return null

  return article
}

// Function to check and potentially start the game
const checkAndStartGame = () => {
  const testPost = findTestPost()

  // If we're not in the community anymore but the scene is active, destroy it
  if (!testPost && westernScene) {
    console.log('Left community, destroying scene')
    westernScene.destroy()
    westernScene = null
    isGameEmbedded = false
    return
  }

  // Start the game if we found the post and it's not already running
  if (!westernScene && !document.hidden && testPost && !isGameEmbedded) {
    console.log('Scene opened')
    playRandomDraw() // Play the draw sound when scene appears
    isGameEmbedded = true

    // Create a container for the game using VanJS
    const gameContainer = div({
      style: `
        height: 400px;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        background-color: #d3b98d;
        border-radius: 16px;
        overflow: hidden;
      `,
    })

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
  checkAndStartGame()
})

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
})

// Initial check
checkAndStartGame()
