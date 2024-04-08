export class CubeController {
    constructor(cube, camera, container, Three) {
        this.turnCube = this.turnCube.bind(this)
        this.listenMouseCoordinates = this.listenMouseCoordinates.bind(this)

        this.cube = cube
        this.camera = camera
        this.container = container
        this.mouse = new Three.Vector2()
        this.raycaster = new Three.Raycaster()
        this.direction = null
        this.rotateDistance = null
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

    activate() {
        window.addEventListener('click', this.turnCube)
        window.addEventListener('pointermove', this.listenMouseCoordinates)
    }

    deactivate() {
        window.removeEventListener('click', this.turnCube)
        window.removeEventListener('pointermove', this.listenMouseCoordinates)
    }
}