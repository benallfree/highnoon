// Gun type definitions and sound configurations

// Sound imports
import * as THREE from 'three'
import emptyClick from './fx/empty-click/11L-gun_empty_hammer_cli-1745101300930.mp3'
import oldPistolShot1 from './fx/gunshot/11L-pistol_gun_shot,_old-1745100781226.mp3'
import {
  default as oldPistolShot2,
  default as oldPistolShot3,
} from './fx/gunshot/11L-pistol_gun_shot,_old-1745100784972.mp3'
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
  createModel: () => THREE.Group
  muzzleFlashPosition: THREE.Vector3
}

function createDefaultGunModel(): THREE.Group {
  const gun = new THREE.Group()

  // Barrel
  const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8)
  const barrelMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    metalness: 0.8,
    roughness: 0.2,
  })
  const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial)
  barrel.rotation.z = 0
  barrel.rotation.x = Math.PI / 2
  barrel.position.z = 0.2
  gun.add(barrel)

  // Handle
  const handleGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1)
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a3c2b,
    roughness: 0.9,
  })
  const handle = new THREE.Mesh(handleGeometry, handleMaterial)
  handle.position.y = -0.15
  handle.position.z = 0.1
  gun.add(handle)

  return gun
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
    createModel: createDefaultGunModel,
    muzzleFlashPosition: new THREE.Vector3(0, 0, 0.6),
  },

  schofield: {
    name: 'Smith & Wesson Schofield - 1875',
    description: 'A top-break revolver introduced in 1875, favored by lawmen and outlaws alike.',
    capacity: 6,
    shot: revolverShot2,
    emptyClick,
    reload: revolverReload,
    createModel: createDefaultGunModel,
    muzzleFlashPosition: new THREE.Vector3(0, 0, 0.6),
  },

  remington1858: {
    name: 'Remington 1858 New Army',
    description:
      'A sturdy and reliable revolver with a distinctive deep boom. First manufactured in 1858, it saw extensive use in the Civil War.',
    capacity: 6,
    shot: oldPistolShot1,
    emptyClick,
    reload: revolverReload,
    createModel: createDefaultGunModel,
    muzzleFlashPosition: new THREE.Vector3(0, 0, 0.6),
  },

  dragoon: {
    name: 'Colt Dragoon - 1848',
    description:
      'A heavy cavalry revolver introduced in 1848. Favored by Texas Rangers and a predecessor to the famous Walker Colt.',
    capacity: 6,
    shot: oldPistolShot2,
    emptyClick,
    reload: revolverReload,
    createModel: createDefaultGunModel,
    muzzleFlashPosition: new THREE.Vector3(0, 0, 0.6),
  },

  navy1851: {
    name: 'Colt 1851 Navy',
    description:
      'A sleek and accurate revolver introduced in 1851. Popular with Confederate officers and civilian shooters throughout the Civil War.',
    capacity: 6,
    shot: oldPistolShot3,
    emptyClick,
    reload: revolverReload,
    createModel: createDefaultGunModel,
    muzzleFlashPosition: new THREE.Vector3(0, 0, 0.6),
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
