'use client'
import { useEffect, useRef } from 'react'
import { SceneInit } from '@/lighting/SceneInit'
import { CREATE_CUBE } from '@/lighting/constants'

const addCube = () => {
    const customEvent = new CustomEvent(CREATE_CUBE)
    window.dispatchEvent(customEvent)
}

const Home = () => {
    const containerRef = useRef()

    useEffect(() => {
        let controller = null

        ;(async () => {
            window.THREE = await import('three')
            window.OrbitControls = (await import('three/addons')).OrbitControls

            const { SceneInit } = await import('@/lighting/SceneInit')
            controller = new SceneInit(containerRef.current)
            controller.activate()
        })()

        return () => {
            if (controller) {
                controller.deactivate()
            }
        }
    }, [])

    return (
        <div className={ 'cube' } ref={ containerRef }>
            <button
                className={ 'cube__button' }
                onClick={ addCube }
            >Add CUBE
            </button>
        </div>
    )
}

export default Home
