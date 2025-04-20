import * as THREE from 'three'

export class MuzzleFlash {
  private sprite: THREE.Sprite
  private material: THREE.SpriteMaterial
  private isVisible = false
  private fadeStartTime = 0
  private readonly FLASH_DURATION = 0.1 // Duration in seconds

  constructor() {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')!

    // Create radial gradient for the flash
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 230, 150, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 160, 50, 0.6)')
    gradient.addColorStop(1, 'rgba(255, 120, 0, 0)')

    // Draw gradient
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)

    const texture = new THREE.CanvasTexture(canvas)
    this.material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      opacity: 0,
    })

    this.sprite = new THREE.Sprite(this.material)
    this.sprite.scale.set(0.3, 0.3, 1)
  }

  public getMesh(): THREE.Sprite {
    return this.sprite
  }

  public flash() {
    this.material.opacity = 1
    this.isVisible = true
    this.fadeStartTime = performance.now()
  }

  public update() {
    if (!this.isVisible) return

    const elapsed = (performance.now() - this.fadeStartTime) / 1000
    if (elapsed >= this.FLASH_DURATION) {
      this.material.opacity = 0
      this.isVisible = false
    } else {
      this.material.opacity = 1 - elapsed / this.FLASH_DURATION
    }
  }
}
