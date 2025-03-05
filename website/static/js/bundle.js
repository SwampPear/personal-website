/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst router_1 = __webpack_require__(/*! ./pocket/router */ \"./src/pocket/router.ts\");\nconst pocket_1 = __webpack_require__(/*! ./pocket/pocket */ \"./src/pocket/pocket.ts\");\nconst vertexShaderSource = `\n    attribute vec2 position;\n    varying vec2 v_tex_coords;\n    void main() {\n        v_tex_coords = position * 0.5 + 0.5;\n        gl_Position = vec4(position, 0.0, 1.0);\n    }`;\nconst proceduralShader = `\nprecision mediump float;\nvarying vec2 v_tex_coords;\nuniform float time;\nuniform vec2 resolution;\n\n#define TAU 6.28318530718\n#define MAX_ITER 5\n\nvoid main() {\n    vec2 uv = v_tex_coords;\n    vec2 fragCoord = (v_tex_coords - 0.5) * resolution / min(resolution.x, resolution.y);\n\n    float t = time * .5 + 24.0;\n\n    vec2 p = mod(fragCoord.xy * TAU, TAU) - 250.0;\n    vec2 i = vec2(p);\n    float c = 1.0;\n    float inten = .005;\n\n    for (int n = 0; n < MAX_ITER; n++) {\n        float timeShift = t * (1.0 - (3.5 / float(n + 1)));\n        i = p + vec2(cos(timeShift - i.x) + sin(timeShift + i.y), \n                    sin(timeShift - i.y) + cos(timeShift + i.x));\n        c += 1.0 / length(vec2(p.x / (sin(i.x + timeShift) / inten), \n                            p.y / (cos(i.y + timeShift) / inten)));\n    }\n\n    c /= float(MAX_ITER);\n    c = 1.17 - pow(c, 1.4);\n\n    vec3 color = vec3(pow(abs(c), 8.0));\n    gl_FragColor = vec4(color, 1.0);\n}\n`;\nconst edgeDetectionShader = `\nprecision mediump float;\nvarying vec2 v_tex_coords;\nuniform sampler2D u_texture;\nuniform vec2 resolution;\n\n// Basic luminance helper\nfloat luminance(vec3 color) {\n    return dot(color, vec3(0.299, 0.587, 0.114));\n}\n\nvoid main() {\n    vec2 step = 1.0 / resolution;\n\n    // Sample neighboring pixels\n    float center = luminance(texture2D(u_texture, v_tex_coords).rgb);\n    float left   = luminance(texture2D(u_texture, v_tex_coords - vec2(step.x, 0)).rgb);\n    float right  = luminance(texture2D(u_texture, v_tex_coords + vec2(step.x, 0)).rgb);\n    float up     = luminance(texture2D(u_texture, v_tex_coords + vec2(0, step.y)).rgb);\n    float down   = luminance(texture2D(u_texture, v_tex_coords - vec2(0, step.y)).rgb);\n\n    float edge = abs(left - right) + abs(up - down);\n\n    vec3 lineColor = vec3(1.0 - edge * 5.0); // White background, black lines\n    gl_FragColor = vec4(lineColor, 1.0);\n}\n`;\nconst compileShader = (gl, sourceCode, shaderType) => {\n    const shader = gl.createShader(shaderType);\n    gl.shaderSource(shader, sourceCode);\n    gl.compileShader(shader);\n    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {\n        console.error('Shader compilation failed: ', gl.getShaderInfoLog(shader));\n        gl.deleteShader(shader);\n        return null;\n    }\n    return shader;\n};\nconst createProgram = (gl, vertexShader, fragmentShader) => {\n    const program = gl.createProgram();\n    gl.attachShader(program, vertexShader);\n    gl.attachShader(program, fragmentShader);\n    gl.linkProgram(program);\n    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {\n        console.error('Program linking failed: ', gl.getProgramInfoLog(program));\n        gl.deleteProgram(program);\n        return null;\n    }\n    return program;\n};\nconst indexRoute = () => {\n    const canvas = document.querySelector('.welcome__graphic');\n    if (!canvas) {\n        console.error('Canvas not found');\n        return;\n    }\n    const gl = canvas.getContext('webgl', { alpha: true });\n    if (!gl) {\n        console.error('WebGL not supported');\n        return;\n    }\n    // Compile shaders\n    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);\n    const proceduralFragmentShader = compileShader(gl, proceduralShader, gl.FRAGMENT_SHADER);\n    const edgeFragmentShader = compileShader(gl, edgeDetectionShader, gl.FRAGMENT_SHADER);\n    const proceduralProgram = createProgram(gl, vertexShader, proceduralFragmentShader);\n    const edgeProgram = createProgram(gl, vertexShader, edgeFragmentShader);\n    // Fullscreen quad buffer\n    const positionBuffer = gl.createBuffer();\n    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([\n        -1, -1,\n        1, -1,\n        -1, 1,\n        1, 1\n    ]), gl.STATIC_DRAW);\n    // Framebuffer & texture for first pass (procedural)\n    const framebuffer = gl.createFramebuffer();\n    const texture = gl.createTexture();\n    gl.bindTexture(gl.TEXTURE_2D, texture);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);\n    const resizeCanvas = () => {\n        canvas.width = window.innerWidth;\n        canvas.height = window.innerHeight;\n        gl.viewport(0, 0, canvas.width, canvas.height);\n        // Resize texture\n        gl.bindTexture(gl.TEXTURE_2D, texture);\n        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);\n        // Reattach framebuffer\n        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);\n        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);\n    };\n    window.addEventListener('resize', resizeCanvas);\n    resizeCanvas();\n    const drawFullscreenQuad = (program) => {\n        const posLocation = gl.getAttribLocation(program, 'position');\n        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);\n        gl.enableVertexAttribArray(posLocation);\n        gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);\n        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);\n    };\n    const render = (time) => {\n        time *= 0.0001;\n        // === First Pass: Draw procedural shader into framebuffer ===\n        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);\n        gl.viewport(0, 0, canvas.width, canvas.height);\n        gl.clear(gl.COLOR_BUFFER_BIT);\n        gl.useProgram(proceduralProgram);\n        gl.uniform1f(gl.getUniformLocation(proceduralProgram, 'time'), time);\n        gl.uniform2f(gl.getUniformLocation(proceduralProgram, 'resolution'), canvas.width, canvas.height);\n        gl.uniform1f(gl.getUniformLocation(proceduralProgram, 'scale'), 0.5); // Tweak scale here if needed\n        drawFullscreenQuad(proceduralProgram);\n        // === Second Pass: Draw edge detection result to canvas ===\n        gl.bindFramebuffer(gl.FRAMEBUFFER, null);\n        gl.viewport(0, 0, canvas.width, canvas.height);\n        gl.clear(gl.COLOR_BUFFER_BIT);\n        gl.useProgram(edgeProgram);\n        gl.uniform1i(gl.getUniformLocation(edgeProgram, 'u_texture'), 0);\n        gl.uniform2f(gl.getUniformLocation(edgeProgram, 'resolution'), canvas.width, canvas.height);\n        gl.activeTexture(gl.TEXTURE0);\n        gl.bindTexture(gl.TEXTURE_2D, texture);\n        drawFullscreenQuad(edgeProgram);\n        requestAnimationFrame(render);\n    };\n    requestAnimationFrame(render);\n};\nconst routes = [\n    {\n        location: '',\n        func: indexRoute\n    }\n];\ndocument.addEventListener('DOMContentLoaded', (event) => {\n    const url = new URL(window.location.href);\n    const pocket = new pocket_1.default();\n    const router = new router_1.default({\n        routes: routes,\n        defaultFunc: () => { }\n    });\n});\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/pocket/elementPrimitive.ts":
/*!****************************************!*\
  !*** ./src/pocket/elementPrimitive.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass ElementPrimitive extends HTMLElement {\n    static from(props) {\n        const el = document.querySelector(props.selector);\n        if (el)\n            el.selector = props.selector;\n        return el;\n    }\n    constructor(props) {\n        super();\n        this.selector = props.selector;\n    }\n}\nexports[\"default\"] = ElementPrimitive;\n\n\n//# sourceURL=webpack:///./src/pocket/elementPrimitive.ts?");

/***/ }),

