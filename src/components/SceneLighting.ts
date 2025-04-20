import * as THREE from 'three'

export class SceneLighting {
  private ambientLight: THREE.AmbientLight
  private sunLight: THREE.DirectionalLight

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
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

    // Add camera-attached lights for the gun model
    const gunLight = new THREE.DirectionalLight(0xffffff, 1.0)
    gunLight.position.set(1, 1, 1)
    camera.add(gunLight)

    const gunPointLight = new THREE.PointLight(0xffffff, 0.5)
    gunPointLight.position.set(0, 0.5, -1)
    camera.add(gunPointLight)

    // Make sure the camera is added to the scene after adding lights
    scene.add(camera)
  }
}
