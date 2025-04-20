import * as THREE from 'three'
import van, { State } from 'vanjs-core'
import { Gun, guns } from '../gun'
import { AudioManager } from './AudioManager'
import { BuildingFactory } from './BuildingFactory'
import { DebugPanel } from './DebugPanel'
import { DustParticles } from './DustParticles'
import { GunController } from './GunController'
import { PlayerController } from './PlayerController'
import { ReloadButton } from './ReloadButton'
import { RevolverCylinder } from './RevolverCylinder'
import { SceneLighting } from './SceneLighting'

const { div } = van.tags

const Crosshair = () =>
  div(
    {
      style: `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      transform: translate(-50%, -50%);
      z-index: 2;
      color: rgba(255, 255, 255, 0.8);
      font-size: 24px;
      user-select: none;
      text-shadow: 0 0 5px rgba(0,0,0,0.5);
      `,
    },
    '+'
  )

const GameContainer = (props: { renderer: THREE.WebGLRenderer; children: any }) =>
  div(
    {
      style: `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    `,
    },
    props.renderer.domElement,
    props.children
  )

const GameHUD = (props: {
  isDebugVisible: State<boolean>
  sessionGun: Gun
  remainingShots: State<number>
  cylinderRotation: State<number>
  mousePosition: State<{ x: number; y: number }>
  onReload: () => void
}) => {
  return div(
    {
      style: `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
      `,
    },
    div(
      { style: 'pointer-events: auto; position: fixed; top: 0; left: 0;' },
      DebugPanel(props.isDebugVisible, props.sessionGun, props.remainingShots, props.mousePosition)
    ),
    div(
      { style: 'pointer-events: auto; position: fixed; top: 20px; right: 20px;' },
      RevolverCylinder(props.remainingShots, props.cylinderRotation)
    ),
    div(
      { style: 'pointer-events: auto; position: fixed; top: 140px; right: 20px;' },
      ReloadButton(props.remainingShots, props.sessionGun, props.onReload)
    )
  )
}

export class WesternScene {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private container: HTMLDivElement
  private isDestroyed = false
  private playerPosition: THREE.Vector3
  private enemyCowboy!: THREE.Group
  private dustParticles: DustParticles
  private lastTime = 0
  private audioManager = new AudioManager()
  private playerController: PlayerController
  private gunController: GunController

  // HUD state
  private sessionGun: Gun
  private remainingShots = van.state(6)
  private cylinderRotation = van.state(0)
  private mousePosition = van.state({ x: 0, y: 0 })
  private isDebugVisible = van.state(false)

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

    // Create dust particles
    this.dustParticles = new DustParticles()
    this.scene.add(this.dustParticles.getMesh())

    // Initialize gun
    this.sessionGun = guns.remington1858
    this.remainingShots.val = this.sessionGun.capacity

    // Initialize gun controller
    this.gunController = new GunController(
      this.sessionGun,
      this.remainingShots,
      this.cylinderRotation,
      this.audioManager,
      this.camera
    )

    // Mount game container and UI
    const gameUI = GameContainer({
      renderer: this.renderer,
      children: [
        Crosshair(),
        GameHUD({
          isDebugVisible: this.isDebugVisible,
          sessionGun: this.sessionGun,
          remainingShots: this.remainingShots,
          cylinderRotation: this.cylinderRotation,
          mousePosition: this.mousePosition,
          onReload: () => this.gunController.reload(),
        }),
      ],
    })

    this.container = gameUI as HTMLDivElement
    document.body.appendChild(this.container)

    // Setup scene
    this.setupScene()

    // Handle window resize
    window.addEventListener('resize', this.handleResize)

    // Initialize player controller
    this.playerController = new PlayerController(
      this.playerPosition,
      this.camera,
      this.container,
      this.mousePosition,
      () => this.gunController.shoot(),
      () => this.gunController.reload()
    )

    // Setup controls
    this.container.addEventListener('click', () => {
      this.container.requestPointerLock()
    })

    // Add mouse down handler for shooting
    this.container.addEventListener('mousedown', () => this.gunController.shoot())

    // Start animation
    this.animate()
  }

  private setupScene() {
    // Add lighting
    new SceneLighting(this.scene)

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
    const buildingFactory = new BuildingFactory()
    const buildings = buildingFactory.createBuildings()
    buildings.forEach((building) => this.scene.add(building))

    // Create enemy cowboy
    this.enemyCowboy = this.createEnemyCowboy()
    this.enemyCowboy.position.set(0, 0, -20)
    this.scene.add(this.enemyCowboy)
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

  private handleResize = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  private animate = () => {
    if (this.isDestroyed) return

    requestAnimationFrame(this.animate)

    // Calculate time delta
    const currentTime = performance.now()
    const deltaTime = (currentTime - this.lastTime) / 1000 // Convert to seconds
    this.lastTime = currentTime

    // Update player controller
    this.playerController.update(deltaTime)

    // Animate dust particles
    this.dustParticles.animate(deltaTime)

    this.renderer.render(this.scene, this.camera)
  }

  public destroy() {
    this.isDestroyed = true
    this.container.removeEventListener('mousedown', () => this.gunController.shoot())
    window.removeEventListener('resize', this.handleResize)
    this.playerController.destroy()
    document.exitPointerLock()
    this.container.remove()
    this.renderer.dispose()
  }
}

export const createWesternScene = () => {
  const scene = new WesternScene()
  return scene
}
