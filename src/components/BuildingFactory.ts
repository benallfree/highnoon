import * as THREE from 'three'

export class BuildingFactory {
  public createBuildings(): THREE.Group[] {
    const buildings: THREE.Group[] = []
    const buildingCount = 5
    const buildingGap = 10

    for (let i = 0; i < buildingCount; i++) {
      // Left side building
      const leftBuilding = this.createBuilding()
      leftBuilding.position.set(-7, 0, -i * buildingGap)
      buildings.push(leftBuilding)

      // Right side building
      const rightBuilding = this.createBuilding()
      rightBuilding.position.set(7, 0, -i * buildingGap)
      buildings.push(rightBuilding)
    }

    return buildings
  }

  private createBuilding(): THREE.Group {
    const building = new THREE.Group()

    // Main structure
    const buildingGeometry = new THREE.BoxGeometry(5, 6, 8)
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.9,
      metalness: 0.1,
    })
    const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial)
    buildingMesh.position.y = 3
    buildingMesh.castShadow = true
    buildingMesh.receiveShadow = true
    building.add(buildingMesh)

    // Roof
    const roofGeometry = new THREE.ConeGeometry(4, 2, 4)
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      roughness: 0.8,
      metalness: 0.2,
    })
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.y = 7
    roof.castShadow = true
    building.add(roof)

    // Add windows and doors
    const doorGeometry = new THREE.PlaneGeometry(1, 2)
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x2b1810 })
    const door = new THREE.Mesh(doorGeometry, doorMaterial)
    door.position.set(0, 1, 4.01)
    building.add(door)

    const windowGeometry = new THREE.PlaneGeometry(1, 1)
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
    })

    // Front windows
    const frontWindow1 = new THREE.Mesh(windowGeometry, windowMaterial)
    frontWindow1.position.set(-1.5, 3, 4.01)
    building.add(frontWindow1)

    const frontWindow2 = new THREE.Mesh(windowGeometry, windowMaterial)
    frontWindow2.position.set(1.5, 3, 4.01)
    building.add(frontWindow2)

    return building
  }
}
