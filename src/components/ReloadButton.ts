import van, { State } from 'vanjs-core'
import { Gun } from '../gun'

const { div } = van.tags

export const ReloadButton = (remainingShots: State<number>, sessionGun: Gun, onReload: () => void) => {
  const isVisible = () => remainingShots.val === 0

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onReload()
  }

  return div(
    {
      onclick: handleClick,
      style: () => `
        position: absolute;
        top: 70px;
        right: 20px;
        width: 100px;
        background: #ff3333;
        color: white;
        padding: 8px 0;
        border-radius: 8px;
        font-family: 'Old Standard TT', serif;
        font-size: 1em;
        text-align: center;
        cursor: pointer;
        opacity: ${isVisible() ? '1' : '0'};
        visibility: ${isVisible() ? 'visible' : 'hidden'};
        transition: all 0.3s ease;
        animation: ${isVisible() ? 'pulse 1s ease-in-out infinite' : 'none'};
        user-select: none;
        z-index: 10001;
        text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);

        &:hover {
          background: #ff0000;
          animation: none;
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(255, 0, 0, 0.8);
        }

        @keyframes pulse {
          0% { 
            background: #ff3333;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
            text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
          }
          50% { 
            background: #ff0000;
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.9);
            text-shadow: 0 0 10px rgba(255, 0, 0, 0.9);
          }
          100% { 
            background: #ff3333;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
            text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
          }
        }
      `,
    },
    'Reload (R)'
  )
}
