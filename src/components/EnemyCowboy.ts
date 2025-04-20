import * as THREE from 'three'

export class EnemyCowboy {
  private group: THREE.Group

  constructor() {
    this.group = this.create()
  }

  private create(): THREE.Group {
    const cowboy = new THREE.Group()

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.9,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 1
    body.castShadow = true
    cowboy.add(body)

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 8, 8)
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xffe0bd,
      roughness: 0.5,
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 2.3
    head.castShadow = true
    cowboy.add(head)

    // Hat
    const hatGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8)
    const hatMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a3c2b,
      roughness: 0.9,
    })
    const hat = new THREE.Mesh(hatGeometry, hatMaterial)
    hat.position.y = 2.6
    hat.castShadow = true
    cowboy.add(hat)

    return cowboy
  }

  public getMesh(): THREE.Group {
    return this.group
  }
}
