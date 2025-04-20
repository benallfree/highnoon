import van from 'vanjs-core'
import { isDarkMode } from './DebugPanel'

const { div } = van.tags

export interface BulletHole extends GunShot {
  rotation: number
  size: number
}

export interface GunShot {
  x: number
  y: number
}

export const Gunshot = ({ x, y, rotation, size }: BulletHole) => {
  // Compute colors once when bullet hole is created
  const colors = isDarkMode.val
    ? {
        center: '#ffffff',
        mid1: '#e0e0e0',
        mid2: '#c0c0c0',
        mid3: '#a0a0a0',
        edge: 'rgba(255,255,255,0.3)',
        shadow: 'rgba(0,0,0,0.2)',
      }
    : {
        center: '#000000',
        mid1: '#0a0a0a',
        mid2: '#1a1a1a',
        mid3: '#333333',
        edge: 'rgba(51,51,51,0.3)',
        shadow: 'rgba(255,255,255,0.1)',
      }

  // Create the style string once
  const style = `
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
    box-shadow: inset 0 1px 2px ${colors.shadow};
    transform: translate(-50%, -50%) rotate(${rotation}deg);
    left: ${x}px;
    top: ${y}px;
  `

  return div({ style })
}
