import Router, { Route } from './pocket/router'
import Pocket from './pocket/pocket'

const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 v_tex_coords;
    void main() {
        v_tex_coords = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
    }`

const proceduralShader = `
precision mediump float;
varying vec2 v_tex_coords;
uniform float time;
uniform vec2 resolution;

#define TAU 6.28318530718
#define MAX_ITER 5

void main() {
    vec2 uv = v_tex_coords;
    vec2 fragCoord = (v_tex_coords - 0.5) * resolution / min(resolution.x, resolution.y);

    float t = time * .5 + 24.0;

    vec2 p = mod(fragCoord.xy * TAU, TAU) - 250.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = .005;

    for (int n = 0; n < MAX_ITER; n++) {
        float timeShift = t * (1.0 - (3.5 / float(n + 1)));
        i = p + vec2(cos(timeShift - i.x) + sin(timeShift + i.y), 
                    sin(timeShift - i.y) + cos(timeShift + i.x));
        c += 1.0 / length(vec2(p.x / (sin(i.x + timeShift) / inten), 
                            p.y / (cos(i.y + timeShift) / inten)));
    }

    c /= float(MAX_ITER);
    c = 1.17 - pow(c, 1.4);

    vec3 color = vec3(pow(abs(c), 8.0));
    gl_FragColor = vec4(color, 1.0);
}
`

const edgeDetectionShader = `
precision mediump float;
varying vec2 v_tex_coords;
uniform sampler2D u_texture;
uniform vec2 resolution;

// Basic luminance helper
float luminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
    vec2 step = 1.0 / resolution;

    // Sample neighboring pixels
    float center = luminance(texture2D(u_texture, v_tex_coords).rgb);
    float left   = luminance(texture2D(u_texture, v_tex_coords - vec2(step.x, 0)).rgb);
    float right  = luminance(texture2D(u_texture, v_tex_coords + vec2(step.x, 0)).rgb);
    float up     = luminance(texture2D(u_texture, v_tex_coords + vec2(0, step.y)).rgb);
    float down   = luminance(texture2D(u_texture, v_tex_coords - vec2(0, step.y)).rgb);

    float edge = abs(left - right) + abs(up - down);

    vec3 lineColor = vec3(1.0 - edge * 5.0); // White background, black lines
    gl_FragColor = vec4(lineColor, 1.0);
}
`

const compileShader = ( gl: any, sourceCode: any, shaderType: any ) => {
    const shader = gl.createShader( shaderType )
    gl.shaderSource( shader, sourceCode )
    gl.compileShader( shader )

    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
        console.error( 
            'Shader compilation failed: ', 
            gl.getShaderInfoLog( shader ) )
        gl.deleteShader( shader )

        return null
    }

    return shader
}

const createProgram = ( gl: any, vertexShader: any, fragmentShader: any ) => {
    const program = gl.createProgram() 
    gl.attachShader( program, vertexShader )
    gl.attachShader( program, fragmentShader ) 
    gl.linkProgram( program)

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
        console.error(
            'Program linking failed: ', 
            gl.getProgramInfoLog(program) )
        gl.deleteProgram(program)
        return null
    }

    return program
}

const indexRoute = () => {
    const canvas = document.querySelector('.welcome__graphic') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    // Compile shaders
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const proceduralFragmentShader = compileShader(gl, proceduralShader, gl.FRAGMENT_SHADER);
    const edgeFragmentShader = compileShader(gl, edgeDetectionShader, gl.FRAGMENT_SHADER);

    const proceduralProgram = createProgram(gl, vertexShader, proceduralFragmentShader);
    const edgeProgram = createProgram(gl, vertexShader, edgeFragmentShader);

    // Fullscreen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1
    ]), gl.STATIC_DRAW);

    // Framebuffer & texture for first pass (procedural)
    const framebuffer = gl.createFramebuffer();
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Resize texture
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // Reattach framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawFullscreenQuad = (program: WebGLProgram) => {
        const posLocation = gl.getAttribLocation(program, 'position');
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(posLocation);
        gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const render = (time: number) => {
        time *= 0.0001;

        // === First Pass: Draw procedural shader into framebuffer ===
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(proceduralProgram);
        gl.uniform1f(gl.getUniformLocation(proceduralProgram, 'time'), time);
        gl.uniform2f(gl.getUniformLocation(proceduralProgram, 'resolution'), canvas.width, canvas.height);
        gl.uniform1f(gl.getUniformLocation(proceduralProgram, 'scale'), 0.5); // Tweak scale here if needed

        drawFullscreenQuad(proceduralProgram);

        // === Second Pass: Draw edge detection result to canvas ===
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(edgeProgram);
        gl.uniform1i(gl.getUniformLocation(edgeProgram, 'u_texture'), 0);
        gl.uniform2f(gl.getUniformLocation(edgeProgram, 'resolution'), canvas.width, canvas.height);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        drawFullscreenQuad(edgeProgram);

        requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
};


const routes: Route[] = [
    {
        location: '',
        func: indexRoute
    }
]

document.addEventListener( 'DOMContentLoaded', ( event ) => {
    const url = new URL( window.location.href )

    const pocket = new Pocket()
    const router = new Router({
        routes: routes,
        defaultFunc:  () => {}
    })
})