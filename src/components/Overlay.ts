import van from 'vanjs-core'
import { Gun } from '../gun'
import { GunInfo } from './GunInfo'
import { Gunshot, GunShot } from './Gunshot'
import { RevolverCylinder } from './RevolverCylinder'

const { div } = van.tags

export const Overlay = (sessionGun: Gun) => {
  const overlayStyle =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; cursor: crosshair;'

  // State for gunshot markers and ammo
  const gunshots = van.state<GunShot[]>([])
  const remainingShots = van.state(sessionGun.capacity)
  const cylinderRotation = van.state(0)

  const handleMouseEvent = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'mousedown') {
      cylinderRotation.val += 1
      if (remainingShots.val > 0) {
        gunshots.val = [...gunshots.val, { x: e.clientX, y: e.clientY }]
        remainingShots.val -= 1
        // Use the session gun's shot sound
        const shotSound = new Audio(sessionGun.shot)
        shotSound.play()
      } else {
        const emptySound = new Audio(sessionGun.emptyClick)
        emptySound.play()
      }
    }
  }

  const handleKeyEvent = (e: KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Press 'R' to reload
    if (e.code === 'KeyR' && remainingShots.val < sessionGun.capacity) {
      remainingShots.val = sessionGun.capacity
      const reloadSound = new Audio(sessionGun.reload)
      reloadSound.play()
    }
  }

  const Gunshots = () => {
    return () => {
      console.log('***gunshots', gunshots.val)
      return div({ class: 'gunshots-container' }, ...gunshots.val.map((shot) => Gunshot(shot)))
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
      tabindex: 0,
    },
    GunInfo(sessionGun),
    RevolverCylinder(remainingShots, cylinderRotation),
    div(
      { class: 'game' },
      div({ class: 'game-title' }, 'High Noon'),
      div({ class: 'game-content' }, () => `${sessionGun.name} - Shots remaining: ${remainingShots.val}`),
      Gunshots()
    )
  )
}
