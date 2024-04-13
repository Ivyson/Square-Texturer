let image = document.querySelector('img');
image.style.display = 'none';
let dbody = document.querySelector('body');
dbody.style.height = window.innerHeight+'px';
dbody.style.width = "100%";
let canvas = document.querySelector('canvas');
canvas.style.backgroundColor = 'blue';
let webgl = canvas.getContext('webgl');
webgl.clearColor(1.0, 0.0, 0.0, 1.0); //Red
webgl.clear(webgl.COLOR_BUFFER_BIT || webgl.DEPTH_BUFFER_BIT);
let vertices = new Float32Array([
    -0.5, -0.5,
    -0.5, 0.5,
    0.5, -0.5,
    0.5,0.5,
    0.5, -0.5,
    -0.5, 0.5
]);

let buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

let texCordinates = new Float32Array([
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 1.0
]);

let cordbuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, cordbuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, texCordinates, webgl.STATIC_DRAW);

//Texture Things
let Texturet = webgl.createTexture();
webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true); //This flips the image orientation to be upright.
webgl.activeTexture(webgl.TEXTURE0);
webgl.bindTexture(webgl.TEXTURE_2D, Texturet);
webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image);




let vsShader = `
precision highp float;
attribute vec2 vecposition;
attribute vec2 vTexture;
varying highp vec2 fTexture;
void main(){
    fTexture = vTexture;
    gl_Position = vec4(vecposition, 0.0, 1.0);
    gl_PointSize = 10.0;
}
`;
let fsShader = `
precision highp float;
varying highp vec2 fTexture;
uniform sampler2D fSampler;
void main()
{
    // gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    gl_FragColor = texture2D(fSampler, fTexture);
}
`;

let vShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vShader, vsShader);
webgl.compileShader(vShader);

let fShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fShader, fsShader);
webgl.compileShader(fShader);

let program = webgl.createProgram();
webgl.attachShader(program, vShader);
webgl.attachShader(program, fShader);
webgl.linkProgram(program);
webgl.useProgram(program);
if(!webgl.getProgramParameter(program, webgl.LINK_STATUS))
{
    console.log('Error Found :',webgl.getProgramInfoLog(program));
}

let Position = webgl.getAttribLocation(program, 'vecposition');
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
console.log(Position);
webgl.enableVertexAttribArray(Position);
webgl.vertexAttribPointer(Position, 2, webgl.FLOAT, false, 0, 0);

webgl.bindBuffer(webgl.ARRAY_BUFFER, cordbuffer);
let tPosition =  webgl.getAttribLocation(program, 'vTexture');
console.log(tPosition,"Texture");
webgl.enableVertexAttribArray(tPosition);
webgl.vertexAttribPointer(tPosition, 2, webgl.FLOAT, false, 0, 0);

webgl.drawArrays(webgl.TRIANGLES, 0, 6);