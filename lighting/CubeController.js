const UP = 'UP'
const LEFT = 'LEFT'
const RIGHT = 'RIGHT'
const BOTTOM = 'BOTTOM'

export class CubeController {
    actions = {
        [UP]: {
            key: 87,
            isActive: false,
            moveCallback: () => this.cube.position.y += 0.05
        },
        [LEFT]: {
            key: 65,
            isActive: false,
            moveCallback: () => this.cube.position.x -= 0.05
        },
        [RIGHT]: {
            key: 68,
            isActive: false,
            moveCallback: () => this.cube.position.x += 0.05
        },
        [BOTTOM]: {
            key: 83,
            isActive: false,
            moveCallback: () => this.cube.position.y -= 0.05
        }
    }

    collusion = {
        [UP]: () => this.cube.position.y < 9.5,
        [LEFT]: () => this.cube.position.x > -9.5,
        [RIGHT]: () => this.cube.position.x < 9.5,
        [BOTTOM]: () => this.cube.position.y > -9.5
    }

    constructor(scene) {
        this.moveCube = this.moveCube.bind(this)
        this.moveCubeAnimation = this.moveCubeAnimation.bind(this)

        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshPhongMaterial({ color: 'red' })
        this.cube = new THREE.Mesh(geometry, material)
        this.cube.position.z += 0.5
        scene.add(this.cube)

        this.activateCube()
    }

    moveCubeAnimation() {
        const activeActions = Object.entries(this.actions).reduce((arr, action) =>
            action[1].isActive ?
                [...arr, action[0]]
                :
                arr
        , [])

        activeActions.forEach(actionName => {
            if (this.collusion[actionName]()){
                this.actions[actionName].moveCallback()
            }
        })

        requestAnimationFrame(this.moveCubeAnimation)
    }

    moveCube(e) {
        const { keyCode } = e

        const currentActionName = Object.entries(this.actions).find(act => act[1].key === keyCode)?.[0]

        if (!currentActionName) return

        this.actions[currentActionName].isActive = e.type === 'keydown'
    }

    activateCube() {
        window.addEventListener('keydown', this.moveCube)
        window.addEventListener('keyup', this.moveCube)
        requestAnimationFrame(this.moveCubeAnimation)
    }
}