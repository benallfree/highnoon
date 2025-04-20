import * as THREE from 'three'
import van from 'vanjs-core'

const { div } = van.tags

export class Cowboy3D {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private cowboy: THREE.Group
  private container: HTMLDivElement
  private isDestroyed = false
  private onHit?: () => void

  constructor(onHit?: () => void) {
    this.onHit = onHit

    // Create scene
    this.scene = new THREE.Scene()

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    this.camera.position.z = 5

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.renderer.setSize(200, 200)
    this.renderer.setClearColor(0x000000, 0)

    // Create container
    this.container = document.createElement('div')
    this.container.style.position = 'fixed'
    this.container.style.width = '200px'
    this.container.style.height = '200px'
    this.container.style.zIndex = '10000'
    this.container.appendChild(this.renderer.domElement)

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 2)
    light.position.set(1, 1, 2)
    this.scene.add(light)

    // Create cowboy
    this.cowboy = this.createCowboy()
    this.scene.add(this.cowboy)

    // Start animation
    this.animate()
  }

  private createCowboy(): THREE.Group {
    const group = new THREE.Group()

    // Hat
    const hatBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32),
      new THREE.MeshLambertMaterial({ color: 0x4a3c2b })
    )
    hatBrim.position.y = 1.2
    group.add(hatBrim)

    const hatTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32),
      new THREE.MeshLambertMaterial({ color: 0x4a3c2b })
    )
    hatTop.position.y = 1.5
    group.add(hatTop)

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshLambertMaterial({ color: 0xe6b89c })
    )
    head.position.y = 0.8
    group.add(head)

    // Body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.4, 1.2, 32),
      new THREE.MeshLambertMaterial({ color: 0x2b2b2b })
    )
    group.add(body)

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 32)
    const armMaterial = new THREE.MeshLambertMaterial({ color: 0x2b2b2b })

    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-0.6, 0.2, 0)
    leftArm.rotation.z = Math.PI / 4
    group.add(leftArm)

    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(0.6, 0.2, 0)
    rightArm.rotation.z = -Math.PI / 4
    group.add(rightArm)

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 32)
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x4a3c2b })

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
    leftLeg.position.set(-0.3, -1.1, 0)
    group.add(leftLeg)

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
    rightLeg.position.set(0.3, -1.1, 0)
    group.add(rightLeg)

    // Adjust the initial rotation to face forward
    group.rotation.y = Math.PI
    return group
  }

  private animate = () => {
    if (this.isDestroyed) return

    requestAnimationFrame(this.animate)

    // Rotate cowboy slightly
    this.cowboy.rotation.y += 0.01

    this.renderer.render(this.scene, this.camera)
  }

  public mount(x: number, y: number) {
    this.container.style.left = `${x - 100}px`
    this.container.style.top = `${y - 100}px`
    document.body.appendChild(this.container)
  }

  public checkHit(x: number, y: number): boolean {
    const rect = this.container.getBoundingClientRect()
    const hit = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

    if (hit && this.onHit) {
      this.onHit()
    }

    return hit
  }

  public destroy() {
    this.isDestroyed = true
    this.container.remove()
    this.renderer.dispose()
  }
}

export const createRandomCowboy = (onHit?: () => void) => {
  const cowboy = new Cowboy3D(onHit)

  // Random position within viewport, but keep away from edges
  const margin = 200
  const x = Math.random() * (window.innerWidth - 2 * margin) + margin
  const y = Math.random() * (window.innerHeight - 2 * margin) + margin

  cowboy.mount(x, y)
  return cowboy
}
