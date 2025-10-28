'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

const renderRobot = (el: HTMLDivElement | null, onLoaded: () => void) => {
  try {
    if (!el) throw new Error('Canvas element not found.')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0.75, 1.25)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    el.appendChild(renderer.domElement)

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      camera.position.set(0, 0.75, 1.25)
    }

    window.addEventListener('resize', handleResize)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 10, 7.5)
    scene.add(light)

    const mouse = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    })

    const loader = new GLTFLoader()
    let mixer: THREE.AnimationMixer | null = null
    let faceMesh: THREE.Object3D | null | undefined = null
    let headMesh: THREE.Object3D | null | undefined = null

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    loader.load(
      '/glb/robot.glb',
      gltf => {
        const model = gltf.scene
        scene.add(model)

        faceMesh = scene.getObjectByName('Cylinder002_1')
        headMesh = scene.getObjectByName('Cylinder002')

        if (!isSafari) {
          const video = document.createElement('video')
          video.src = '/textures/face_safari.mp4'
          video.loop = true
          video.muted = true
          video.playsInline = true
          video.crossOrigin = 'anonymous'

          video.addEventListener('loadeddata', () => {
            video.play().catch(() => {})
          })        

          const videoTexture = new THREE.VideoTexture(video)
          videoTexture.colorSpace = THREE.SRGBColorSpace
          videoTexture.minFilter = THREE.LinearFilter
          videoTexture.magFilter = THREE.LinearFilter
          videoTexture.format = THREE.RGBAFormat

          if (faceMesh && 'material' in faceMesh) {
            ; (faceMesh as any).material = new THREE.MeshBasicMaterial({
              map: videoTexture,
              transparent: true
            })
          }
        }


        mixer = new THREE.AnimationMixer(model)
        gltf.animations.forEach(clip => {
          mixer!.clipAction(clip).play()
        })

        onLoaded()
      },
      undefined,
      console.error
    )

    const clock = new THREE.Clock()
    const lookTarget = new THREE.Vector3()

    const animate = () => {
      requestAnimationFrame(animate)
      const delta = clock.getDelta()
      if (mixer) mixer.update(delta)

      if (faceMesh && headMesh) {
        raycaster.setFromCamera(mouse, camera)
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.75)
        raycaster.ray.intersectPlane(planeZ, lookTarget)

        const currentFaceRotation = faceMesh.quaternion.clone()
        faceMesh.lookAt(lookTarget)
        faceMesh.quaternion.slerp(currentFaceRotation, 0.9)

        const currentHeadRotation = headMesh.quaternion.clone()
        headMesh.lookAt(lookTarget)
        headMesh.quaternion.slerp(currentHeadRotation, 0.9)
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  } catch (err) {
    console.error(err)
  }
}

const Robot = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cleanup: (() => void) | undefined
  
    if (containerRef.current) {
      cleanup = renderRobot(containerRef.current, () => setLoaded(true))
    }
  
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <motion.div
      className="z-50 inset-0 w-screen h-screen flex items-center justify-center"
      initial={{ opacity: 0, y: 40 }}
      animate={loaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </motion.div>
  )
}

export default Robot
