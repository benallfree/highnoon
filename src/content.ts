import van, { State } from 'vanjs-core'
import { Gun, guns } from './gun'

console.log('Content script loaded')

const { div } = van.tags

// Select the Remington 1858 for this session
const sessionGun: Gun = guns.remington1858

const GunInfo = () => {
  return div(
    {
      style: `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 15px;
        border-radius: 8px;
        font-family: 'Old Standard TT', serif;
        max-width: 300px;
        z-index: 10000;
      `,
    },
    div({ style: 'font-size: 1.2em; margin-bottom: 5px; color: #d4af37;' }, sessionGun.name),
    div({ style: 'font-size: 0.9em; line-height: 1.4;' }, sessionGun.description)
  )
}

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

const RevolverCylinder = (remainingShots: State<number>) => {
  const rotationDegrees = van.derive(() => (6 - remainingShots.val) * 60)
  console.log('rotationDegrees', rotationDegrees.val)
  return div(
    {
      class: 'revolver-cylinder',
      style: () => `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 100px;
        height: 100px;
        background:rgb(132, 117, 117);
        border-radius: 50%;
        border: 8px solid #1a1a1a;
        box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3);
        transform: rotate(${rotationDegrees.val}deg);
        transform-origin: center center;
        transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      `,
    },
    // Create 6 bullet chambers
    ...Array(6)
      .fill(0)
      .map((_, i) => {
        console.log('***i', i)
        const angle = i * 60
        const radius = 25 // Reduced radius to keep bullets more centered
        // Calculate position relative to center
        const x = 50 + radius * Math.cos(((angle - 90) * Math.PI) / 180)
        const y = 50 + radius * Math.sin(((angle - 90) * Math.PI) / 180)

        return div({
          style: () => `
            position: absolute;
            width: 20px;
            height: 20px;
            background: ${i < remainingShots.val ? '#d4af37' : '#1a1a1a'};
            border-radius: 50%;
            transform: translate(-50%, -50%);
            left: ${x}%;
            top: ${y}%;
            transition: background-color 0.3s ease;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
            border: 2px solid ${i < remainingShots.val ? '#ffd700' : '#333'};
          `,
        })
      })
  )
}

const Overlay = () => {
  const overlayStyle =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; cursor: crosshair;'

  // State for gunshot markers and ammo
  const gunshots = van.state<GunShot[]>([])
  const remainingShots = van.state(sessionGun.capacity)

  const handleMouseEvent = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'mousedown') {
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
    console.log('Key event:', {
      type: e.type,
      key: e.key,
      code: e.code,
    })

    // Press 'R' to reload
    if (e.code === 'KeyR' && remainingShots.val < sessionGun.capacity) {
      remainingShots.val = sessionGun.capacity
      const reloadSound = new Audio(sessionGun.reload)
      reloadSound.play()
    }
  }

  const Gunshots = () => {
    console.log('Gunshots:', gunshots.val.length)
    return gunshots.val.map((shot) => Gunshot(shot))
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
    GunInfo(),
    RevolverCylinder(remainingShots),
    div(
      { class: 'game' },
      div({ class: 'game-title' }, 'High Noon'),
      div({ class: 'game-content' }, () => `${sessionGun.name} - Shots remaining: ${remainingShots.val}`),
      Gunshots()
    )
  )
}

van.add(document.body, Overlay())
