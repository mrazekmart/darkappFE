#version 300 es

attribute vec3 position;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}