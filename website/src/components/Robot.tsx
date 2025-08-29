'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

// Renders the robot model
const renderRobot = (el: HTMLDivElement | null) => {
  try {
    // canvas context
    if (!el) throw new Error('Canvas element not found.')

    // three.js setup
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0.75, 1.25)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    el.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 10, 7.5)
    scene.add(light)

    // mouse tracking
    const mouse = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()

    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    })

    // load gltf
    const loader = new GLTFLoader()
    let mixer: any
    let faceMesh: any // the head
    let headMesh: any

    loader.load('/glb/robot.glb', gltf => {
      const model = gltf.scene
      scene.add(model)

      // face
      faceMesh = scene.getObjectByName('Cylinder002_1') as any
      if (!faceMesh) return console.error('Face mesh not found.')

      // head
      headMesh = scene.getObjectByName('Cylinder002') as any
      if (!headMesh) return console.error('Head mesh not found.')

      // animated face texture
      const video = document.createElement('video')
      video.src = '/textures/face.mp4'
      video.loop = true
      video.muted = true
      video.play()

      const videoTexture = new THREE.VideoTexture(video)
      videoTexture.minFilter = THREE.LinearFilter
      videoTexture.magFilter = THREE.LinearFilter
      videoTexture.format = THREE.RGBAFormat

      faceMesh.material = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true })

      mixer = new THREE.AnimationMixer(model)
      gltf.animations.forEach(clip => {
        mixer.clipAction(clip).play()
      })
    }, undefined, console.error)

    // animate
    const clock = new THREE.Clock()
    const lookTarget = new THREE.Vector3()

    const animate = () => {
      requestAnimationFrame(animate)

      const delta = clock.getDelta()
      if (mixer) mixer.update(delta)

      if (faceMesh && headMesh) {
        // cast ray from camera to mouse
        raycaster.setFromCamera(mouse, camera)

        // intersect with an invisible plane in front of the robot
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.75)
        raycaster.ray.intersectPlane(planeZ, lookTarget)

        // face rotation
        const currentFaceRotation = faceMesh.quaternion.clone()
        faceMesh.lookAt(lookTarget)
        faceMesh.quaternion.slerp(currentFaceRotation, 0.9)

        // head rotation
        const currentHeadRotation = faceMesh.quaternion.clone()
        headMesh.lookAt(lookTarget)
        headMesh.quaternion.slerp(currentHeadRotation, 0.9)
      }

      renderer.render(scene, camera)
    }

    animate()
  } catch (err) {
    console.error(err)
  }
}

const Robot = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      renderRobot(containerRef.current)
    }
  }, [])

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}

export default Robot