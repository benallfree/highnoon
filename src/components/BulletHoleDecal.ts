import * as THREE from 'three'

export class BulletHoleDecal {
  private decalMaterial: THREE.MeshPhongMaterial
  private decalGeometry: THREE.PlaneGeometry
  private readonly DECAL_SIZE = 0.2

  constructor() {
    // Create a canvas for the bullet hole texture
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')!

    // Create radial gradient for the bullet hole
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
    gradient.addColorStop(0.7, 'rgba(40, 40, 40, 0.8)')
    gradient.addColorStop(1, 'rgba(60, 60, 60, 0)')

    // Draw gradient
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)

    // Create decal material
    const texture = new THREE.CanvasTexture(canvas)
    this.decalMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      side: THREE.DoubleSide,
    })

    // Create decal geometry
    this.decalGeometry = new THREE.PlaneGeometry(this.DECAL_SIZE, this.DECAL_SIZE)
  }

  public createDecal(position: THREE.Vector3, normal: THREE.Vector3): THREE.Mesh {
    const decal = new THREE.Mesh(this.decalGeometry, this.decalMaterial)

    // Position the decal slightly in front of the hit point
    decal.position.copy(position).addScaledVector(normal, 0.01)

    // Orient the decal to face the normal direction
    decal.lookAt(position.clone().add(normal))

    // Add random rotation around the normal axis
    decal.rotateZ(Math.random() * Math.PI * 2)

    return decal
  }
}
