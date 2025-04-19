import van, { State } from 'vanjs-core'
import { Gun } from '../gun'

const { div } = van.tags

interface Position {
  x: number
  y: number
}

export const DebugPanel = (
  isVisible: State<boolean>,
  sessionGun: Gun,
  remainingShots: State<number>,
  mousePosition: State<Position>
) => {
  const stopPropagation = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const toggleDebug = (e: MouseEvent) => {
    stopPropagation(e)
    isVisible.val = !isVisible.val
  }

  // Gear icon using Unicode character
  const GearIcon = () =>
    div(
      {
        onclick: toggleDebug,
        onmousedown: stopPropagation,
        onmouseup: stopPropagation,
        style: `
        position: fixed;
        top: 20px;
        left: 20px;
        font-size: 24px;
        cursor: pointer;
        color: #fff;
        background: rgba(0, 0, 0, 0.7);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        transition: transform 0.3s ease;
        &:hover {
          transform: rotate(90deg);
        }
      `,
      },
      '⚙️'
    )

  const DebugInfo = () =>
    div(
      {
        onclick: stopPropagation,
        onmousedown: stopPropagation,
        onmouseup: stopPropagation,
        style: () =>
          `
          position: fixed;
          top: 70px;
          left: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 15px;
          border-radius: 8px;
          font-family: monospace;
          min-width: 200px;
          z-index: 10001;
          display: ${isVisible.val ? 'block' : 'none'};
        `,
      },
      div({ style: 'color: #d4af37; margin-bottom: 10px;' }, 'Debug Info'),
      div(() => `Game: High Noon`),
      div(() => `Gun: ${sessionGun.name}`),
      div(() => `Capacity: ${sessionGun.capacity}`),
      div(() => `Remaining: ${remainingShots.val}`),
      div(() => `Mouse: (${mousePosition.val.x}, ${mousePosition.val.y})`)
    )

  return div(GearIcon(), DebugInfo())
}
