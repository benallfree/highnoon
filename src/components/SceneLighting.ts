import * as THREE from 'three'

export class SceneLighting {
  private ambientLight: THREE.AmbientLight
  private sunLight: THREE.DirectionalLight

  constructor(scene: THREE.Scene) {
    // Add warm ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xfff2e6, 0.4)
    scene.add(this.ambientLight)

    // Add directional sunlight with shadows
    this.sunLight = new THREE.DirectionalLight(0xfff2e6, 1.5)
    this.sunLight.position.set(50, 100, 50)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.width = 2048
    this.sunLight.shadow.mapSize.height = 2048
    this.sunLight.shadow.camera.near = 0.5
    this.sunLight.shadow.camera.far = 500
    scene.add(this.sunLight)
  }
}
