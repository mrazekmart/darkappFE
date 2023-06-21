uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform samplerCube uPerlin;

void main() {
    gl_FragColor = textureCube(uPerlin, vPosition);
}