precision mediump float;

uniform float time;
uniform vec3 color;

void main() {
    vec2 uv = gl_FragCoord.xy;
    uv -= 0.5;

    float dist = length(uv);

    float ringStart = 0.3;
    float ringEnd = 0.5;
    float ringWidth = ringEnd - ringStart;

    float intensity = smoothstep(ringStart, ringStart + ringWidth, dist);
    intensity -= smoothstep(ringEnd - ringWidth, ringEnd, dist);

    gl_FragColor = vec4(color.x/255., color.y/255., color.z/255., 1.);
}
