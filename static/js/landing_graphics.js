document.addEventListener( 'DOMContentLoaded', () => {
    const canvas = document.querySelector( '.landing__graphic' )

    function compileShader(gl, sourceCode, shaderType) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation failed: ', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    // Utility to link shaders into a program
    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking failed: ', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        return program;
    }

function main() {
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported!');
        return;
    }

    const vertexShaderSource = `
        attribute vec2 position;
        varying vec2 v_tex_coords;
        void main() {
            v_tex_coords = position * 0.5 + 0.5;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        varying vec2 v_tex_coords;
        uniform float time;
        uniform vec2 resolution;

        // Ripple effect function
        float ripple(vec2 uv, float time) {
            float d = length(uv - vec2(0.5, 0.5));
            float ripple_effect = sin(10.0 * (d - time * 2.0)) * exp(-d * 10.0);
            return ripple_effect;
        }

        // Simulate caustics and water refraction
        vec3 caustics(vec2 uv, float time) {
            float distortion = ripple(uv, time);
            return vec3(0.0, 0.4, 1.0) + distortion * 0.3;
        }

        void main() {
            vec2 uv = v_tex_coords;

            // Compute ripple and refraction
            float distortion = ripple(uv, time);

            // Shift UV coordinates based on the ripple distortion
            vec2 refracted_uv = uv + vec2(distortion * 0.02, distortion * 0.02);

            // Apply caustics for a light-through-water effect
            vec3 color = caustics(refracted_uv, time);

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // Compile shaders
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Create shader program
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Look up attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'position');
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');

    // Set up buffer for position data
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Set up vertex attributes
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set canvas size and resolution
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Animation loop
    function render(time) {
        time *= 0.001;  // Convert to seconds

        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Use the shader program
        gl.useProgram(program);

        // Set uniforms
        gl.uniform1f(timeLocation, time);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        // Draw the scene
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Request next frame
        requestAnimationFrame(render);
    }

    // Start rendering
    requestAnimationFrame(render);
}

// Initialize WebGL scene
main();


    /*

    async function init() {
        const { instance } = await WebAssembly.instantiateStreaming(
            fetch( '/wasm/website_graphics.wasm' )
        )

        const rippleEffect = instance.exports.ripple_effect

        const gl = canvas.getContext( 'webgl' )

        if (!gl) {
            alert('WebGL not supported!')
            return;
        }

        // Vertex Shader
        const vertexShaderSource = `
            attribute vec2 position;
            varying vec2 v_tex_coords;
            void main() {
                v_tex_coords = position;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        // Fragment Shader (using ripple_effect from Rust)
        const fragmentShaderSource = `
            precision mediump float;
            varying vec2 v_tex_coords;
            uniform float time;
            uniform vec2 resolution;

            float ripple_effect(float x, float y, float time);

            void main() {
                vec2 uv = v_tex_coords;
                vec2 scaled_uv = uv * resolution / min(resolution.x, resolution.y);

                float distortion = ripple_effect(scaled_uv.x, scaled_uv.y, time);

                vec2 refracted_uv = uv + vec2(distortion * 0.02, distortion * 0.02);

                vec3 water_color = vec3(0.0, 0.5, 1.0) + distortion * 0.2;

                gl_FragColor = vec4(water_color, 1.0);
            }
        `;

        // Inject the ripple_effect function into the WebGL program
        const fragmentShaderSourceWithRust = fragmentShaderSource.replace(
            'float ripple_effect(float x, float y, float time);',
            `
            float ripple_effect(float x, float y, float time) {
                return ${rippleEffect.toString()}(x, y, time);
            }
            `
        );

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSourceWithRust);
        gl.compileShader(fragmentShader);

        // Create and link the program
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Set up buffers
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
            -1, -1, 1, -1, -1, 1, 1, 1
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const timeLocation = gl.getUniformLocation(program, 'time');
        const resolutionLocation = gl.getUniformLocation(program, 'resolution');

        // Animation loop
        function render(time) {
            const width = canvas.width = window.innerWidth;
            const height = canvas.height = window.innerHeight;
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

            gl.uniform1f(timeLocation, time * 0.001);
            gl.uniform2f(resolutionLocation, width, height);

            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }

    async function init2() {
        const { instance } = await WebAssembly.instantiateStreaming(
            fetch( '/wasm/website_graphics.wasm' )
        )

        const width = 600
        const height = 600

        graphic.width = width
        graphic.height = height

        const buffer_address = instance.exports.BUFFER.value

        const image = new ImageData(
            new Uint8ClampedArray(
                instance.exports.memory.buffer,
                buffer_address,
                4 * width * height,
            ),
            width,
        )

        const ctx = graphic.getContext( '2d' )

        const render = () => {
          instance.exports.go()
          ctx.putImageData( image, 0, 0 )
          requestAnimationFrame( render )
        }

        render()

        // test
        const answer = instance.exports.the_answer();
        console.log(answer);

        const testMouse = instance.exports.test_mouse;

        document.addEventListener('mousemove', (event) => {
            console.log(testMouse(event.clientX, event.clientY))
        })
    }

    init()*/
})