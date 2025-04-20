import * as THREE from 'three'
import { State } from 'vanjs-core'
import { Gun } from '../gun'
import { AudioManager } from './AudioManager'

export class GunController {
  private gun: Gun
  private gunModel: THREE.Group
  private remainingShots: State<number>
  private cylinderRotation: State<number>
  private audioManager: AudioManager

  constructor(
    gun: Gun,
    remainingShots: State<number>,
    cylinderRotation: State<number>,
    audioManager: AudioManager,
    camera: THREE.Camera
  ) {
    this.gun = gun
    this.remainingShots = remainingShots
    this.cylinderRotation = cylinderRotation
    this.audioManager = audioManager
    this.gunModel = this.createGunModel()
    this.addGunToCamera(camera)
  }

  private createGunModel(): THREE.Group {
    const gun = new THREE.Group()

    // Barrel
    const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8)
    const barrelMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      metalness: 0.8,
      roughness: 0.2,
    })
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial)
    barrel.rotation.x = Math.PI / 2
    gun.add(barrel)

    // Handle
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1)
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a3c2b,
      roughness: 0.9,
    })
    const handle = new THREE.Mesh(handleGeometry, handleMaterial)
    handle.position.y = -0.2
    gun.add(handle)

    return gun
  }

  private addGunToCamera(camera: THREE.Camera) {
    // Position the gun in the bottom right of the view
    this.gunModel.position.set(0.3, -0.2, -0.5)
    this.gunModel.rotation.y = -Math.PI / 12
    camera.add(this.gunModel)
  }

  public shoot() {
    this.cylinderRotation.val += 1
    if (this.remainingShots.val > 0) {
      this.remainingShots.val -= 1
      this.audioManager.playSound(this.gun.shot)
    } else {
      this.audioManager.playSound(this.gun.emptyClick)
    }
  }

  public reload() {
    if (this.remainingShots.val < this.gun.capacity) {
      this.remainingShots.val = this.gun.capacity
      this.audioManager.playSound(this.gun.reload)
    }
  }
}
