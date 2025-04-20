const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 v_tex_coords;
void main() {
    v_tex_coords = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 v_tex_coords;
uniform float time;
uniform vec2 resolution;

#define TAU 6.28318530718
#define MAX_ITER 5

void main() {
    vec2 fragCoord = (v_tex_coords - 0.5) * resolution / min(resolution.x, resolution.y);

    float t = time * .5 + 24.0;
    vec2 p = mod(fragCoord.xy * TAU, TAU) - 250.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = .00275;

    for (int n = 0; n < MAX_ITER; n++) {
        float timeShift = t * (1.0 - (3.5 / float(n + 1)));
        i = p + vec2(cos(timeShift - i.x) + sin(timeShift + i.y),
                     sin(timeShift - i.y) + cos(timeShift + i.x));
        c += 1.0 / length(vec2(p.x / (sin(i.x + timeShift) / inten),
                               p.y / (cos(i.y + timeShift) / inten)));
    }

    c /= float(MAX_ITER);
    c = 1.17 - pow(c, 1.4);

    vec3 bg = vec3(0.05, 0.05, 0.05);
    vec3 fg = vec3(0.275, 0.105, 0.105);
    vec3 color = mix(bg, fg, pow(abs(c), 2.0));


    gl_FragColor = vec4(color, 1.0);
}`

/**
 * Compiles a shader.
 * @param gl Webgl instance
 * @param sourceCode shader source
 * @param shaderType shader type
 * @returns 
 */
const compileShader = ( gl: any, sourceCode: any, shaderType: any ) => {
    const shader = gl.createShader( shaderType )
    gl.shaderSource( shader, sourceCode )
    gl.compileShader( shader )

    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS )) {
        console.error( 'Shader compilation failed: ', gl.getShaderInfoLog( shader ))
        gl.deleteShader( shader )

        return null
    }

    return shader
}

/**
 * Creates the shader program.
 * @param gl 
 * @param vertexShader 
 * @param fragmentShader 
 * @returns 
 */
const createProgram = ( gl: any, vertexShader: any, fragmentShader: any ) => {
    const program = gl.createProgram()
    gl.attachShader( program, vertexShader )
    gl.attachShader( program, fragmentShader )
    gl.linkProgram( program )

    if (!gl.getProgramParameter( program, gl.LINK_STATUS )) {
        console.error( 'Program linking failed: ', gl.getProgramInfoLog( program ))
        gl.deleteProgram( program )

        return null
    }

    return program
}

/**
 * Renders the casutic ripple background.
 */
const renderBackground = () => {
    const backgroundSel = '.background > canvas'

    try {
        // canvas
        const canvas = document.querySelector( backgroundSel ) as HTMLCanvasElement
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

export { renderBackground }