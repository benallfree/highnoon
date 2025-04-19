import van from 'vanjs-core'

const { div } = van.tags

export interface GunShot {
  x: number
  y: number
}

export const Gunshot = ({ x, y }: GunShot) => {
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
