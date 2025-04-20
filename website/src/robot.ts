import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const renderRobot = () => {
    const containerSel = '.graphic__wrapper'

    try {
        // DOM
        const container = document.querySelector( containerSel ) as HTMLCanvasElement
        if ( !container ) throw new Error( 'Container not found.' )

        // scene
        const scene = new THREE.Scene()
    
        // camera
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
        camera.position.set( 0, 0.75, 1.25 )
    
        // renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize( window.innerWidth, window.innerHeight )
        container.appendChild( renderer.domElement )
  
        // light
        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 )
        scene.add( ambientLight )
    
        const light = new THREE.DirectionalLight( 0xffffff, 1 )
        light.position.set( 5, 10, 7.5 )
        scene.add( light )
    
        // mouse tracking
        const mouse = new THREE.Vector2()
        const raycaster = new THREE.Raycaster()
    
        window.addEventListener('mousemove', e => {
            mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1
            mouse.y = -( e.clientY / window.innerHeight ) * 2 + 1
        })
  
        // load gltf
        const loader = new GLTFLoader()
        let mixer: any
        let faceMesh: any // the head
        let headMesh: any
  
        loader.load('/static/glb/robot.glb', gltf => {
            const model = gltf.scene
            scene.add( model )
    
            // face
            faceMesh = scene.getObjectByName( 'Cylinder002_1' ) as any
            if ( !faceMesh ) return console.error( 'Face mesh not found.' )

            // head
            headMesh = scene.getObjectByName('Cylinder002') as any
            if ( !headMesh ) return console.error( 'Head mesh not found.' )
    
            // animated face texture
            const video = document.createElement( 'video' )
            video.src = '/static/textures/face.mp4'
            video.loop = true
            video.muted = true
            video.play()
    
            const videoTexture = new THREE.VideoTexture( video )
            videoTexture.minFilter = THREE.LinearFilter
            videoTexture.magFilter = THREE.LinearFilter
            videoTexture.format = THREE.RGBAFormat
    
            faceMesh.material = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true })
    
            mixer = new THREE.AnimationMixer( model )
            gltf.animations.forEach(clip => {
                mixer.clipAction( clip ).play()
            })
        }, undefined, console.error )
  
        // animate
        const clock = new THREE.Clock()
        const lookTarget = new THREE.Vector3()

        const animate = () => {
            requestAnimationFrame(animate)

            const delta = clock.getDelta()
            if ( mixer ) mixer.update( delta )

            if ( faceMesh && headMesh ) {
                // cast ray from camera to mouse
                raycaster.setFromCamera( mouse, camera )

                // intersect with an invisible plane in front of the robot
                const planeZ = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), -0.75 )
                raycaster.ray.intersectPlane( planeZ, lookTarget )

                // face rotation
                const currentFaceRotation = faceMesh.quaternion.clone()
                faceMesh.lookAt( lookTarget )
                faceMesh.quaternion.slerp( currentFaceRotation, 0.9 )

                // head rotation
                const currentHeadRotation = faceMesh.quaternion.clone()
                headMesh.lookAt( lookTarget )
                headMesh.quaternion.slerp( currentHeadRotation, 0.9 )
            }

            renderer.render( scene, camera )
        }
  
        animate()
    } catch ( err ) {
        console.error( err )
    }
}

export { renderRobot }