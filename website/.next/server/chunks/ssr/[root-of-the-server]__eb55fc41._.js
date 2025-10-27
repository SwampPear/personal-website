module.exports = [
"[project]/.next-internal/server/app/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/components/Background.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
;
;
// Compiles GLSL shaders.
const compileShader = (gl, src, type)=>{
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    // shader compilation failed
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed: ', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};
// Formats both shaders.
const formatShaders = (color)=>{
    const VERTEX_SHADER = `
      attribute vec2 position;
      varying vec2 v_tex_coords;
      void main() {
          v_tex_coords = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
      }`;
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
          vec3 fg = ${color};
          vec3 color = mix(bg, fg, pow(abs(c), 2.0));


          gl_FragColor = vec4(color, 1.0);
      }`;
    return [
        VERTEX_SHADER,
        FRAGMENT_SHADER
    ];
};
// Creates the shader program from vertex and fragment shaders.
const createProgram = (gl, color)=>{
    const [vertexShaderSrc, fragmentShaderSrc] = formatShaders(color);
    const vertexShader = compileShader(gl, vertexShaderSrc, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    // program linking failed
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking failed: ', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
};
// Renders caustic ripple background.
const renderBackground = (el, color)=>{
    try {
        // canvas and gl context
        if (!el) throw new Error('Canvas element not found.');
        const gl = el.getContext('webgl', {
            alpha: true
        });
        if (!gl) throw new Error('WebGL not supported.');
        // compile program
        const program = createProgram(gl, color);
        // position buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1,
            -1,
            1,
            -1,
            -1,
            1,
            1,
            1
        ]), gl.STATIC_DRAW);
        // window resize
        const resizeCanvas = ()=>{
            el.width = window.innerWidth;
            el.height = window.innerHeight;
            gl.viewport(0, 0, el.width, el.height);
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        // model mesh
        const drawFullscreenQuad = ()=>{
            const posLocation = gl.getAttribLocation(program, 'position');
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.enableVertexAttribArray(posLocation);
            gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        // render loop
        const render = (time)=>{
            time *= 0.0005;
            gl.useProgram(program);
            gl.uniform1f(gl.getUniformLocation(program, 'time'), time);
            gl.uniform2f(gl.getUniformLocation(program, 'resolution'), el.width, el.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            drawFullscreenQuad();
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    } catch (err) {
        console.error(err);
    }
};
const Background = ()=>{
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            renderBackground(canvasRef.current, 'vec3(0.22, 0.75, 0.95)');
        } catch (e) {
            console.error(e);
        }
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 w-screen h-screen bg-gray-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            className: "w-full h-full"
        }, void 0, false, {
            fileName: "[project]/src/components/Background.tsx",
            lineNumber: 168,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Background.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Background;
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Background$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Background.tsx [app-rsc] (ecmascript)");
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Background$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__eb55fc41._.js.map