import van from 'vanjs-core'
import { Gun } from '../gun'
import { DebugPanel } from './DebugPanel'
import { Gunshot, GunShot } from './Gunshot'
import { ReloadButton } from './ReloadButton'
import { RevolverCylinder } from './RevolverCylinder'

const { div } = van.tags

export interface BulletHole extends GunShot {
  rotation: number
  size: number
}

export const Overlay = (sessionGun: Gun) => {
  const overlayStyle =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; cursor: crosshair;'

  // State for gunshot markers and ammo
  const gunshots = van.state<BulletHole[]>([])
  const remainingShots = van.state(sessionGun.capacity)
  const cylinderRotation = van.state(0)
  const mousePosition = van.state({ x: 0, y: 0 })
  const isDebugVisible = van.state(false)

  const reloadWeapon = () => {
    if (remainingShots.val < sessionGun.capacity) {
      remainingShots.val = sessionGun.capacity
      const reloadSound = new Audio(sessionGun.reload)
      reloadSound.play()
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

    mousePosition.val = { x: e.clientX, y: e.clientY }

    if (e.type === 'mousedown') {
      fireWeapon(e.clientX, e.clientY)
    }
  }

  const handleGlobalKeyEvent = (e: KeyboardEvent) => {
    if (e.code === 'KeyR' && remainingShots.val < sessionGun.capacity) {
      e.preventDefault()
      reloadWeapon()
    } else if (e.code === 'Space' && e.type === 'keydown') {
      e.preventDefault()
      fireWeapon(mousePosition.val.x, mousePosition.val.y)
    }
  }

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
    ReloadButton(remainingShots, sessionGun, reloadWeapon),
    div({ class: 'game' }, Gunshots())
  )
}
