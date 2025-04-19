// Gun type definitions and sound configurations

// Sound imports
import emptyClick from './fx/empty-click/11L-gun_empty_hammer_cli-1745101300930.mp3'
import oldPistolShot1 from './fx/gunshot/11L-pistol_gun_shot,_old-1745100781226.mp3'
import oldPistolShot2 from './fx/gunshot/11L-pistol_gun_shot,_old-1745100783689.mp3'
import oldPistolShot3 from './fx/gunshot/11L-pistol_gun_shot,_old-1745100784972.mp3'
import revolverShot1 from './fx/gunshot/11L-revolver_gun_shot-1745100702465.mp3'
import revolverShot2 from './fx/gunshot/11L-revolver_gun_shot-1745100705388.mp3'
import revolverReload from './fx/reload/11L-gun_revolver_reload-1745101308751.mp3'

export interface Gun {
  name: string
  description: string
  capacity: number
  shot: string
  emptyClick: string
  reload: string
}

export const guns: Record<string, Gun> = {
  peacemaker: {
    name: 'Colt Single Action Army (Peacemaker) - 1873',
    description:
      'The legendary six-shooter that won the West. Introduced in 1873, known for its reliability and distinctive sound.',
    capacity: 6,
    shot: revolverShot1,
    emptyClick,
    reload: revolverReload,
  },

  schofield: {
    name: 'Smith & Wesson Schofield - 1875',
    description: 'A top-break revolver introduced in 1875, favored by lawmen and outlaws alike.',
    capacity: 6,
    shot: revolverShot2,
    emptyClick,
    reload: revolverReload,
  },

  remington1858: {
    name: 'Remington 1858 New Army',
    description:
      'A sturdy and reliable revolver with a distinctive deep boom. First manufactured in 1858, it saw extensive use in the Civil War.',
    capacity: 6,
    shot: oldPistolShot1,
    emptyClick,
    reload: revolverReload,
  },

  dragoon: {
    name: 'Colt Dragoon - 1848',
    description:
      'A heavy cavalry revolver introduced in 1848. Favored by Texas Rangers and a predecessor to the famous Walker Colt.',
    capacity: 6,
    shot: oldPistolShot2,
    emptyClick,
    reload: revolverReload,
  },

  navy1851: {
    name: 'Colt 1851 Navy',
    description:
      'A sleek and accurate revolver introduced in 1851. Popular with Confederate officers and civilian shooters throughout the Civil War.',
    capacity: 6,
    shot: oldPistolShot3,
    emptyClick,
    reload: revolverReload,
  },
}

// Helper function to get a random gun
export const getRandomGun = (): Gun => {
  const gunKeys = Object.keys(guns)
  const randomKey = gunKeys[Math.floor(Math.random() * gunKeys.length)]
  return guns[randomKey]
}

// Helper function to get the shot sound from a gun
export const getShot = (gun: Gun): string => {
  return gun.shot
}
