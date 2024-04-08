'use client'
import { useEffect, useRef } from 'react'

const Home = () => {
    const containerRef = useRef()

    useEffect(() => {
        let controller = null

        ;(async () => {
		    window.THREE = await import('three')
            const { CubeController } = await import('@/cube/CubeController')

		    controller = new CubeController(containerRef.current)
		    controller.activate()
        })()

        return () => controller.deactivate()
    }, [])

    return (
        <div className={ 'cube' } ref={ containerRef }></div>
    )
}

export default Home
