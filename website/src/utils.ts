/**
 * Compiles a shader
 * @param gl Webgl instance
 * @param sourceCode shader source
 * @param shaderType shader type
 * @returns 
 */
const compileShader = ( gl: any, sourceCode: any, shaderType: any ) => {
    const shader = gl.createShader(shaderType)
    gl.shaderSource(shader, sourceCode)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed: ', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }

    return shader
}

/**
 * Creates the shader program
 * @param gl 
 * @param vertexShader 
 * @param fragmentShader 
 * @returns 
 */
const createProgram = (gl: any, vertexShader: any, fragmentShader: any) => {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking failed: ', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
    }

    return program
}

export { compileShader, createProgram }