import { Loader } from './taffy/router'
import { setTitle } from './taffy/meta'
import { VERTEX_SHADER, FRAGMENT_SHADER } from './shaders'
import { compileShader, createProgram } from './utils'

const renderBackground = () => {
    const canvas = document.querySelector('.background > canvas') as HTMLCanvasElement
    if (!canvas) return console.error('Canvas not found')

    const gl = canvas.getContext('webgl', { alpha: true })
    if (!gl) return console.error('WebGL not supported')

    const vertexShader = compileShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER)
    const program = createProgram(gl, vertexShader, fragmentShader)

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1
    ]), gl.STATIC_DRAW)

    const resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        gl.viewport(0, 0, canvas.width, canvas.height)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const drawFullscreenQuad = () => {
        const posLocation = gl.getAttribLocation(program, 'position')
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.enableVertexAttribArray(posLocation)
        gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const render = (time: number) => {
        time *= 0.0005

        gl.useProgram(program)
        gl.uniform1f(gl.getUniformLocation(program, 'time'), time)
        gl.uniform2f(gl.getUniformLocation(program, 'resolution'), canvas.width, canvas.height)

        gl.clear(gl.COLOR_BUFFER_BIT)
        drawFullscreenQuad()

        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}

const index = () => {
    console.log( 'Initializing index page.' )

    // DOM
    const nav = document.querySelector( '.nav' )
    const graphicContainer = document.querySelector( '.graphic__container' )

    // nav visibility
    if ( nav && graphicContainer ) {
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

const aboutPreload = () => {
    console.log( 'Running index preload.' )

    // DOM
    const indexPage = document.querySelector( '.index-page' )

    // page visibility
    if ( indexPage ) {
        indexPage.classList.add( 'tf__animation__fade-out-to-bottom')
        setTimeout(() => {
            indexPage.classList.remove( 'tf__visible' )
            indexPage.classList.add( 'tf__hidden' )
        }, 675)
    }
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
        { state: 'about', func: about, preLoad: aboutPreload, preLoadDelay: 675 },
        { state: 'shelf', func: shelf }
    ]

    new Loader({ routes, defaultFunc: () => {} })

    // page independent functionality
    renderBackground()
}

window.addEventListener('DOMContentLoaded', main)
