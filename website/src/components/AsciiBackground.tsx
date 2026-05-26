'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────────────────
   Nav — rendered into a 2D canvas using the exact same CW×CH grid as
   the ASCII shader, so the letters are genuinely part of the background.
───────────────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: '/',                         label: 'home'  },
  { href: '/shelf',                    label: 'shelf' },
  { href: '/michael_vaden_resume.pdf', label: 'cv'    },
]
const NAV_ROW       = 1   // which cell row the nav sits on
const NAV_R_MARGIN  = 2   // cells from the right edge
const NAV_GAP       = 3   // empty cells between items
// Shader bg: vec3(0.04) ≈ #0a0a0a
const NAV_BG       = '#0a0a0a'
// chars used during scramble — same ASCII density set
const SCRAMBLE_SRC = '.,:;|!+*#@%'
// Modern monospace stack — no Courier New
const MONO = `'SF Mono', ui-monospace, 'Cascadia Mono', 'Consolas', 'Menlo', monospace`

/* ─────────────────────────────────────────────────────────────────────────
   Hero — two lines drawn on the 2D canvas, centered in the first viewport.
   rowFraction: position as a fraction of total cell rows (0 = top, 1 = bottom).
───────────────────────────────────────────────────────────────────────── */
const HERO_LINES: { text: string; rowFraction: number; color: string }[] = [
  { text: 'MICHAEL VADEN',      rowFraction: 0.42, color: '#ffffff' },
  { text: 'software / ai / cs', rowFraction: 0.50, color: '#4a4a4a' },
]

interface ScrambleItem {
  chars: { timer: number }[]  // timer > 0 = still scrambling this position
  done:  boolean
}

function tickScrambles(scrambles: Map<string, ScrambleItem>, dt: number) {
  for (const sc of scrambles.values()) {
    if (sc.done) continue
    let allSettled = true
    for (const ch of sc.chars) {
      if (ch.timer > 0) { ch.timer -= dt; allSettled = false }
    }
    if (allSettled) sc.done = true
  }
}

/**
 * draw2D — renders everything on the 2D overlay canvas each frame.
 *   • clears the whole canvas (transparent = WebGL shows through)
 *   • draws hero lines (centered, fade out with scroll)
 *   • draws nav links (top-right, always visible)
 */
function draw2D(
  ctx: CanvasRenderingContext2D,
  logicalW: number,
  logicalH: number,
  dpr: number,
  heroOpacity: number,
  scrambles: Map<string, ScrambleItem>,
) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, logicalW, logicalH)
  ctx.font          = `${CH - 2}px ${MONO}`
  ctx.textBaseline  = 'top'

  const cols = Math.floor(logicalW / CW)
  const rows = Math.floor(logicalH / CH)

  // ── Hero lines ─────────────────────────────────────────────────────────
  if (heroOpacity > 0.005) {
    ctx.globalAlpha = heroOpacity

    HERO_LINES.forEach(({ text, rowFraction, color }, li) => {
      const row  = Math.round(rows * rowFraction)
      const col0 = Math.floor((cols - text.length) / 2)
      const y    = row * CH
      const sc   = scrambles.get(`hero-${li}`)

      for (let c = 0; c < text.length; c++) {
        const x = (col0 + c) * CW
        ctx.fillStyle = NAV_BG
        ctx.fillRect(x, y, CW, CH)
        ctx.fillStyle = color
        const scrambling = sc && !sc.done && sc.chars[c].timer > 0
        ctx.fillText(
          scrambling ? SCRAMBLE_SRC[Math.floor(Math.random() * SCRAMBLE_SRC.length)] : text[c],
          x, y + 1,
        )
      }
    })

    ctx.globalAlpha = 1
  }

  // ── Nav links ─────────────────────────────────────────────────────────
  const y_nav    = NAV_ROW * CH
  let   rightCell = cols - NAV_R_MARGIN

  for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
    const { href, label } = NAV_ITEMS[i]
    const col0 = rightCell - label.length
    const sc   = scrambles.get(href)

    for (let c = 0; c < label.length; c++) {
      const x = (col0 + c) * CW
      ctx.fillStyle = NAV_BG
      ctx.fillRect(x, y_nav, CW, CH)
      ctx.fillStyle = '#ffffff'
      const scrambling = sc && !sc.done && sc.chars[c].timer > 0
      ctx.fillText(
        scrambling ? SCRAMBLE_SRC[Math.floor(Math.random() * SCRAMBLE_SRC.length)] : label[c],
        x, y_nav + 1,
      )
    }

    rightCell = col0 - NAV_GAP
  }
}

