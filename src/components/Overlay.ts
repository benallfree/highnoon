import van from 'vanjs-core'
import { Gun } from '../gun'
import { DebugPanel } from './DebugPanel'
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
  const mousePosition = van.state({ x: 0, y: 0 })
  const isDebugVisible = van.state(false)

  const fireWeapon = (x: number, y: number) => {
    cylinderRotation.val += 1
    if (remainingShots.val > 0) {
      gunshots.val = [...gunshots.val, { x, y }]
      remainingShots.val -= 1
      // Use the session gun's shot sound
      const shotSound = new Audio(sessionGun.shot)
      shotSound.play()
    } else {
      const emptySound = new Audio(sessionGun.emptyClick)
      emptySound.play()
    }
  }

  const handleMouseEvent = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Update mouse position on any mouse event
    mousePosition.val = { x: e.clientX, y: e.clientY }

    if (e.type === 'mousedown') {
      fireWeapon(e.clientX, e.clientY)
    }
  }

  const handleGlobalKeyEvent = (e: KeyboardEvent) => {
    // Press 'R' to reload
    if (e.code === 'KeyR' && remainingShots.val < sessionGun.capacity) {
      e.preventDefault()
      remainingShots.val = sessionGun.capacity
      const reloadSound = new Audio(sessionGun.reload)
      reloadSound.play()
    }
    // Press Space to fire
    else if (e.code === 'Space' && e.type === 'keydown') {
      e.preventDefault()
      // Fire at the current mouse position
      fireWeapon(mousePosition.val.x, mousePosition.val.y)
    }
  }

  // Set up global key handler
  van.derive(() => {
    window.addEventListener('keydown', handleGlobalKeyEvent)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyEvent)
    }
  })

  const Gunshots = () => {
    return () => {
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
      tabindex: 0,
    },
    DebugPanel(isDebugVisible, sessionGun, remainingShots, mousePosition),
    RevolverCylinder(remainingShots, cylinderRotation),
    div({ class: 'game' }, Gunshots())
  )
}
