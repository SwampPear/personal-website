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

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst router_1 = __webpack_require__(/*! ./taffy/router */ \"./src/taffy/router.ts\");\nconst meta_1 = __webpack_require__(/*! ./taffy/meta */ \"./src/taffy/meta.ts\");\nconst shaders_1 = __webpack_require__(/*! ./shaders */ \"./src/shaders.ts\");\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\nconst renderBackground = () => {\n    const canvas = document.querySelector('.background > canvas');\n    if (!canvas)\n        return console.error('Canvas not found');\n    const gl = canvas.getContext('webgl', { alpha: true });\n    if (!gl)\n        return console.error('WebGL not supported');\n    const vertexShader = (0, utils_1.compileShader)(gl, shaders_1.VERTEX_SHADER, gl.VERTEX_SHADER);\n    const fragmentShader = (0, utils_1.compileShader)(gl, shaders_1.FRAGMENT_SHADER, gl.FRAGMENT_SHADER);\n    const program = (0, utils_1.createProgram)(gl, vertexShader, fragmentShader);\n    const positionBuffer = gl.createBuffer();\n    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([\n        -1, -1,\n        1, -1,\n        -1, 1,\n        1, 1\n    ]), gl.STATIC_DRAW);\n    const resizeCanvas = () => {\n        canvas.width = window.innerWidth;\n        canvas.height = window.innerHeight;\n        gl.viewport(0, 0, canvas.width, canvas.height);\n    };\n    window.addEventListener('resize', resizeCanvas);\n    resizeCanvas();\n    const drawFullscreenQuad = () => {\n        const posLocation = gl.getAttribLocation(program, 'position');\n        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);\n        gl.enableVertexAttribArray(posLocation);\n        gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);\n        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);\n    };\n    const render = (time) => {\n        time *= 0.0005;\n        gl.useProgram(program);\n        gl.uniform1f(gl.getUniformLocation(program, 'time'), time);\n        gl.uniform2f(gl.getUniformLocation(program, 'resolution'), canvas.width, canvas.height);\n        gl.clear(gl.COLOR_BUFFER_BIT);\n        drawFullscreenQuad();\n        requestAnimationFrame(render);\n    };\n    requestAnimationFrame(render);\n};\nconst index = () => {\n    console.log('Initializing index page.');\n    (0, meta_1.setTitle)('Michael Vaden');\n    renderBackground();\n};\nconst about = () => {\n    console.log('Initializing about page.');\n    (0, meta_1.setTitle)('About');\n};\nconst main = () => {\n    const routes = [\n        { state: '', func: index },\n        { state: 'about', func: about }\n    ];\n    new router_1.Loader({ routes, defaultFunc: () => { } });\n};\nwindow.addEventListener('DOMContentLoaded', main);\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/shaders.ts":
/*!************************!*\
  !*** ./src/shaders.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.FRAGMENT_SHADER = exports.VERTEX_SHADER = void 0;\nconst VERTEX_SHADER = `\nattribute vec2 position;\nvarying vec2 v_tex_coords;\nvoid main() {\n    v_tex_coords = position * 0.5 + 0.5;\n    gl_Position = vec4(position, 0.0, 1.0);\n}`;\nexports.VERTEX_SHADER = VERTEX_SHADER;\nconst FRAGMENT_SHADER = `\nprecision mediump float;\nvarying vec2 v_tex_coords;\nuniform float time;\nuniform vec2 resolution;\n\n#define TAU 6.28318530718\n#define MAX_ITER 5\n\nvoid main() {\n    vec2 fragCoord = (v_tex_coords - 0.5) * resolution / min(resolution.x, resolution.y);\n\n    float t = time * .5 + 24.0;\n    vec2 p = mod(fragCoord.xy * TAU, TAU) - 250.0;\n    vec2 i = vec2(p);\n    float c = 1.0;\n    float inten = .005;\n\n    for (int n = 0; n < MAX_ITER; n++) {\n        float timeShift = t * (1.0 - (3.5 / float(n + 1)));\n        i = p + vec2(cos(timeShift - i.x) + sin(timeShift + i.y),\n                     sin(timeShift - i.y) + cos(timeShift + i.x));\n        c += 1.0 / length(vec2(p.x / (sin(i.x + timeShift) / inten),\n                               p.y / (cos(i.y + timeShift) / inten)));\n    }\n\n    c /= float(MAX_ITER);\n    c = 1.17 - pow(c, 1.4);\n\n    vec3 bg = vec3(0.05, 0.05, 0.05);\n    vec3 fg = vec3(0.095, 0.095, 0.1375);\n    vec3 color = mix(bg, fg, pow(abs(c), 2.0));\n\n\n    gl_FragColor = vec4(color, 1.0);\n}`;\nexports.FRAGMENT_SHADER = FRAGMENT_SHADER;\n\n\n//# sourceURL=webpack:///./src/shaders.ts?");

/***/ }),

