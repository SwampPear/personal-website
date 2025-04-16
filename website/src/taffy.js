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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __exportStar = (this && this.__exportStar) || function(m, exports) {\n    for (var p in m) if (p !== \"default\" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n//export * from './taffy/effect'\n__exportStar(__webpack_require__(/*! ./taffy/grid */ \"./src/taffy/grid.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./taffy/meta */ \"./src/taffy/meta.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./taffy/router */ \"./src/taffy/router.ts\"), exports);\n//export * from './taffy/scroll'\n\n\n//# sourceURL=webpack://taffy/./src/index.ts?");

/***/ }),

/***/ "./src/taffy/grid.ts":
/*!***************************!*\
  !*** ./src/taffy/grid.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Grid = void 0;\n/**\n * Manages a dynamic grid of images.\n */\nclass Grid {\n    /**\n     * Initializes Grid.\n     * @param {GridOptions} options - Loader options\n     */\n    constructor(options) {\n        // setup\n        this.container = document.querySelector(options.containerSel);\n        this.container.style.backgroundColor = 'black';\n    }\n}\nexports.Grid = Grid;\n\n\n//# sourceURL=webpack://taffy/./src/taffy/grid.ts?");

/***/ }),

/***/ "./src/taffy/meta.ts":
/*!***************************!*\
  !*** ./src/taffy/meta.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.setTitle = void 0;\n/**\n * Sets page title.\n */\nconst setTitle = (newTitle) => {\n    const title = document.querySelector('title');\n    if (!title) {\n        console.error('title not found');\n    }\n    else {\n        title.innerText = newTitle;\n    }\n};\nexports.setTitle = setTitle;\n\n\n//# sourceURL=webpack://taffy/./src/taffy/meta.ts?");

/***/ }),

/***/ "./src/taffy/router.ts":
/*!*****************************!*\
  !*** ./src/taffy/router.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Loader = void 0;\n/**\n * Asynchronously manages script execution based on URL state with dynamic\n * reloading.\n */\nclass Loader {\n    /**\n     * Initializes Loader and executes matching script.\n     * @param {LoaderOptions} options - Loader options\n     */\n    constructor(options) {\n        /**\n         * Executes corresponding script to current URL state.\n         */\n        this.run = () => {\n            try {\n                // locate route\n                let route = null;\n                let routeLocated = false;\n                for (let i = 0; i < this.routes.length; i++) {\n                    if (this.routes[i].state === this.getLocation()) {\n                        routeLocated = true;\n                        route = this.routes[i];\n                        break;\n                    }\n                }\n                // default functionality\n                if (!routeLocated && this.defaultFunc) {\n                    this.defaultFunc();\n                }\n                // TODO: preswitch (don't know how to execute this yet)\n                // route functionality\n                if (routeLocated && route) {\n                    route.func();\n                }\n            }\n            catch (error) {\n                console.error('Taffy Error:', error);\n            }\n        };\n        /**\n         * Retrieves current URL state.\n         * @returns {string} first path component of URL\n         */\n        this.getLocation = () => {\n            return new URL(window.location.href).pathname.split('/')[1] || '';\n        };\n        /**\n         * Updates the URL state and executes the corresponding script.\n         * @param {string} state - new URL state\n         */\n        this.navigate = (state) => {\n            history.pushState({}, '', `/${state}`);\n            this.run();\n        };\n        /**\n         * Initializes loader links.\n         */\n        this.initLinks = () => {\n            // find all anchors\n            const links = document.querySelectorAll('a');\n            // hijack redirect functionality of all links with 'taffy-href' property\n            links.forEach(link => {\n                if (link.hasAttribute('tf-href')) {\n                    link.addEventListener('click', (event) => {\n                        event.preventDefault();\n                        const href = link.getAttribute('tf-href');\n                        this.navigate(href);\n                    });\n                }\n            });\n        };\n        // setup\n        this.routes = options.routes;\n        this.defaultFunc = options.defaultFunc;\n        this.initLinks();\n        // run\n        this.run();\n        window.onpopstate = () => this.run();\n    }\n}\nexports.Loader = Loader;\n\n\n//# sourceURL=webpack://taffy/./src/taffy/router.ts?");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;