/** Compute CSS `right` pixel offset + width for each nav item hit-area. */
function navHitAreas() {
  const out: { href: string; rightPx: number; widthPx: number }[] = []
  let rightCells = NAV_R_MARGIN
  for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
    const { href, label } = NAV_ITEMS[i]
    out.unshift({ href, rightPx: rightCells * CW, widthPx: label.length * CW })
    rightCells += label.length + NAV_GAP
  }
  return out
}

/* ─────────────────────────────────────────────────────────────────────────
   ASCII char density set — sparse (dark) → dense (bright)
───────────────────────────────────────────────────────────────────────── */
const CHARS      = ' .,:;|!+*#@%'
const CHAR_COUNT = CHARS.length   // 12
const CW = 9                      // font atlas cell width  (px)
const CH = 16                     // font atlas cell height (px)

/* ─────────────────────────────────────────────────────────────────────────
   Particle + annihilation constants
───────────────────────────────────────────────────────────────────────── */
const N_PARTICLES              = 6
const MAX_EXPLOSIONS     = 4
const ATTRACT_RADIUS     = 0.22   // UV — magnetic pull starts here
const ANNIHILATE_RADIUS  = 0.012  // UV — collision trigger (must be visually overlapping)
const EXPLOSION_DURATION = 1.6   // seconds
const RESPAWN_DELAY      = 2.6   // seconds before dead particle respawn
const FADE_IN_DURATION   = 1.5   // seconds for respawned particle to fade in

/* ─────────────────────────────────────────────────────────────────────────
   Shared full-screen quad vertex shader
───────────────────────────────────────────────────────────────────────── */
const VERT = `
  attribute vec2 aPos;
  varying   vec2 vUV;
  void main() {
    vUV         = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`

