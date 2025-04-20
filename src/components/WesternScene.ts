import * as THREE from 'three'
import van from 'vanjs-core'

const { div } = van.tags

export class WesternScene {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private container: HTMLDivElement
  private isDestroyed = false
  private playerPosition: THREE.Vector3
  private crosshair: HTMLDivElement
  private enemyCowboy!: THREE.Group
  private dustParticles: THREE.Points
  private mousePosition = { x: 0, y: 0 }
  private targetRotation = new THREE.Vector3()
  private keys = { a: false, d: false }
  private lastTime = 0
  private readonly MOVE_SPEED = 5.0 // Units per second

  constructor() {
    // Create scene
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0xd3b98d, 0.02) // Dusty atmosphere
    this.scene.background = new THREE.Color(0xd3b98d) // Warm desert sky

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.playerPosition = new THREE.Vector3(0, 1.7, 10) // Eye level height
    this.camera.position.copy(this.playerPosition)
    this.camera.lookAt(0, 1.7, -20)

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    // Create container
    this.container = document.createElement('div')
    this.container.style.position = 'fixed'
    this.container.style.top = '0'
    this.container.style.left = '0'
    this.container.style.width = '100%'
    this.container.style.height = '100%'
    this.container.style.zIndex = '1'
    this.container.appendChild(this.renderer.domElement)

    // Create crosshair
    this.crosshair = document.createElement('div')
    this.crosshair.style.position = 'fixed'
    this.crosshair.style.top = '50%'
    this.crosshair.style.left = '50%'
    this.crosshair.style.width = '20px'
    this.crosshair.style.height = '20px'
    this.crosshair.style.transform = 'translate(-50%, -50%)'
    this.crosshair.style.zIndex = '2'
    this.crosshair.innerHTML = '+'
    this.crosshair.style.color = 'rgba(255, 255, 255, 0.8)'
    this.crosshair.style.fontSize = '24px'
    this.crosshair.style.userSelect = 'none'
    this.crosshair.style.textShadow = '0 0 5px rgba(0,0,0,0.5)'
    this.container.appendChild(this.crosshair)

    // Create dust particles
    this.dustParticles = this.createDustParticles()
    this.scene.add(this.dustParticles)

    // Setup scene
    this.setupScene()

    // Handle window resize
    window.addEventListener('resize', this.handleResize)

    // Setup controls
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('mousemove', this.handleMouseMove)

    // Lock pointer on click
    this.container.addEventListener('click', () => {
      this.container.requestPointerLock()
    })

    // Start animation
    this.animate()
  }

  private setupScene() {
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xfff2e6, 0.4) // Warm ambient
    this.scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfff2e6, 1.5)
    sunLight.position.set(50, 100, 50)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    sunLight.shadow.camera.near = 0.5
    sunLight.shadow.camera.far = 500
    this.scene.add(sunLight)

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xb97a57,
      roughness: 0.9,
      metalness: 0.1,
    })
    // Add some random height variation to the ground
    const vertices = groundGeometry.attributes.position.array
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i + 1] = Math.random() * 0.2
    }
    groundGeometry.computeVertexNormals()

    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    // Create buildings on both sides
    this.createBuildings()

    // Create enemy cowboy
    this.enemyCowboy = this.createEnemyCowboy()
    this.enemyCowboy.position.set(0, 0, -20)
    this.scene.add(this.enemyCowboy)

    // Add player's gun
    this.addPlayerGun()
  }

  private createDustParticles(): THREE.Points {
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

  private createBuildings() {
    const buildingCount = 5
    const buildingGap = 10

    for (let i = 0; i < buildingCount; i++) {
      // Left side building
      const leftBuilding = this.createBuilding()
      leftBuilding.position.set(-7, 0, -i * buildingGap)
      this.scene.add(leftBuilding)

      // Right side building
      const rightBuilding = this.createBuilding()
      rightBuilding.position.set(7, 0, -i * buildingGap)
      this.scene.add(rightBuilding)
    }
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

  private createEnemyCowboy(): THREE.Group {
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

  private addPlayerGun() {
    const gun = new THREE.Group()

    // Barrel
    const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8)
    const barrelMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      metalness: 0.8,
      roughness: 0.2,
    })
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial)
    barrel.rotation.x = Math.PI / 2
    gun.add(barrel)

    // Handle
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1)
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a3c2b,
      roughness: 0.9,
    })
    const handle = new THREE.Mesh(handleGeometry, handleMaterial)
    handle.position.y = -0.2
    gun.add(handle)

    // Position the gun in the bottom right of the view
    gun.position.set(0.3, -0.2, -0.5)
    gun.rotation.y = -Math.PI / 12
    this.camera.add(gun)
    this.scene.add(this.camera)
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement === this.container) {
      this.mousePosition.x += e.movementX * 0.002
      this.mousePosition.y += e.movementY * 0.002

      // Clamp vertical rotation to prevent over-rotation
      this.mousePosition.y = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.mousePosition.y))

      this.targetRotation.y = -this.mousePosition.x
      this.targetRotation.x = -this.mousePosition.y
    }
  }

  private handleResize = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'a':
        this.keys.a = true
        break
      case 'd':
        this.keys.d = true
        break
    }
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'a':
        this.keys.a = false
        break
      case 'd':
        this.keys.d = false
        break
    }
  }

  private animate = () => {
    if (this.isDestroyed) return

    requestAnimationFrame(this.animate)

    // Calculate time delta
    const currentTime = performance.now()
    const deltaTime = (currentTime - this.lastTime) / 1000 // Convert to seconds
    this.lastTime = currentTime

    // Handle movement with delta time
    if (this.keys.a) {
      this.playerPosition.x -= this.MOVE_SPEED * deltaTime * Math.cos(this.targetRotation.y)
      this.playerPosition.z -= this.MOVE_SPEED * deltaTime * Math.sin(this.targetRotation.y)
    }
    if (this.keys.d) {
      this.playerPosition.x += this.MOVE_SPEED * deltaTime * Math.cos(this.targetRotation.y)
      this.playerPosition.z += this.MOVE_SPEED * deltaTime * Math.sin(this.targetRotation.y)
    }

    // Update camera position
    this.camera.position.copy(this.playerPosition)

    // Smoothly rotate camera
    this.camera.rotation.x += (this.targetRotation.x - this.camera.rotation.x) * 0.1
    this.camera.rotation.y += (this.targetRotation.y - this.camera.rotation.y) * 0.1

    // Animate dust particles with delta time
    const positions = this.dustParticles.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] += 0.5 * deltaTime // Scale dust movement with delta time too
      if (positions[i + 2] > 50) positions[i + 2] = -50
    }
    this.dustParticles.geometry.attributes.position.needsUpdate = true

    this.renderer.render(this.scene, this.camera)
  }

  public mount() {
    document.body.appendChild(this.container)
  }

  public destroy() {
    this.isDestroyed = true
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('resize', this.handleResize)
    document.exitPointerLock()
    this.container.remove()
    this.renderer.dispose()
  }
}

export const createWesternScene = () => {
  const scene = new WesternScene()
  scene.mount()
  return scene
}
