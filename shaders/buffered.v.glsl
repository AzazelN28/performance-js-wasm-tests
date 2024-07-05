#version 300 es

precision highp float;

in vec3 u_data;
uniform vec2 u_resolution;

void main() {
  gl_PointSize = u_data.z;
  gl_Position = vec4((u_data.x / u_resolution.x - 0.5f) * 2.0f, (u_data.y / u_resolution.y - 0.5f) * 2.0f, 0.0f, 1.0f);
}
