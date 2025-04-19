import van from 'vanjs-core'
import { guns } from './gun'

const { div } = van.tags

// Select the Remington 1858 for this session
const sessionGun = guns.remington1858

const GunInfo = () => {
  const extractYear = (name: string) => {
    const match = name.match(/\b18\d{2}\b/)
    return match ? match[0] : ''
  }

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
      `,
    },
    div({ style: 'font-size: 1.2em; margin-bottom: 5px; color: #d4af37;' }, sessionGun.name),
    div({ style: 'font-size: 0.9em; line-height: 1.4;' }, sessionGun.description)
  )
}

const root = () =>
  div(
    {
      id: 'root',
    },
    GunInfo(),
    'High Noon'
  )

van.add(document.body, root())
