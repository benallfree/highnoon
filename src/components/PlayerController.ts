import * as THREE from 'three'
import { State } from 'vanjs-core'

export class PlayerController {
  private keys = { a: false, d: false, w: false, s: false }
  private mousePos = { x: 0, y: 0 }
  private targetRotation = new THREE.Vector3()
  private readonly MOVE_SPEED = 15.0 // Units per second
  private moveDirection = new THREE.Vector3()

  constructor(
    private playerPosition: THREE.Vector3,
    private camera: THREE.PerspectiveCamera,
    private container: HTMLDivElement,
    private mousePosition: State<{ x: number; y: number }>,
    private onShoot: () => void,
    private onReload: () => void
  ) {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  public update(deltaTime: number) {
    // Calculate forward direction based on camera rotation
    this.moveDirection.set(0, 0, -1).applyEuler(new THREE.Euler(0, this.targetRotation.y, 0))

    // Handle movement with delta time
    if (this.keys.w) {
      this.playerPosition.addScaledVector(this.moveDirection, this.MOVE_SPEED * deltaTime)
    }
    if (this.keys.s) {
      this.playerPosition.addScaledVector(this.moveDirection, -this.MOVE_SPEED * deltaTime)
    }
    if (this.keys.a) {
      // Strafe left - perpendicular to forward direction
      this.playerPosition.x -= this.MOVE_SPEED * deltaTime * Math.cos(this.targetRotation.y)
      this.playerPosition.z -= this.MOVE_SPEED * deltaTime * Math.sin(this.targetRotation.y)
    }
    if (this.keys.d) {
      // Strafe right - perpendicular to forward direction
      this.playerPosition.x += this.MOVE_SPEED * deltaTime * Math.cos(this.targetRotation.y)
      this.playerPosition.z += this.MOVE_SPEED * deltaTime * Math.sin(this.targetRotation.y)
    }

    // Update camera position
    this.camera.position.copy(this.playerPosition)

    // Smoothly rotate camera
    this.camera.rotation.x += (this.targetRotation.x - this.camera.rotation.x) * 0.1
    this.camera.rotation.y += (this.targetRotation.y - this.camera.rotation.y) * 0.1
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement === this.container) {
      this.mousePos.x += e.movementX * 0.002
      this.mousePos.y += e.movementY * 0.002

      // Update HUD mouse position for debug panel
      this.mousePosition.val = { x: e.clientX, y: e.clientY }

      // Clamp vertical rotation to prevent over-rotation
      this.mousePos.y = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.mousePos.y))

      this.targetRotation.y = -this.mousePos.x
      this.targetRotation.x = -this.mousePos.y
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'w':
        this.keys.w = true
        break
      case 's':
        this.keys.s = true
        break
      case 'a':
        this.keys.a = true
        break
      case 'd':
        this.keys.d = true
        break
      case ' ':
        e.preventDefault() // Prevent page scroll
        this.onShoot()
        break
      case 'r':
        this.onReload()
        break
    }
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'w':
        this.keys.w = false
        break
      case 's':
        this.keys.s = false
        break
      case 'a':
        this.keys.a = false
        break
      case 'd':
        this.keys.d = false
        break
    }
  }

  public destroy() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
  }
}
