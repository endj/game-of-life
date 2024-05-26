const vertexShaderSource = `
attribute vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
}
`;

function loadShader(gl, type, source) {
const shader = gl.createShader(type);
gl.shaderSource(shader, source);
gl.compileShader(shader);

if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ', gl.getProgramInfoLog(shaderProgram));
    return null;
}

return shaderProgram;
}

const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
alert('Unable to initialize WebGL. Your browser may not support it.');
}

const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

const programInfo = {
program: shaderProgram,
attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
},
};

const vertices1 = [
-0.5,  0.5, // Top left
 0.0,  0.5, // Top right
 0.0, -0.5, // Bottom right
-0.5, -0.5, // Bottom left
];

const vertices2 = [
 0.0,  0.5, // Top left
 0.5,  0.5, // Top right
 0.5, -0.5, // Bottom right
 0.0, -0.5, // Bottom left
];

const positionBuffer1 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);

const positionBuffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(programInfo.program);

// Draw the first rectangle
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1);
gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices1.length / 2);

// Draw the second rectangle
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices2.length / 2);