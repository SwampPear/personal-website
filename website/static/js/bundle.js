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

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst router_1 = __webpack_require__(/*! ./taffy/router */ \"./src/taffy/router.ts\");\n/**\n * Index page.\n */\nconst index = () => {\n    console.log('Initializing index page.');\n};\n/**\n * About page.\n */\nconst about = () => {\n    console.log('Initializing about page.');\n};\n/**\n * Main.\n */\nconst main = () => {\n    const loader = new router_1.Loader({\n        routes: [\n            {\n                state: '',\n                func: index\n            },\n            {\n                state: 'about',\n                func: about\n            }\n        ],\n        defaultFunc: () => { }\n    });\n};\nwindow.addEventListener('DOMContentLoaded', main);\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/taffy/router.ts":
/*!*****************************!*\
  !*** ./src/taffy/router.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Loader = exports.Router = void 0;\n/**\n * Manages script execution based on URL state\n */\nclass Router {\n    /**\n     * Initializes Router and executes the matching script\n     * @param props - Router configuration\n     */\n    constructor(props) {\n        /**\n         * Executes the script corresponding to the current URL state\n         * Logs errors if execution fails\n         */\n        this.run = () => {\n            var _a;\n            try {\n                ((_a = this.routes.find(route => route.state === this.getLocation())) === null || _a === void 0 ? void 0 : _a.func()) || this.defaultFunc();\n            }\n            catch (error) {\n                console.error('Router execution error:', error);\n            }\n        };\n        /**\n         * Retrieves the current URL state\n         * @returns The first path segment of the URL\n         */\n        this.getLocation = () => {\n            return new URL(window.location.href).pathname.split('/')[1] || '';\n        };\n        this.routes = props.routes;\n        this.defaultFunc = props.defaultFunc;\n        this.run();\n    }\n}\nexports.Router = Router;\n/**\n * Asynchronously manages script execution based on URL state with dynamic reload\n */\nclass Loader {\n    /**\n     * Initializes Loader and executes the matching script\n     * @param props - Loader configuration\n     */\n    constructor(props) {\n        /**\n         * Updates the URL state and executes the corresponding script without reloading\n         * @param state - New state to set in the URL\n         */\n        this.navigate = (state) => {\n            history.pushState({}, '', `/${state}`);\n            this.run();\n        };\n        /**\n         * Executes the script corresponding to the current URL state\n         */\n        this.run = () => {\n            this.router.run();\n        };\n        /**\n         * Refreshes asynchronous links\n         */\n        this.initLinks = () => {\n            const links = document.querySelectorAll('a');\n            links.forEach(link => {\n                if (link.hasAttribute('data-href')) {\n                    link.addEventListener('click', (event) => {\n                        event.preventDefault();\n                        const href = link.getAttribute('data-href');\n                        this.navigate(href);\n                    });\n                }\n            });\n        };\n        this.router = new Router({\n            routes: props.routes,\n            defaultFunc: props.defaultFunc\n        });\n        this.initLinks();\n        window.onpopstate = () => this.run();\n    }\n}\nexports.Loader = Loader;\n\n\n//# sourceURL=webpack:///./src/taffy/router.ts?");

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