/* ─────────────────────────────────────────────────────────────────────────
   Pass 1 — accumulation (RGB output for colorful explosions)
     • animated Perlin noise base layer
     • decay previous frame trail (preserves explosion afterglow color)
     • particle gaussian glow
     • annihilation explosions: expanding rings + spokes + rainbow ASCII
───────────────────────────────────────────────────────────────────────── */
const makeAccumFrag = (n: number, maxExp: number) => `
  precision highp float;
  varying   vec2      vUV;
  uniform   sampler2D uPrev;
  uniform   float     uDecay;
  uniform   vec2      uRes;
  uniform   vec2      uParticle[${n}];
  uniform   float     uParticleAlpha[${n}];
  uniform   float     uSigma;
  uniform   float     uTime;
  uniform   vec3      uExplosions[${maxExp}];

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                  hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p  = p * 2.1 + vec2(5.7, 3.4);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3  prev = texture2D(uPrev, vUV).rgb * uDecay;
    float ar   = uRes.x / uRes.y;

    // animated noise base — slow drift
    vec2  np       = vUV * vec2(ar * 2.5, 2.5) + vec2(uTime * 0.06, uTime * 0.04);
    float noiseVal = fbm(np) * 0.72;

    // particle gaussian glow (scaled by per-particle alpha for fade-in)
    float g = 0.0;
    for (int i = 0; i < ${n}; i++) {
      vec2 d  = vUV - uParticle[i];
      d.x    *= ar;
      g       = max(g, exp(-dot(d, d) / (uSigma * uSigma)) * uParticleAlpha[i]);
    }

    // merge prev (keeps explosion color on decay) with new grayscale floor
    float gray  = max(noiseVal, g);
    vec3  color = max(prev, vec3(gray));

    // ── annihilation explosions ──────────────────────────────────────
    for (int i = 0; i < ${maxExp}; i++) {
      float age    = uExplosions[i].z;
      float active = step(0.0, age);          // 0 when inactive (age < 0)

      vec2  center = uExplosions[i].xy;
      vec2  d      = vUV - center;
      d.x         *= ar;
      float r      = length(d);
      float theta  = atan(d.y, d.x);
      float fade   = 1.0 - age;

      // central white flash — gone within ~0.25 s
      float flash = exp(-r * r / 0.0004)
                  * max(1.0 - age * 6.0, 0.0) * 7.0;

      // three expanding rings at different radii + widths
      float w2    = 0.007 * 0.007;
      float ring1 = exp(-pow(r - 0.24 * age, 2.0) / w2)          * fade * 1.8;
      float ring2 = exp(-pow(r - 0.15 * age, 2.0) / (w2 * 0.64)) * fade * 1.4;
      float ring3 = exp(-pow(r - 0.36 * age, 2.0) / (w2 * 2.25)) * fade * 1.0;

      // rotating spokes — fade after first 40% of lifetime
      float spoke = max(0.0, cos(theta * 7.0 + uTime * 5.0))
                  * exp(-r * r / 0.012)
                  * max(1.0 - age * 2.5, 0.0) * 2.5;

      // rainbow colors: hue varies by ring, radius, and time
      float hueBase = float(i) * 0.37 + age * 2.5;
      float h1 = fract(hueBase           + r * 3.0);
      float h2 = fract(hueBase + 0.33    + r * 4.0);
      float h3 = fract(hueBase + 0.66    + r * 2.5);
      float hs = fract(hueBase + theta / 6.28318 + age * 1.2);

      vec3 ec = vec3(0.0);
      ec += hsv2rgb(vec3(h1, 1.0, 1.0)) * ring1;
      ec += hsv2rgb(vec3(h2, 1.0, 1.0)) * ring2;
      ec += hsv2rgb(vec3(h3, 1.0, 1.0)) * ring3;
      ec += hsv2rgb(vec3(hs, 0.8, 1.0)) * spoke;
      ec += vec3(flash);

      color = max(color, ec * active);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`

/* ─────────────────────────────────────────────────────────────────────────
   Pass 2 — ASCII: sample accumulated FBO brightness → char atlas lookup
   sc.rgb carries explosion color, so ASCII chars light up in wild colors.
───────────────────────────────────────────────────────────────────────── */
const ASCII_FRAG = `
  precision mediump float;
  varying   vec2      vUV;
  uniform   sampler2D uScene;
  uniform   sampler2D uFont;
  uniform   vec2      uRes;
  uniform   vec2      uCell;
  uniform   float     uNChars;

  void main() {
    vec2  px   = vUV * uRes;
    vec2  cell = floor(px / uCell);
    vec2  frac = fract(px / uCell);

    vec2  cUV  = (cell * uCell + uCell * 0.5) / uRes;
    vec4  sc   = texture2D(uScene, cUV);
    float lum  = dot(sc.rgb, vec3(0.299, 0.587, 0.114));
    float idx  = floor(lum * (uNChars - 1.0));

    vec2  fontUV;
    fontUV.x   = (idx + frac.x) / uNChars;
    fontUV.y   = 1.0 - frac.y;
    float mask = texture2D(uFont, fontUV).r;

    vec3 bg    = vec3(0.04, 0.04, 0.04);
    gl_FragColor = vec4(mix(bg, sc.rgb, mask), 1.0);
  }
`

/* ─────────────────────────────────────────────────────────────────────────
   WebGL helpers
───────────────────────────────────────────────────────────────────────── */
type GL = WebGLRenderingContext

function compile(gl: GL, src: string, type: number): WebGLShader {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src); gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error('Shader:', gl.getShaderInfoLog(s))
  return s
}

function program(gl: GL, vert: string, frag: string): WebGLProgram {
  const p = gl.createProgram()!
  gl.attachShader(p, compile(gl, vert, gl.VERTEX_SHADER))
  gl.attachShader(p, compile(gl, frag, gl.FRAGMENT_SHADER))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    console.error('Program:', gl.getProgramInfoLog(p))
  return p
}

