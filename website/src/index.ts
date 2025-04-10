import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Loader } from './taffy/router'
import { setTitle } from './taffy/meta'
import { VERTEX_SHADER, FRAGMENT_SHADER } from './shaders'
import { compileShader, createProgram } from './utils'


const renderBackground = () => {
    try {
        // canvas
        const canvas = document.querySelector( '.background > canvas' ) as HTMLCanvasElement
        if ( !canvas ) throw new Error( 'Canvas not found.' )

        // gl
        const gl = canvas.getContext( 'webgl', { alpha: true })
        if ( !gl ) throw new Error( 'WebGL not supported.' )

        // compile program
        const vertexShader = compileShader( gl, VERTEX_SHADER, gl.VERTEX_SHADER )
        const fragmentShader = compileShader( gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER )
        const program = createProgram( gl, vertexShader, fragmentShader )

        // buffer
        const positionBuffer = gl.createBuffer()
        gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer )
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1,  1,
            1,  1
        ]), gl.STATIC_DRAW )

        // window resize
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            gl.viewport( 0, 0, canvas.width, canvas.height )
        }
    
        window.addEventListener('resize', resizeCanvas)
        resizeCanvas()

        // mesh
        const drawFullscreenQuad = () => {
            const posLocation = gl.getAttribLocation( program, 'position' )
            gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer )
            gl.enableVertexAttribArray( posLocation )
            gl.vertexAttribPointer( posLocation, 2, gl.FLOAT, false, 0, 0 )
            gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 )
        }

        // render
        const render = ( time: number ) => {
            time *= 0.0005
    
            gl.useProgram( program )
            gl.uniform1f( gl.getUniformLocation( program, 'time' ), time )
            gl.uniform2f( gl.getUniformLocation( program, 'resolution' ), canvas.width, canvas.height )
    
            gl.clear( gl.COLOR_BUFFER_BIT )
            drawFullscreenQuad()
    
            requestAnimationFrame( render )
        }
    
        requestAnimationFrame( render )
    } catch ( err ) {
        console.error( err )
    }
}

const renderRobot = (container: HTMLDivElement) => {
    try {
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
            faceMesh = scene.getObjectByName( 'Cylinder001_1' ) as any
            if ( !faceMesh ) return console.error( 'Face mesh not found.' )

            // head
            headMesh = scene.getObjectByName('Cylinder001') as any
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
  

const index = () => {
    console.log( 'Initializing index page.' )

    // DOM
    const nav = document.querySelector( '.nav' )
    const graphicContainer = document.querySelector( '.graphic__container' ) as HTMLDivElement

    // visiblity for nav and graphic
    if ( nav && graphicContainer ) {
        renderRobot( graphicContainer )
        nav.classList.remove( 'tf__hidden' )
        nav.classList.add( 'tf__animation__fade-in-from-top' )

        setTimeout(() => {
            graphicContainer.classList.add( 'tf__animation__fade-in-from-bottom' )
        }, 675)
    }

    // meta
    setTitle('Michael Vaden')
}

const about = () => {
    console.log( 'Initializing about page.' )

    // DOM
    const nav = document.querySelector( '.nav' )

    // nav visibility
    if ( nav ) {
        nav.classList.remove( 'tf__hidden' )
        nav.classList.add( 'tf__visible' )
    }

    // meta
    setTitle( 'About' )
}

const shelf = () => {
    console.log( 'Initializing shelf page.' )

    // DOM
    const nav = document.querySelector( '.nav' )

    // nav visibility
    if ( nav ) {
        nav.classList.remove( 'tf__hidden' )
        nav.classList.add( 'tf__visible' )
    }

    // meta
    setTitle( 'Shelf' )
}

const main = () => {
    // loader routers
    const routes = [
        { state: '', func: index },
        { state: 'about', func: about },
        { state: 'shelf', func: shelf }
    ]

    new Loader({ routes, defaultFunc: () => {}})

    // page independent functionality
    renderBackground()
}

window.addEventListener('DOMContentLoaded', main)