/***/ "./src/taffy/meta.ts":
/*!***************************!*\
  !*** ./src/taffy/meta.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.setTitle = void 0;\n/**\n * Sets the title in head.\n */\nconst setTitle = (newTitle) => {\n    const title = document.querySelector('title');\n    if (title) {\n        title.innerText = newTitle;\n    }\n    else {\n        console.error('No title element detected');\n    }\n};\nexports.setTitle = setTitle;\n\n\n//# sourceURL=webpack:///./src/taffy/meta.ts?");

/***/ }),

/***/ "./src/taffy/router.ts":
/*!*****************************!*\
  !*** ./src/taffy/router.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Loader = exports.Router = void 0;\n/**\n * Manages script execution based on URL state\n */\nclass Router {\n    /**\n     * Initializes Router and executes the matching script\n     * @param props - Router configuration\n     */\n    constructor(props) {\n        /**\n         * Executes the script corresponding to the current URL state\n         * Logs errors if execution fails\n         */\n        this.run = () => {\n            var _a;\n            try {\n                ((_a = this.routes.find(route => route.state === this.getLocation())) === null || _a === void 0 ? void 0 : _a.func()) || this.defaultFunc();\n            }\n            catch (error) {\n                console.error('Router execution error:', error);\n            }\n        };\n        /**\n         * Retrieves the current URL state\n         * @returns The first path segment of the URL\n         */\n        this.getLocation = () => {\n            return new URL(window.location.href).pathname.split('/')[1] || '';\n        };\n        this.routes = props.routes;\n        this.defaultFunc = props.defaultFunc;\n        this.run();\n    }\n}\nexports.Router = Router;\n/**\n * Asynchronously manages script execution based on URL state with dynamic reload\n */\nclass Loader {\n    /**\n     * Initializes Loader and executes the matching script\n     * @param props - Loader configuration\n     */\n    constructor(props) {\n        /**\n         * Updates the URL state and executes the corresponding script without reloading\n         * @param state - New state to set in the URL\n         */\n        this.navigate = (state) => {\n            history.pushState({}, '', `/${state}`);\n            this.run();\n        };\n        /**\n         * Executes the script corresponding to the current URL state\n         */\n        this.run = () => {\n            this.router.run();\n        };\n        /**\n         * Refreshes asynchronous links\n         */\n        this.initLinks = () => {\n            const links = document.querySelectorAll('a');\n            links.forEach(link => {\n                if (link.hasAttribute('taffy-href')) {\n                    link.addEventListener('click', (event) => {\n                        event.preventDefault();\n                        const href = link.getAttribute('taffy-href');\n                        this.navigate(href);\n                    });\n                }\n            });\n        };\n        this.router = new Router({\n            routes: props.routes,\n            defaultFunc: props.defaultFunc\n        });\n        this.initLinks();\n        window.onpopstate = () => this.run();\n    }\n}\nexports.Loader = Loader;\n\n\n//# sourceURL=webpack:///./src/taffy/router.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.createProgram = exports.compileShader = void 0;\n/**\n * Compiles a shader\n * @param gl Webgl instance\n * @param sourceCode shader source\n * @param shaderType shader type\n * @returns\n */\nconst compileShader = (gl, sourceCode, shaderType) => {\n    const shader = gl.createShader(shaderType);\n    gl.shaderSource(shader, sourceCode);\n    gl.compileShader(shader);\n    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {\n        console.error('Shader compilation failed: ', gl.getShaderInfoLog(shader));\n        gl.deleteShader(shader);\n        return null;\n    }\n    return shader;\n};\nexports.compileShader = compileShader;\n/**\n * Creates the shader program\n * @param gl\n * @param vertexShader\n * @param fragmentShader\n * @returns\n */\nconst createProgram = (gl, vertexShader, fragmentShader) => {\n    const program = gl.createProgram();\n    gl.attachShader(program, vertexShader);\n    gl.attachShader(program, fragmentShader);\n    gl.linkProgram(program);\n    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {\n        console.error('Program linking failed: ', gl.getProgramInfoLog(program));\n        gl.deleteProgram(program);\n        return null;\n    }\n    return program;\n};\nexports.createProgram = createProgram;\n\n\n//# sourceURL=webpack:///./src/utils.ts?");

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