function quadBuf(gl: GL): WebGLBuffer {
  const b = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, b)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
  return b
}

function bindQuad(gl: GL, prog: WebGLProgram, buf: WebGLBuffer) {
  const loc = gl.getAttribLocation(prog, 'aPos')
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
}

function u(gl: GL, prog: WebGLProgram, name: string) {
  return gl.getUniformLocation(prog, name)
}

function makeFontTex(gl: GL, dpr: number): WebGLTexture {
  // Scale the atlas by dpr so each glyph is rendered at native screen resolution
  const sCW = Math.round(CW * dpr)
  const sCH = Math.round(CH * dpr)
  const c = document.createElement('canvas')
  c.width = CHAR_COUNT * sCW; c.height = sCH
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = '#fff'
  ctx.font = `${sCH - Math.round(2 * dpr)}px ${MONO}`
  ctx.textBaseline = 'top'
  for (let i = 0; i < CHAR_COUNT; i++) ctx.fillText(CHARS[i], i * sCW, Math.round(dpr))
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return tex
}

function makeFBO(gl: GL, w: number, h: number) {
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const fbo = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { fbo, tex }
}

/* ─────────────────────────────────────────────────────────────────────────
   Particle particles
───────────────────────────────────────────────────────────────────────── */
interface Particle {
  x: number; y: number
  heading:     number
  speed:       number
  baseSpeed:   number
  turnPhase:   number
  turnFreq:    number
  turnAmp:     number
  dead:        boolean
  respawnTimer: number   // seconds remaining before respawn
  alpha:       number    // 0→1 fade-in opacity
}

interface Explosion {
  x:   number
  y:   number
  age: number   // 0→1 while active; <0 = inactive slot
}

function spawnParticle(): Particle[] {
  return [
    { x: 0.20, y: 0.30, heading:  0.40, speed: 0.00088, baseSpeed: 0.00088, turnPhase: 0.0, turnFreq: 0.016, turnAmp: 0.042, dead: false, respawnTimer: 0, alpha: 1.0 },
    { x: 0.70, y: 0.60, heading:  2.10, speed: 0.00078, baseSpeed: 0.00078, turnPhase: 1.2, turnFreq: 0.011, turnAmp: 0.055, dead: false, respawnTimer: 0, alpha: 1.0 },
    { x: 0.50, y: 0.15, heading: -0.80, speed: 0.00093, baseSpeed: 0.00093, turnPhase: 2.5, turnFreq: 0.018, turnAmp: 0.038, dead: false, respawnTimer: 0, alpha: 1.0 },
    { x: 0.85, y: 0.20, heading:  3.50, speed: 0.00083, baseSpeed: 0.00083, turnPhase: 0.8, turnFreq: 0.014, turnAmp: 0.048, dead: false, respawnTimer: 0, alpha: 1.0 },
    { x: 0.15, y: 0.75, heading:  1.30, speed: 0.00073, baseSpeed: 0.00073, turnPhase: 3.7, turnFreq: 0.009, turnAmp: 0.062, dead: false, respawnTimer: 0, alpha: 1.0 },
    { x: 0.60, y: 0.85, heading:  5.00, speed: 0.00093, baseSpeed: 0.00093, turnPhase: 2.0, turnFreq: 0.020, turnAmp: 0.040, dead: false, respawnTimer: 0, alpha: 1.0 },
  ]
}

function randomParticle(): Particle {
  const s = 0.00073 + Math.random() * 0.00022
  return {
    x:           0.15 + Math.random() * 0.70,
    y:           0.15 + Math.random() * 0.70,
    heading:     Math.random() * Math.PI * 2,
    speed:       s,
    baseSpeed:   s,
    turnPhase:   Math.random() * Math.PI * 2,
    turnFreq:    0.009 + Math.random() * 0.011,
    turnAmp:     0.038 + Math.random() * 0.025,
    dead:        false,
    respawnTimer: 0,
    alpha:        0.0,   // starts invisible, fades in
  }
}

