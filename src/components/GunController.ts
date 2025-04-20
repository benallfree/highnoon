import * as THREE from 'three'
import { State } from 'vanjs-core'
import { Gun } from '../gun'
import { AudioManager } from './AudioManager'
import { BulletHoleDecal } from './BulletHoleDecal'
import { MuzzleFlash } from './MuzzleFlash'

export class GunController {
  private gun: Gun
  private gunModel: THREE.Group
  private remainingShots: State<number>
  private cylinderRotation: State<number>
  private audioManager: AudioManager
  private muzzleFlash: MuzzleFlash
  private bulletHoleDecal: BulletHoleDecal
  private raycaster: THREE.Raycaster
  private scene: THREE.Scene

  constructor(
    gun: Gun,
    remainingShots: State<number>,
    cylinderRotation: State<number>,
    audioManager: AudioManager,
    camera: THREE.Camera,
    scene: THREE.Scene
  ) {
    this.gun = gun
    this.remainingShots = remainingShots
    this.cylinderRotation = cylinderRotation
    this.audioManager = audioManager
    this.scene = scene
    this.gunModel = this.createGunModel()
    this.muzzleFlash = new MuzzleFlash()
    this.bulletHoleDecal = new BulletHoleDecal()
    this.raycaster = new THREE.Raycaster()
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
    barrel.rotation.z = 0
    barrel.rotation.x = Math.PI / 2 // Rotate around x-axis to point forward (-z)
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
    this.gunModel.position.set(0.5, -0.6, -1)
    this.gunModel.rotation.set(0, Math.PI, 0) // Rotate 180 degrees around Y to face forward
    camera.add(this.gunModel)

    // Add muzzle flash at the end of the barrel
    const muzzleFlashMesh = this.muzzleFlash.getMesh()
    muzzleFlashMesh.position.set(0, 0, 0.6) // Position at barrel end
    this.gunModel.add(muzzleFlashMesh)
  }

  public shoot() {
    this.cylinderRotation.val += 1
    if (this.remainingShots.val > 0) {
      this.remainingShots.val -= 1
      this.audioManager.playSound(this.gun.shot)
      this.muzzleFlash.flash()

      // Cast ray from center of screen
      const camera = this.gunModel.parent as THREE.Camera
      this.raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)

      // Check for intersections with buildings
      const intersects = this.raycaster.intersectObjects(this.scene.children, true)

      for (const intersect of intersects) {
        const mesh = intersect.object as THREE.Mesh
        // Only create bullet holes on building walls (brown color)
        if (mesh.material instanceof THREE.MeshStandardMaterial && mesh.material.color.getHex() === 0x8b4513) {
          const decal = this.bulletHoleDecal.createDecal(intersect.point, intersect.face!.normal)
          this.scene.add(decal)
          break
        }
      }
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
