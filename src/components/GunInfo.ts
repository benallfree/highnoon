import van from 'vanjs-core'
import { Gun } from '../gun'

const { div } = van.tags

export const GunInfo = (sessionGun: Gun) => {
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
