'use client'
import { useEffect, useRef } from 'react'

const Home = () => {
    const containerRef = useRef()

    useEffect(() => {
        let scene = null
        let camera = null
        let renderer = null
        let cubeControl = null
        let animationFrameId = null

        ;(async () => {
            const Three = await import('three')
            const { CubeController } = await import('@/cube/CubeController')

            const width = containerRef.current.offsetWidth
            const height = containerRef.current.offsetHeight

            scene = new Three.Scene()
            scene.fog = new Three.Fog('#ffffff', 0.015, 100)

            camera = new Three.PerspectiveCamera(75, width / height, 0.1, 2000)
            camera.position.z = 5

            const geometry = new Three.BoxGeometry(1, 1, 1)
            const material = new Three.ShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    resolution: { value: new Three.Vector2() }
                },
                vertexShader: `
                    varying vec3 vUv; 
                
                    void main() {
                      vUv = position; 
                
                      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                      gl_Position = projectionMatrix * modelViewPosition; 
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    varying vec3 vUv;
                
                    void main() {
                        gl_FragColor = vec4(vUv + cos(time) * 0.5 + 0.5, 1.0); 
                    }
                `
            })
            const cube = new Three.Mesh(geometry, material)
            scene.add(cube)

            cubeControl = new CubeController(cube, camera, containerRef.current, Three)
            cubeControl.activate()

            renderer = new Three.WebGLRenderer()
            renderer.setSize(width, height)
            containerRef.current.append(renderer.domElement)

            const generalAnimation = time => {
                time *= 0.001

                material.uniforms.time.value = time

                renderer.render(scene, camera)
                animationFrameId = requestAnimationFrame(generalAnimation)
            }; generalAnimation()

            window.addEventListener('resize', () => {
                const width = +containerRef.current.offsetWidth
                const height = +containerRef.current.offsetHeight

                camera.aspect = width / height
                camera.updateProjectionMatrix()

                renderer.setSize(width, height)
            })
        })()

        return () => {
            if (scene) {
                while (scene.children.length) scene.remove(scene.children[0])
                scene = null
            }
            if (animationFrameId) cancelAnimationFrame(animationFrameId)
            if (cubeControl) cubeControl.deactivate()
            if (renderer) renderer.dispose()
            if (camera) camera = null
        }
    }, [])

    return (
        <div className={ 'cube' } ref={ containerRef }>

        </div>
    )
}

export default Home
