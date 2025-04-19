import van from 'vanjs-core'
import { playEmptyClick, playRandomGunshot, playRandomReload } from './audio'

console.log('Content script loaded')

const { div } = van.tags

interface GunShot {
  x: number
  y: number
}

const Gunshot = ({ x, y }: GunShot) => {
  return div({
    style: `
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: #ff0000;
      transform: translate(-50%, -50%);
      left: ${x}px;
      top: ${y}px;
    `,
  })
}

const Overlay = () => {
  const overlayStyle =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; cursor: pointer;'

  // State for gunshot markers and ammo
  const gunshots = van.state<GunShot[]>([])
  const remainingShots = van.state(6)

  const handleMouseEvent = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Mouse event:', {
      type: e.type,
      x: e.clientX,
      y: e.clientY,
      button: e.button,
    })

    if (e.type === 'mousedown') {
      if (remainingShots.val > 0) {
        gunshots.val = [...gunshots.val, { x: e.clientX, y: e.clientY }]
        remainingShots.val -= 1
        playRandomGunshot()
      } else {
        playEmptyClick()
      }
    }
  }

  const handleKeyEvent = (e: KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Key event:', {
      type: e.type,
      key: e.key,
      code: e.code,
    })

    // Press 'R' to reload
    if (e.code === 'KeyR' && remainingShots.val < 6) {
      remainingShots.val = 6
      playRandomReload()
    }
  }

  return div(
    {
      class: 'game-overlay',
      style: overlayStyle,
      onclick: handleMouseEvent,
      onmousedown: handleMouseEvent,
      onmouseup: handleMouseEvent,
      onmousemove: handleMouseEvent,
      onkeydown: handleKeyEvent,
      onkeyup: handleKeyEvent,
      onkeypress: handleKeyEvent,
      tabindex: 0, // Makes the div focusable for keyboard events
    },
    div(
      { class: 'game' },
      div({ class: 'game-title' }, 'High Noon'),
      div({ class: 'game-content' }, `Shots remaining: ${remainingShots}`),
      ...gunshots.val.map((shot) => Gunshot(shot))
    )
  )
}

van.add(document.body, Overlay())
