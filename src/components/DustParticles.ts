import * as THREE from 'three'

export class DustParticles {
  private particles: THREE.Points

  constructor() {
    this.particles = this.create()
  }

  private create(): THREE.Points {
    const particleCount = 1000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = Math.random() * 100 - 50
      positions[i + 1] = Math.random() * 5
      positions[i + 2] = Math.random() * 100 - 50
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xd3b98d,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    })

    return new THREE.Points(geometry, material)
  }

  public getMesh(): THREE.Points {
    return this.particles
  }

  public animate(deltaTime: number) {
    const positions = this.particles.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] += 0.5 * deltaTime
      if (positions[i + 2] > 50) positions[i + 2] = -50
    }
    this.particles.geometry.attributes.position.needsUpdate = true
  }
}
