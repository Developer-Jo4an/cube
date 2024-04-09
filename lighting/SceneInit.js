import { CREATE_CUBE } from '@/lighting/constants'
import { CubeController } from '@/lighting/CubeController'

export class SceneInit {
    scene
    renderer
    camera
    controls

    constructor(container) {
        this.generalAnimation = this.generalAnimation.bind(this)
        this.resize = this.resize.bind(this)
        this.createCube = this.createCube.bind(this)

        this.$container = container
    }

    createScene() {
        this.scene = new THREE.Scene()
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer()
        this.$container.append(this.renderer.domElement)
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.$container.offsetWidth / this.$container.offsetHeight,
            0.1,
            2000
        )
        this.camera.position.set(0, 0, 20)
    }

    createHelpers() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target.set(0, 0, 0)

        const axisHelper = new THREE.AxesHelper(100)
        this.scene.add(axisHelper)
    }

    generalAnimation() {
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.generalAnimation)
    }

    resize() {
        const width = this.$container.offsetWidth
        const height = this.$container.offsetHeight

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(width, height)
    }

    createFloor() {
        const size = 20
        const geometry = new THREE.PlaneGeometry(size, size)

        const loader = new THREE.TextureLoader()
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png')
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        texture.repeat.set(size, size)

        const material = new THREE.MeshPhongMaterial({ map: texture })
        const floor = new THREE.Mesh(geometry, material)
        this.scene.add(floor)
    }

    createLight() {
        const light = new THREE.DirectionalLight('#ffffff', 5)
        light.position.set(10, 10, 10)
        light.target.position.set(0, 0, 0)
        this.scene.add(light)
        this.scene.add(light.target)
    }

    createCube() { new CubeController(this.scene) }

    mounting() {
        this.createScene()
        this.createRenderer()
        this.createCamera()
        this.createHelpers()
        this.createFloor()
        this.createLight()
        this.resize()
        requestAnimationFrame(this.generalAnimation)
    }

    dismantle() {
        while (this.scene.children.length)
            this.scene.remove(this.scene.children[0])
        this.renderer.dispose()
        delete window.THREE
        delete window.OrbitControls
        cancelAnimationFrame(this.generalAnimation)
    }

    activate() {
        this.mounting()
        window.addEventListener('resize', this.resize)
        window.addEventListener(CREATE_CUBE, this.createCube)
    }

    deactivate() {
        this.dismantle()
        window.removeEventListener('resize', this.resize)
        window.addEventListener(CREATE_CUBE, this.createCube)
    }
}