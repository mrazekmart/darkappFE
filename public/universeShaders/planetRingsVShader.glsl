/*
varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
*/
varying vec3 vNormal;
void main() {
    vNormal = normalize(normal);
    vec4 transformed = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = transformed;
}