import van, { State } from 'vanjs-core'
import { Gun } from '../gun'

const { div } = van.tags

interface Position {
  x: number
  y: number
}

// Create a shared state for dark mode
export const isDarkMode = van.state(localStorage.getItem('darkMode') === 'true')

// Update localStorage when dark mode changes
van.derive(() => {
  localStorage.setItem('darkMode', isDarkMode.val.toString())
})

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

  const toggleDarkMode = (e: MouseEvent) => {
    stopPropagation(e)
    isDarkMode.val = !isDarkMode.val
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
      div(() => `Mouse: (${mousePosition.val.x}, ${mousePosition.val.y})`),
      div(
        {
          style: `
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.2);
          `,
        },
        div(
          {
            onclick: toggleDarkMode,
            style: `
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 8px;
            `,
          },
          div(
            {
              style: () => `
                width: 32px;
                height: 16px;
                background: ${isDarkMode.val ? '#4a5568' : '#2d3748'};
                border-radius: 999px;
                position: relative;
                transition: background 0.2s ease;
              `,
            },
            div({
              style: () => `
                width: 14px;
                height: 14px;
                background: white;
                border-radius: 50%;
                position: absolute;
                top: 1px;
                left: ${isDarkMode.val ? '17px' : '1px'};
                transition: left 0.2s ease;
              `,
            })
          ),
          () => `Theme: ${isDarkMode.val ? 'Dark' : 'Light'}`
        )
      )
    )

  return div(GearIcon(), DebugInfo())
}
