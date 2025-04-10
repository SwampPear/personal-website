const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 v_tex_coords;
void main() {
    v_tex_coords = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`

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
    float inten = .0025;

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
    vec3 fg = vec3(0.225, 0.125, 0.125);
    vec3 color = mix(bg, fg, pow(abs(c), 2.0));


    gl_FragColor = vec4(color, 1.0);
}`

export { VERTEX_SHADER, FRAGMENT_SHADER }