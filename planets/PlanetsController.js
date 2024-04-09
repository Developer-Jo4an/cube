export class PlanetsController {
    scene
    renderer
    camera
    controls
    geometry = new THREE.SphereGeometry(0.5, 16, 16)
    solarSystem
    earthOrbit
    moonOrbit
    sun
    earth
    moon
    objects = []

    constructor(container) {
        this.generalAnimation = this.generalAnimation.bind(this)
        this.resize = this.resize.bind(this)

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
            this.$container.offsetWidth /  this.$container.offsetHeight,
            0.1,
            2000
        )
        this.camera.position.z = 10
    }

    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target.set(0, 0, 0)
    }

    createSolarSystem() {
        this.solarSystem = new THREE.Object3D()
        this.scene.add(this.solarSystem)
        this.objects.push(this.solarSystem)
    }

    createEarthOrbit() {
        this.earthOrbit = new THREE.Object3D()
        this.earthOrbit.position.x = -5
        this.solarSystem.add(this.earthOrbit)
        this.objects.push(this.earthOrbit)
    }

    createMoonOrbit() {
        this.moonOrbit = new THREE.Object3D()
        this.moonOrbit.position.x = -2.5
        this.earthOrbit.add(this.moonOrbit)
        this.objects.push(this.moonOrbit)
    }

    createSun() {
        const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true })
        this.sun = new THREE.Mesh(this.geometry, material)
        this.sun.scale.set(3, 3, 3)
        this.objects.push(this.sun)
        this.solarSystem.add(this.sun)
    }

    createEarth() {
        const material = new THREE.MeshBasicMaterial({ color: 'blue', wireframe: true })
        this.earth = new THREE.Mesh(this.geometry, material)
        this.earth.scale.set(2, 2, 2)
        this.objects.push(this.earth)
        this.earthOrbit.add(this.earth)
    }

    createMoon() {
        const material = new THREE.MeshBasicMaterial({ color: 'gray', wireframe: true })
        this.moon = new THREE.Mesh(this.geometry, material)
        this.objects.push(this.moon)
        this.moonOrbit.add(this.moon)
    }

    generalAnimation() {
        this.objects.forEach(orbit => orbit.rotation.y += 0.01)
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

    mounting() {
        this.createScene()
        this.createRenderer()
        this.createCamera()
        this.createControls()
        this.createSolarSystem()
        this.createEarthOrbit()
        this.createMoonOrbit()
        this.createSun()
        this.createEarth()
        this.createMoon()
        this.resize()
        requestAnimationFrame(this.generalAnimation)
    }

    dismantle() {
        while (this.scene.children.length)
            this.scene.remove(this.scene.children[0])
        this.renderer.dispose()
        cancelAnimationFrame(this.generalAnimation)
        delete THREE
        delete OrbitControls
    }

    activate() {
        this.mounting()
        window.addEventListener('resize', this.resize)
    }

    deactivate() {
        this.dismantle()
        window.removeEventListener('resize', this.resize)
    }
}