import van from 'vanjs-core'
import { Gun } from '../gun'
import { createRandomCowboy } from './Cowboy3D'
import { DebugPanel } from './DebugPanel'
import { Gunshot, GunShot } from './Gunshot'
import { ReloadButton } from './ReloadButton'
import { RevolverCylinder } from './RevolverCylinder'

const { div } = van.tags

export interface BulletHole extends GunShot {
  rotation: number
  size: number
}

export interface OverlayOptions {
  gun: Gun
  onClose?: () => void
}

export const Overlay = ({ gun, onClose }: OverlayOptions) => {
  const overlayStyle =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; cursor: crosshair;'

  // State for gunshot markers and ammo
  const gunshots = van.state<BulletHole[]>([])
  const remainingShots = van.state(gun.capacity)
  const cylinderRotation = van.state(0)
  const mousePosition = van.state({ x: 0, y: 0 })
  const isDebugVisible = van.state(false)

  // Create a cowboy
  const cowboy = createRandomCowboy(() => cleanup())

  const reloadWeapon = () => {
    if (remainingShots.val < gun.capacity) {
      remainingShots.val = gun.capacity
      if (gun.reload) {
        const reloadSound = new Audio(gun.reload)
        reloadSound.play()
      }
    }
  }

  const fireWeapon = (x: number, y: number) => {
    cylinderRotation.val += 1
    if (remainingShots.val > 0) {
      const newBulletHole: BulletHole = {
        x,
        y,
        rotation: Math.random() * 360,
        size: 11 + Math.random() * 2,
      }
      gunshots.val = [...gunshots.val, newBulletHole]
      remainingShots.val -= 1
      if (gun.shot) {
        const shotSound = new Audio(gun.shot)
        shotSound.play()
      }

      // Check if we hit the cowboy
      cowboy.checkHit(x, y)
    } else if (gun.emptyClick) {
      const emptySound = new Audio(gun.emptyClick)
      emptySound.play()
    }
  }

  const handleMouseEvent = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    mousePosition.val = { x: e.clientX, y: e.clientY }

    if (e.type === 'mousedown') {
      fireWeapon(e.clientX, e.clientY)
    }
  }

  const handleGlobalKeyEvent = (e: KeyboardEvent) => {
    // Always prevent default and stop propagation for any key
    e.preventDefault()
    e.stopPropagation()

    // Only handle actual actions on keydown
    if (e.type === 'keydown') {
      console.log('handleGlobalKeyEvent', e.code)
      if (e.code === 'KeyR' && remainingShots.val < gun.capacity) {
        reloadWeapon()
      } else if (e.code === 'Space') {
        fireWeapon(mousePosition.val.x, mousePosition.val.y)
      } else if (e.code === 'KeyC') {
        cleanup()
      }
    }
  }

  // Setup cleanup function
  const cleanup = () => {
    window.removeEventListener('keydown', handleGlobalKeyEvent)
    window.removeEventListener('keypress', handleGlobalKeyEvent)
    cowboy.destroy()
    onClose?.()
  }

  // Add the event listeners and wrap onClose to include cleanup
  window.addEventListener('keydown', handleGlobalKeyEvent)
  window.addEventListener('keypress', handleGlobalKeyEvent)

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
    DebugPanel(isDebugVisible, gun, remainingShots, mousePosition),
    RevolverCylinder(remainingShots, cylinderRotation),
    ReloadButton(remainingShots, gun, reloadWeapon),
    div({ class: 'game' }, Gunshots())
  )
}
