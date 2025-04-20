import * as THREE from 'three'
import { State } from 'vanjs-core'
import { Gun } from '../gun'
import { AudioManager } from './AudioManager'
import { MuzzleFlash } from './MuzzleFlash'

export class GunController {
  private gun: Gun
  private gunModel: THREE.Group
  private remainingShots: State<number>
  private cylinderRotation: State<number>
  private audioManager: AudioManager
  private muzzleFlash: MuzzleFlash

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
    this.muzzleFlash = new MuzzleFlash()
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
    barrel.rotation.z = Math.PI / 2
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

  private addGunToCamera(camera: THREE.Camera) {
    // Position the gun in the bottom right of the view
    this.gunModel.position.set(0.5, -0.4, -1)
    this.gunModel.rotation.set(0, 0, 0)
    camera.add(this.gunModel)

    // Add muzzle flash at the end of the barrel
    const muzzleFlashMesh = this.muzzleFlash.getMesh()
    muzzleFlashMesh.position.set(0, 0, 0.4) // Position at barrel end
    this.gunModel.add(muzzleFlashMesh)
  }

  public shoot() {
    this.cylinderRotation.val += 1
    if (this.remainingShots.val > 0) {
      this.remainingShots.val -= 1
      this.audioManager.playSound(this.gun.shot)
      this.muzzleFlash.flash()
    } else {
      this.audioManager.playSound(this.gun.emptyClick)
    }
  }

  public update() {
    this.muzzleFlash.update()
  }

  public reload() {
    if (this.remainingShots.val < this.gun.capacity) {
      this.remainingShots.val = this.gun.capacity
      this.audioManager.playSound(this.gun.reload)
    }
  }
}