/***/ "./src/pocket/pocket.ts":
/*!******************************!*\
  !*** ./src/pocket/pocket.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst elementPrimitive_1 = __webpack_require__(/*! ./elementPrimitive */ \"./src/pocket/elementPrimitive.ts\");\nclass Pocket {\n    constructor() {\n        window.customElements.define('element-primitive', elementPrimitive_1.default, { extends: 'div' });\n    }\n}\nexports[\"default\"] = Pocket;\n\n\n//# sourceURL=webpack:///./src/pocket/pocket.ts?");

/***/ }),

/***/ "./src/pocket/router.ts":
/*!******************************!*\
  !*** ./src/pocket/router.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Router {\n    constructor(props) {\n        this.run = () => {\n            const location = this.getLocation();\n            let func = () => { };\n            let match = false;\n            for (let i = 0; i < this.routes.length; i++) {\n                if (this.routes[i].location === location) {\n                    func = this.routes[i].func;\n                    match = true;\n                    break;\n                }\n            }\n            if (match) {\n                func();\n            }\n            else {\n                this.defaultFunc();\n            }\n        };\n        this.getLocation = () => {\n            const url = new URL(window.location.href);\n            return url.pathname.split('/')[1];\n        };\n        this.routes = props.routes;\n        this.defaultFunc = props.defaultFunc;\n        this.run();\n    }\n}\nexports[\"default\"] = Router;\n\n\n//# sourceURL=webpack:///./src/pocket/router.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;