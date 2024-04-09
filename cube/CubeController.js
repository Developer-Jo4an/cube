import { vertex } from '@/shaders/vertex/vertex'
import { fragment } from '@/shaders/fragment/fragment'

export class CubeController {
	constructor(container) {
		this.resize = this.resize.bind(this)
		this.generalAnimation = this.generalAnimation.bind(this)
		this.turnCube = this.turnCube.bind(this)
		this.listenMouseCoordinates = this.listenMouseCoordinates.bind(this)

		this.$container = container
		this.renderer = null
		this.scene = null
		this.camera = null
		this.mouse = null
		this.material = null
		this.cube = null
		this.raycaster = null
		this.direction = null
		this.rotateDistance = null
	}

	createScene() {
		this.scene = new window.THREE.Scene()
		this.scene.fog = new window.THREE.Fog('#ffffff', 0.015, 100)
	}

	createRenderer() {
		this.renderer = new window.THREE.WebGLRenderer()
		this.$container.append(this.renderer.domElement)
	}

	createCamera() {
		this.camera = new window.THREE.PerspectiveCamera(
			75,
			this.$container.offsetWidth / this.$container.height,
			0.1,
			2000
		)
		this.camera.position.z = 5
	}

	createCube() {
		const geometry = new window.THREE.BoxGeometry(1, 1, 1)
		this.material = new window.THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0.0 },
				resolution: { value: new window.THREE.Vector2() }
			},
			vertexShader: vertex,
			fragmentShader: fragment
		})
		this.cube = new window.THREE.Mesh(geometry, this.material)
		this.scene.add(this.cube)
	}


	createMouse() {
		this.mouse = new window.THREE.Vector2()
	}

	createRaycaster() {
		this.raycaster = new window.THREE.Raycaster()
	}

	listenMouseCoordinates(e) {
		this.mouse.x = (e.clientX / this.container.offsetWidth) * 2 - 1
		this.mouse.y = -(e.clientY / this.container.offsetHeight) * 2 + 1
	}

	turnCube() {
		this.raycaster.setFromCamera(this.mouse, this.camera)

		const isIntersect = this.raycaster.intersectObject(this.cube).length

		if (!isIntersect) return

		this.direction = ['x', 'y', 'z'][Math.floor(Math.random() * 3)]
		this.rotateDistance = Math.random() * Math.PI * 2
		this.turnCubeAnimation()
	}

	turnCubeAnimation() {
		if (this.rotateDistance > 0) {
			this.cube.rotation[this.direction] += 0.01
			this.rotateDistance -= 0.01
			requestAnimationFrame(this.turnCubeAnimation.bind(this))
			return
		}

		this.direction = null
		this.rotateDistance = null
		cancelAnimationFrame(this.turnCubeAnimation.bind(this))
	}

	resize() {
		const width = this.container.offsetWidth
		const height = this.container.offsetHeight

		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()

		this.renderer.setSize(width, height)
	}

	generalAnimation(time) {
		this.material.uniforms.time.value = time * 0.001

		this.renderer.render(this.scene, this.camera)
		requestAnimationFrame(this.generalAnimation)
	}

	mounting() {
		this.createScene()
		this.createRenderer()
		this.createCamera()
		this.createCube()
		this.createMouse()
		this.createRaycaster()
		this.resize()
		requestAnimationFrame(this.generalAnimation)
	}

	dismantle() {
		while (this.scene.children.length)
			this.scene.remove(this.scene.children[0])
		cancelAnimationFrame(this.generalAnimation)
		this.renderer.dispose()
		delete window.THREE
	}

	activate() {
		this.mounting()
		window.addEventListener('click', this.turnCube)
		window.addEventListener('pointermove', this.listenMouseCoordinates)
		window.addEventListener('resize', this.resize)
	}

	deactivate() {
		this.dismantle()
		window.removeEventListener('click', this.turnCube)
		window.removeEventListener('pointermove', this.listenMouseCoordinates)
		window.removeEventListener('resize', this.resize)
	}
}