import van from 'vanjs-core'
import { isDarkMode } from './DebugPanel'

const { div } = van.tags

export interface GunShot {
  x: number
  y: number
}

export const Gunshot = ({ x, y }: GunShot) => {
  const rotation = Math.random() * 360
  const size = 11 + Math.random() * 2

  return div({
    style: () => {
      const colors = isDarkMode.val
        ? {
            center: '#ffffff',
            mid1: '#e0e0e0',
            mid2: '#c0c0c0',
            mid3: '#a0a0a0',
            edge: 'rgba(255,255,255,0.3)',
          }
        : {
            center: '#000000',
            mid1: '#0a0a0a',
            mid2: '#1a1a1a',
            mid3: '#333333',
            edge: 'rgba(51,51,51,0.3)',
          }

      return `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle at 45%,
          ${colors.center} 0%,
          ${colors.mid1} 25%,
          ${colors.mid2} 40%,
          ${colors.mid3} 60%,
          ${colors.edge} 80%,
          transparent 100%
        );
        box-shadow: inset 0 1px 2px ${isDarkMode.val ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)'};
        transform: translate(-50%, -50%) rotate(${rotation}deg);
        left: ${x}px;
        top: ${y}px;
      `
    },
  })
}
