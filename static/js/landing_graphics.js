document.addEventListener( 'DOMContentLoaded', () => {
    const canvas = document.querySelector( '.landing__graphic' )

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

    init()
})