function stepParticle(
  particle: Particle[],
  mx: number, my: number,
  scale: number,
  dt: number,
  explosions: Explosion[],
) {
  // Reset speeds so attraction boosts don't compound across frames; advance fade-in
  for (const p of particle) {
    if (!p.dead) {
      p.speed = p.baseSpeed
      p.alpha = Math.min(1.0, p.alpha + dt / FADE_IN_DURATION)
    }
  }

  // ── move each live particle, tick respawn for dead ──────────────────────
  for (const p of particle) {
    if (p.dead) {
      p.respawnTimer -= dt
      if (p.respawnTimer <= 0) Object.assign(p, randomParticle())
      continue
    }

    p.heading   += p.turnAmp  * Math.sin(p.turnPhase) * scale
    p.turnPhase += p.turnFreq * scale

    // cursor gravity — gentle pull from any distance, fades with distance like gravity
    if (mx >= 0) {
      const dx = mx - p.x, dy = my - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 0.001) {
        const target = Math.atan2(dy, dx)
        let diff = target - p.heading
        while (diff >  Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        // falloff: ~0.18 when very close, ~0.05 at mid-range, ~0.02 at far edge
        p.heading += diff * (0.022 / (dist + 0.12)) * scale
      }
    }

    let nx = p.x + Math.cos(p.heading) * p.speed * scale
    let ny = p.y + Math.sin(p.heading) * p.speed * scale

    if      (nx < 0.01) { nx = 0.01; p.heading = Math.PI - p.heading }
    else if (nx > 0.99) { nx = 0.99; p.heading = Math.PI - p.heading }
    if      (ny < 0.01) { ny = 0.01; p.heading = -p.heading }
    else if (ny > 0.99) { ny = 0.99; p.heading = -p.heading }

    p.x = nx; p.y = ny
  }

  // ── pairwise: magnetic attraction + annihilation ───────────────────
  for (let i = 0; i < particle.length; i++) {
    if (particle[i].dead) continue
    for (let j = i + 1; j < particle.length; j++) {
      if (particle[j].dead) continue

      const dx   = particle[j].x - particle[i].x
      const dy   = particle[j].y - particle[i].y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < ANNIHILATE_RADIUS) {
        // ── annihilation ──
        const ex = (particle[i].x + particle[j].x) * 0.5
        const ey = (particle[i].y + particle[j].y) * 0.5

        // claim a free explosion slot
        const slot = explosions.findIndex(e => e.age < 0)
        if (slot >= 0) explosions[slot] = { x: ex, y: ey, age: 0 }

        particle[i].dead = true; particle[i].respawnTimer = RESPAWN_DELAY
        particle[i].x = -2;      particle[i].y = -2        // move off-screen
        particle[j].dead = true; particle[j].respawnTimer = RESPAWN_DELAY
        particle[j].x = -2;      particle[j].y = -2
        break  // particle[i] is gone — skip remaining j pairs

      } else if (dist < ATTRACT_RADIUS) {
        // ── spiral pull ──
        // strength 0→1 as dist closes in; cubic easing for snappier approach
        const strength = Math.pow((ATTRACT_RADIUS - dist) / ATTRACT_RADIUS, 1.5)

        // Orbital offset: large tangential kick when far (wide spiral),
        // fades to 0 when very close so they actually collide.
        // The +π/2 makes both particle orbit CCW around the midpoint.
        const orbitalOffset = (Math.PI * 0.72) * Math.pow(1.0 - strength, 0.7)

        const aij = Math.atan2(dy, dx)

        // steer i → j + tangential kick
        let di = (aij + orbitalOffset) - particle[i].heading
        while (di >  Math.PI) di -= Math.PI * 2
        while (di < -Math.PI) di += Math.PI * 2
        particle[i].heading += di * 0.30 * strength * scale

        // steer j → i + tangential kick (same rotational direction)
        let dj = (aij + Math.PI + orbitalOffset) - particle[j].heading
        while (dj >  Math.PI) dj -= Math.PI * 2
        while (dj < -Math.PI) dj += Math.PI * 2
        particle[j].heading += dj * 0.30 * strength * scale

        // wild speed boost — they race toward the spiral
        const boost = particle[i].baseSpeed * (1.0 + strength * 6.0)
        particle[i].speed = Math.max(particle[i].speed, boost)
        particle[j].speed = Math.max(particle[j].speed, boost)
      }
    }
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────── */
export default function AsciiBackground() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const canvas2dRef = useRef<HTMLCanvasElement>(null)
  const scrambleRef = useRef<Map<string, ScrambleItem>>(new Map())
  const scrollRef   = useRef(0)
  const pathname    = usePathname()

  useEffect(() => {
    const canvas   = canvasRef.current
    const canvas2d = canvas2dRef.current
    if (!canvas || !canvas2d) return

    const gl  = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false })
    const ctx = canvas2d.getContext('2d')
    if (!gl || !ctx) return

    // Cap at 2× — beyond that the extra pixels aren't visible but are expensive
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const accumProg = program(gl, VERT, makeAccumFrag(N_PARTICLES, MAX_EXPLOSIONS))
    const asciiProg = program(gl, VERT, ASCII_FRAG)
    const buf       = quadBuf(gl)
    const fontTex   = makeFontTex(gl, dpr)

    let prev: ReturnType<typeof makeFBO> | null = null
    let cur:  ReturnType<typeof makeFBO> | null = null
    let W = 0, H = 0, lW = 0, lH = 0   // W/H = physical, lW/lH = logical CSS

    const resize = () => {
      lW = window.innerWidth
      lH = window.innerHeight
      W  = Math.round(lW * dpr)
      H  = Math.round(lH * dpr)
      canvas.width  = W; canvas.height  = H
      canvas2d.width = W; canvas2d.height = H
      if (prev) { gl.deleteFramebuffer(prev.fbo); gl.deleteTexture(prev.tex) }
      if (cur)  { gl.deleteFramebuffer(cur.fbo);  gl.deleteTexture(cur.tex)  }
      prev = makeFBO(gl, W, H)
      cur  = makeFBO(gl, W, H)
      for (const f of [prev, cur]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo)
        gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT)
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
    window.addEventListener('resize', resize)
    resize()

    const particle          = spawnParticle()
    const particleBuf       = new Float32Array(N_PARTICLES * 2)
    const particleAlphaBuf  = new Float32Array(N_PARTICLES)
    const explosionBuf = new Float32Array(MAX_EXPLOSIONS * 3)
    const explosions: Explosion[] = Array.from({ length: MAX_EXPLOSIONS }, () => ({ x: 0, y: 0, age: -1 }))

    const mouse   = { x: -1, y: -1 }
    const onMove  = (e: MouseEvent) => { mouse.x = e.clientX / lW; mouse.y = 1 - e.clientY / lH }
    const onLeave = () => { mouse.x = -1; mouse.y = -1 }
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('scroll',     onScroll, { passive: true })

    // Hero scramble: each line decodes in after a short delay, staggered
    const heroInit = setTimeout(() => {
      HERO_LINES.forEach(({ text }, li) => {
        scrambleRef.current.set(`hero-${li}`, {
          chars: text.split('').map((_, i) => ({ timer: li * 0.55 + i * 0.04 })),
          done:  false,
        })
      })
    }, 350)

    const aU = {
      prev:       u(gl, accumProg, 'uPrev'),
      decay:      u(gl, accumProg, 'uDecay'),
      res:        u(gl, accumProg, 'uRes'),
      particle:        u(gl, accumProg, 'uParticle'),
      particleAlpha:   u(gl, accumProg, 'uParticleAlpha'),
      sigma:      u(gl, accumProg, 'uSigma'),
      time:       u(gl, accumProg, 'uTime'),
      explosions: u(gl, accumProg, 'uExplosions'),
    }
    const sU = {
      scene:  u(gl, asciiProg, 'uScene'),
      font:   u(gl, asciiProg, 'uFont'),
      res:    u(gl, asciiProg, 'uRes'),
      cell:   u(gl, asciiProg, 'uCell'),
      nchars: u(gl, asciiProg, 'uNChars'),
    }

    let raf = 0, lastTs = 0

    const render = (ts: number) => {
      raf = requestAnimationFrame(render)
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts
      if (!prev || !cur) return

      for (const exp of explosions) {
        if (exp.age >= 0) {
          exp.age += dt / EXPLOSION_DURATION
          if (exp.age >= 1.0) exp.age = -1
        }
      }

      const scale = dt * 60
      stepParticle(particle, mouse.x, mouse.y, scale, dt, explosions)

      for (let i = 0; i < N_PARTICLES; i++) {
        particleBuf[i * 2]     = particle[i].x
        particleBuf[i * 2 + 1] = particle[i].y
        particleAlphaBuf[i]    = particle[i].alpha
      }
      for (let i = 0; i < MAX_EXPLOSIONS; i++) {
        explosionBuf[i * 3]     = explosions[i].x
        explosionBuf[i * 3 + 1] = explosions[i].y
        explosionBuf[i * 3 + 2] = explosions[i].age
      }

      const decay = Math.pow(0.972, scale)

      // ── pass 1: accumulate ───────────────────────────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, cur.fbo)
      gl.viewport(0, 0, W, H)
      gl.useProgram(accumProg)
      bindQuad(gl, accumProg, buf)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, prev.tex)
      gl.uniform1i(aU.prev!,        0)
      gl.uniform1f(aU.decay!,       decay)
      gl.uniform2f(aU.res!,         W, H)
      gl.uniform1f(aU.sigma!,       0.022)
      gl.uniform2fv(aU.particle!,        particleBuf)
      gl.uniform1fv(aU.particleAlpha!,   particleAlphaBuf)
      gl.uniform1f(aU.time!,        ts / 1000)
      gl.uniform3fv(aU.explosions!, explosionBuf)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      // ── pass 2: ASCII → screen ───────────────────────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, W, H)
      gl.useProgram(asciiProg)
      bindQuad(gl, asciiProg, buf)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, cur.tex)
      gl.uniform1i(sU.scene!, 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, fontTex)
      gl.uniform1i(sU.font!,   1)
      gl.uniform2f(sU.res!,    W, H)
      gl.uniform2f(sU.cell!,   CW * dpr, CH * dpr)
      gl.uniform1f(sU.nchars!, CHAR_COUNT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      const tmp = prev; prev = cur; cur = tmp

      // ── 2D canvas: tick scrambles + draw hero + nav ──────────────────
      tickScrambles(scrambleRef.current, dt)
      const heroOpacity = Math.max(0, 1 - scrollRef.current / (lH * 0.35))
      draw2D(ctx, lW, lH, dpr, heroOpacity, scrambleRef.current)
    }

    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(heroInit)
      window.removeEventListener('resize',     resize)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('scroll',     onScroll)
      if (prev) { gl.deleteFramebuffer(prev.fbo); gl.deleteTexture(prev.tex) }
      if (cur)  { gl.deleteFramebuffer(cur.fbo);  gl.deleteTexture(cur.tex)  }
    }
  }, [])

  // Precompute hit-area positions (static — does not depend on W)
  const hitAreas = navHitAreas()

  return (
    <>
      {/* WebGL + 2D nav canvas — behind everything */}
      <div className="fixed inset-0 -z-10" style={{ background: '#080808' }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        <canvas
          ref={canvas2dRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{ zIndex: 1 }}
        />
      </div>

      {/* Link hit-areas — separate fixed layer so -z-10 stacking context can't trap them */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10000 }}>
        {hitAreas.map(({ href, rightPx, widthPx }) => {
          const label = NAV_ITEMS.find(it => it.href === href)!.label
          return (
            <Link
              key={href}
              href={href}
              aria-label={href}
              className="absolute pointer-events-auto"
              style={{
                right:   rightPx,
                top:     NAV_ROW * CH,
                width:   widthPx,
                height:  CH,
                opacity: 0,   // invisible — visual lives on the 2D canvas
              }}
              onMouseEnter={() => {
                scrambleRef.current.set(href, {
                  chars: label.split('').map((_, i) => ({ timer: 0.28 + i * 0.07 })),
                  done:  false,
                })
              }}
            />
          )
        })}
      </div>
    </>
  )
}
