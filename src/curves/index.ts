import { CurveConfig } from "../hooks/useCurveAnimation";

export const curves: CurveConfig[] = [
  {
    name: "Astroid",
    tag: "4-Cusp Hypocycloid",
    rotate: false,
    particleCount: 60,
    trailSpan: 0.15,
    durationMs: 6000,
    rotationDurationMs: 0,
    pulseDurationMs: 4000,
    strokeWidth: 4.5,
    a: 40,
    b: 10,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      const a = config.a * detailScale;
      const b = config.b * detailScale;
      const x = (a - b) * Math.cos(t) + b * Math.cos(((a - b) / b) * t);
      const y = (a - b) * Math.sin(t) - b * Math.sin(((a - b) / b) * t);
      return { x: 50 + x, y: 50 + y };
    },
    mathFormula: [
      "x(t) = (a-b)cos(t) + b·cos((a-b)/b·t)",
      "y(t) = (a-b)sin(t) - b·sin((a-b)/b·t)",
      "a = 40, b = 10, t ∈ [0, 2π)"
    ],
    codeSnippet: `point(progress, detailScale, config) {
    const t = progress * Math.PI * 2;
    const a = config.a * detailScale;
    const b = config.b * detailScale;
    const x = (a - b) * Math.cos(t) + b * Math.cos(((a - b) / b) * t);
    const y = (a - b) * Math.sin(t) - b * Math.sin(((a - b) / b) * t);
    return { x: 50 + x, y: 50 + y };
  }`
  },
  {
    name: "Superformula Dial",
    tag: "Semantic : Morphing Dial",
    rotate: true,
    particleCount: 80,
    trailSpan: 0.16,
    durationMs: 5600,
    rotationDurationMs: 25000,
    pulseDurationMs: 4000,
    strokeWidth: 4.5,
    baseRadius: 32,
    m: 6,
    n1: 1,
    n2: 1,
    n3: 1,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      const m = config.m || 6;
      const n1 = config.n1 || 1;
      const n2 = config.n2 || 1;
      const n3 = config.n3 || 1;
      const t1 = Math.abs(Math.cos((m * t) / 4));
      const t2 = Math.abs(Math.sin((m * t) / 4));
      const r = Math.pow(Math.pow(t1, n2) + Math.pow(t2, n3), -1 / n1) * config.baseRadius;
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      return { x: 50 + x, y: 50 + y };
    },
    mathFormula: [
      "r(θ) = [|cos(mθ/4)/a|^n₂ + |sin(mθ/4)/b|^n₃]^(-1/n₁)",
      "m = 6, n₁ = 1, n₂ = 1, n₃ = 1",
      "Morphs circle into star/polygon"
    ],
    codeSnippet: `point(progress, detailScale, config) {
    const t = progress * Math.PI * 2;
    const t1 = Math.abs(Math.cos((config.m * t) / 4));
    const t2 = Math.abs(Math.sin((config.m * t) / 4));
    const r = Math.pow(Math.pow(t1, config.n2) + Math.pow(t2, config.n3), -1 / config.n1) * config.baseRadius;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    return { x: 50 + x, y: 50 + y };
  }`
  },
  {
    name: "Fourier Draw-in",
    tag: "Semantic : Epicycle DFT",
    rotate: false,
    particleCount: 90,
    trailSpan: 0.18,
    durationMs: 6200,
    rotationDurationMs: 0,
    pulseDurationMs: 4000,
    strokeWidth: 4.5,
    a: 28,
    b: 10,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      const x = config.a * Math.cos(t) + config.b * Math.cos(3 * t) + 5 * Math.cos(5 * t);
      const y = config.a * Math.sin(t) + config.b * Math.sin(3 * t) + 5 * Math.sin(5 * t);
      return { x: 50 + x, y: 50 + y };
    },
    mathFormula: [
      "f(t) = Σ cₙ·e^(i·2π·n·t/P)",
      "Rotating epicycle DFT harmonic arms",
      "a = 28, b = 10, Harmonics = 1, 3, 5"
    ],
    codeSnippet: `point(progress, detailScale, config) {
    const t = progress * Math.PI * 2;
    const x = config.a * Math.cos(t) + config.b * Math.cos(3 * t) + 5 * Math.cos(5 * t);
    const y = config.a * Math.sin(t) + config.b * Math.sin(3 * t) + 5 * Math.sin(5 * t);
    return { x: 50 + x, y: 50 + y };
  }`
  },
  {
    name: "Chladni Plate",
    tag: "Semantic : Standing Waves",
    rotate: true,
    particleCount: 85,
    trailSpan: 0.15,
    durationMs: 5800,
    rotationDurationMs: 22000,
    pulseDurationMs: 4000,
    strokeWidth: 4.5,
    baseRadius: 36,
    m: 3,
    n: 2,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      const wave = Math.sin(config.m * t) * Math.cos(config.n * t);
      const r = config.baseRadius * (0.8 + 0.2 * wave);
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      return { x: 50 + x, y: 50 + y };
    },
    mathFormula: [
      "sin(m·π·x)·sin(n·π·y) = 0 (Nodal Lines)",
      "Nodal standing wave plate frequency sweep",
      "m = 3, n = 2"
    ],
    codeSnippet: `point(progress, detailScale, config) {
    const t = progress * Math.PI * 2;
    const wave = Math.sin(config.m * t) * Math.cos(config.n * t);
    const r = config.baseRadius * (0.8 + 0.2 * wave);
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    return { x: 50 + x, y: 50 + y };
  }`
  },
  {
    name: "Network Grow",
    tag: "Semantic : Graph Growth",
    rotate: true,
    particleCount: 70,
    trailSpan: 0.16,
    durationMs: 5400,
    rotationDurationMs: 18000,
    pulseDurationMs: 3000,
    strokeWidth: 4.5,
    a: 32,
    b: 8,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      const node = Math.floor(progress * 5);
      const r = config.a + config.b * Math.sin(node * 2.5);
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      return { x: 50 + x, y: 50 + y };
    },
    mathFormula: [
      "Graph nodes spawn & connect at Poisson intervals",
      "r(t) = R₀ + ΔR·sin(node·2.5)",
      "a = 32, b = 8"
    ],
    codeSnippet: `point(progress, detailScale, config) {
    const t = progress * Math.PI * 2;
    const node = Math.floor(progress * 5);
    const r = config.a + config.b * Math.sin(node * 2.5);
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    return { x: 50 + x, y: 50 + y };
  }`
  },
  {
    name: "Möbius Trail",
    tag: "3D : Möbius Strip",
    rotate: true,
    particleCount: 80,
    trailSpan: 0.18,
    durationMs: 6000,
    rotationDurationMs: 24000,
    pulseDurationMs: 4000,
    strokeWidth: 4.5,
    baseRadius: 26,
    s: 10,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      const s = config.s * Math.cos(t / 2);
      const r = (config.baseRadius + s) * detailScale;
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      return { x: 50 + x, y: 50 + y };
    },
    mathFormula: [
      "x(t) = [R + s·cos(t/2)]cos(t)",
      "y(t) = [R + s·cos(t/2)]sin(t)",
      "Non-orientable single-sided surface trace"
    ],
    codeSnippet: `point(progress, detailScale, config) {
    const t = progress * Math.PI * 2;
    const s = config.s * Math.cos(t / 2);
    const r = (config.baseRadius + s) * detailScale;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    return { x: 50 + x, y: 50 + y };
  }`
  },
  {
    name: "Lorenz Attractor Ribbon",
    tag: "3D : Chaotic Attractor",
    rotate: true,
    particleCount: 95,
    trailSpan: 0.20,
    durationMs: 7000,
    rotationDurationMs: 30000,
    pulseDurationMs: 4000,
    strokeWidth: 4.5,
    ra: 28,
    rb: 14,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      const x = config.ra * Math.sin(t) + config.rb * Math.sin(3 * t);
      const y = config.ra * Math.cos(t) - config.rb * Math.cos(2 * t);
      return { x: 50 + x, y: 50 + y };
    },
    mathFormula: [
      "dx/dt = σ(y-x), dy/dt = x(ρ-z)-y, dz/dt = xy-βz",
      "σ = 10, ρ = 28, β = 8/3",
      "Butterfly chaotic attractor trajectory"
    ],
    codeSnippet: `point(progress, detailScale, config) {
    const t = progress * Math.PI * 2;
    const x = config.ra * Math.sin(t) + config.rb * Math.sin(3 * t);
    const y = config.ra * Math.cos(t) - config.rb * Math.cos(2 * t);
    return { x: 50 + x, y: 50 + y };
  }`
  },
  {
    name: "Ferrotorus",
    tag: "3D : Ferrofluid Ring",
    rotate: true,
    particleCount: 75,
    trailSpan: 0.16,
    durationMs: 5200,
    rotationDurationMs: 20000,
    pulseDurationMs: 3500,
    strokeWidth: 4.5,
    baseRadius: 30,
    rm: 12,
    spikes: 8,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      const spike = Math.abs(Math.sin(config.spikes * t));
      const r = (config.baseRadius + config.rm * Math.pow(spike, 1.5)) * detailScale;
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      return { x: 50 + x, y: 50 + y };
    },
    mathFormula: [
      "r(θ) = R + Rₘ·|sin(n·θ)|^1.5",
      "Rosensweig magnetic instability spikes",
      "R = 30, Rₘ = 12, Spikes = 8"
    ],
    codeSnippet: `point(progress, detailScale, config) {
    const t = progress * Math.PI * 2;
    const spike = Math.abs(Math.sin(config.spikes * t));
    const r = (config.baseRadius + config.rm * Math.pow(spike, 1.5)) * detailScale;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    return { x: 50 + x, y: 50 + y };
  }`
  },

  // ── Geometry ─────────────────────────────────────────────────────────────
  {
    name: "Winding Spiral",
    tag: "Geometry : Inward Convergence",
    category: "geometry",
    type: "winding-spiral",
    rotate: false,
    particleCount: 1,
    trailSpan: 0.18,
    durationMs: 4000,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 4.0,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2 * 6;
      const r = 46 * (1 - progress);
      return { x: 50 + r * Math.cos(t), y: 50 + r * Math.sin(t) };
    },
    mathFormula: [
      "x(t) = (R - r·t)·cos(n·t)",
      "y(t) = (R - r·t)·sin(n·t)",
      "n = 6 turns, R = outer radius, r = R/T decay",
      "Bright dot sweeps inward, rewinds for indeterminate"
    ],
    codeSnippet: `// Implementation: Canvas parametric inward spiral
// x(t)=R(1-t)*cos(TURNS*2pi*t), fading trail sweep
// Ping-pong: inward then rewind for indeterminate mode`
  },
  {
    name: "Cymatics Ripple",
    tag: "Geometry : Bessel Nodal Rings",
    category: "geometry",
    type: "cymatics-ripple",
    rotate: false,
    particleCount: 7,
    trailSpan: 0.15,
    durationMs: 5000,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 3.5,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 35 * Math.cos(t), y: 50 + 35 * Math.sin(t) };
    },
    mathFormula: [
      "Nodal radii: J₀(kₙ·r) = 0 (Bessel zeros)",
      "rₙ = αₙ / k,  k = 2πf/c",
      "Animate: f sweeps f₀ -> f₁ over T (rings reorganize)",
      "Opacityₙ = 1 - n/N (inner rings brighter)"
    ],
    codeSnippet: `// Implementation: Canvas precomputed Bessel zeros
// alpha = [2.4048, 5.5201, 8.6537, 11.7915, 14.9309...]
// r_n = alpha_n / k, rings shift as frequency sweeps`
  },
  {
    name: "Gear Train",
    tag: "Geometry : Epicycloid Tooth Profile",
    category: "geometry",
    type: "gear-train",
    rotate: false,
    particleCount: 3,
    trailSpan: 0.15,
    durationMs: 4000,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 3.5,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 30 * Math.cos(t), y: 50 + 30 * Math.sin(t) };
    },
    mathFormula: [
      "ω₁·N₁ = ω₂·N₂ (gear ratio law)",
      "Tooth tip: epicycloid, Tooth root: hypocycloid",
      "Module m: R = N·m/2, Ra = R+m, Rd = R-1.25m",
      "N = 10 / 15 / 22 teeth, correct mesh alignment"
    ],
    codeSnippet: `// Implementation: Canvas gear tooth bezier profile
// omega_i inversely proportional to tooth count
// theta2 = -theta1*N1/N2 (external gear mesh offset)`
  },

  // ── Particles ────────────────────────────────────────────────────────────
  {
    name: "Voronoi Pulse",
    tag: "Particles : Dynamic Tessellation",
    category: "particles",
    type: "voronoi",
    rotate: false,
    particleCount: 10,
    trailSpan: 0.15,
    durationMs: 4000,
    rotationDurationMs: 0,
    pulseDurationMs: 4000,
    strokeWidth: 3.5,
    pulseAmp: 0.45,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      const r = (28 + 6 * Math.sin(5 * t)) * detailScale;
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      return { x: 50 + x, y: 50 + y };
    },
    mathFormula: [
      "Seeds drift: p_i(t) = p_{i0} + v_i·t",
      "Fortune's algo -> Weighted cell edges",
      "Cell pulse scaling: S_i(t) = sin(t + i·φ)",
      "Highlights nearest boundary restructuring frame-by-frame"
    ],
    codeSnippet: `// Implementation: Canvas 2D Weighted Voronoi Tessellation
// Seed points p_i drift dynamically across frames.
// Cell sizes & boundaries pulse via sin(t + i*phi).`
  },
  {
    name: "Sand Timer Hourglass",
    tag: "Particles : Liquid Glass Fill",
    category: "particles",
    type: "sand-timer",
    rotate: false,
    particleCount: 1,
    trailSpan: 0.15,
    durationMs: 4200,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 3.5,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 20 * Math.cos(t), y: 50 + 20 * Math.sin(t) };
    },
    mathFormula: [
      "Liquid fill gradient draining from top bulb",
      "Bottom bulb fills smoothly as sand drains",
      "Animated drip stream through glass waist",
      "Automatic 180° smooth flip reset"
    ],
    codeSnippet: `// Implementation: Canvas 2D Liquid Fill Hourglass
// Animated liquid gradient draining top bulb into bottom bulb
// with glass vessel clipping and 180° flip reset.`
  },
  {
    name: "Stochastic Static",
    tag: "Particles : Signal Resolution",
    category: "particles",
    type: "stochastic-static",
    rotate: false,
    particleCount: 48,
    trailSpan: 0.15,
    durationMs: 3600,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 3.5,
    curveScale: 1,
    point(progress: number, detailScale: number, config: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 22 * Math.cos(t), y: 50 + 22 * Math.sin(t) };
    },
    mathFormula: [
      "Static noise: η(x, y, t) = Noise(x·f, y·f, t)",
      "Target signal SDF: concentric ring + core node",
      "Blend: pixel(t) = (1-α)·η + α·SDF, α ∈ [0, 1]",
      "Scanning line wave sweep simulating inference resolution"
    ],
    codeSnippet: `// Implementation: Canvas 2D Signal Processing
// Pixel matrix converging from chaos to target SDF shape.
// Includes active scanline pass.`
  },

  // ── Motion ───────────────────────────────────────────────────────────────
  {
    name: "Breathing Ring",
    tag: "Motion : Meditative Breath Cycle",
    category: "motion",
    type: "breathing-ring",
    rotate: false,
    particleCount: 1,
    trailSpan: 0.15,
    durationMs: 11000,
    rotationDurationMs: 0,
    pulseDurationMs: 11000,
    strokeWidth: 5.5,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 30 * Math.cos(t), y: 50 + 30 * Math.sin(t) };
    },
    mathFormula: [
      "Inhale 4s: r(t) = r₀ + A·ease-in-out(t/T_inhale)",
      "Hold 1s -> Exhale 6s: ease-in-out reverse",
      "stroke-width(t) = w₀ + B·r(t)/r_max",
      "CSS cubic-bezier(0.45, 0, 0.55, 1) breathing curve"
    ],
    codeSnippet: `// Implementation: Canvas breathing cycle
// 4s inhale + 1s hold + 6s exhale = 11s total
// r and stroke-width driven by smoothstep ease`
  },
  {
    name: "Coherent Noise Blob",
    tag: "Motion : Domain-Warped Noise",
    category: "motion",
    type: "noise-blob",
    rotate: false,
    particleCount: 96,
    trailSpan: 0.15,
    durationMs: 6000,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 4.0,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 28 * Math.cos(t), y: 50 + 28 * Math.sin(t) };
    },
    mathFormula: [
      "r(θ, t) = R + A·noise(cosθ·f, sinθ·f, t·s)",
      "Domain warp: sample at noise-offset position for chaos",
      "A = 0.18·R, f = 2.0, s = 0.4",
      "96-point rolling-average smoothing over θ"
    ],
    codeSnippet: `// Implementation: Canvas polar to cartesian with 3D value noise
// r(theta,t) = R + A * domainWarpedNoise(cos(theta)*f, sin(theta)*f, t*s)
// Low-pass smoothed outline, never repeats exactly`
  },
  {
    name: "Lorenz Attractor",
    tag: "Motion : Butterfly Chaos",
    category: "motion",
    type: "lorenz",
    rotate: false,
    particleCount: 180,
    trailSpan: 0.15,
    durationMs: 6000,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 3.5,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 30 * Math.cos(t), y: 50 + 30 * Math.sin(t) };
    },
    mathFormula: [
      "dx/dt = σ(y - x),  σ = 10",
      "dy/dt = x(ρ - z) - y,  ρ = 28",
      "dz/dt = xy - βz,  β = 8/3",
      "Project onto (x, z) plane, RK4 integration, 180-frame tail"
    ],
    codeSnippet: `// Implementation: Canvas RK4 Lorenz integration
// 2000-step burn-in to reach attractor, then trace (x,z) projection
// Fading 180-frame tail with glow head particle`
  },

  // ── Spatial ──────────────────────────────────────────────────────────────
  {
    name: "Topographic Contour",
    tag: "Spatial : Evolving Heightfield",
    category: "spatial",
    type: "topographic-contour",
    rotate: false,
    particleCount: 6,
    trailSpan: 0.15,
    durationMs: 6000,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 4.0,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 30 * Math.cos(t), y: 50 + 30 * Math.sin(t) };
    },
    mathFormula: [
      "h(x,y,t) = Σ Aₙ·sin(kₙ·x + ωₙ·t + φₙ)",
      "Marching squares isoline extraction",
      "Contour levels: c ∈ {c_min, c_min+Δ, ..., c_max}",
      "Breathing 2D heightfield terrain reorganization"
    ],
    codeSnippet: `// Implementation: Canvas 2D Marching Squares Contours
// Evaluates evolving sum of 2D sine waves on grid
// and extracts smooth topographic contour isolines.`
  },
  {
    name: "Gravity Well",
    tag: "Spatial : Spacetime Curvature",
    category: "spatial",
    type: "gravity-well",
    rotate: false,
    particleCount: 144,
    trailSpan: 0.15,
    durationMs: 5000,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 3.5,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 28 * Math.cos(t), y: 50 + 28 * Math.sin(t) };
    },
    mathFormula: [
      "F_i = G·M / |p_i - attractor|² (toward attractor)",
      "disp_i = α·F_i / max_F inverse-square falloff",
      "Attractor orbit: a(t) = (R·cos(ωt), R·sin(ωt))",
      "Elastic grid distortion following orbital mass"
    ],
    codeSnippet: `// Implementation: Canvas 2D Gravitational Well
// Grid nodes warp toward orbiting attractor mass with 1/r^2
// gravitational falloff force.`
  },
  {
    name: "Braided Helix",
    tag: "Spatial : 3D Phase Strands",
    category: "spatial",
    type: "braided-helix",
    rotate: false,
    particleCount: 3,
    trailSpan: 0.15,
    durationMs: 4000,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 4.0,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 30 * Math.cos(t), y: 50 + 30 * Math.sin(t) };
    },
    mathFormula: [
      "y_k(x,t) = A·sin(f·x - ω·t + 2π·k/N)",
      "N = 3 strands, k ∈ {0, 1, 2} phase shifted by 120°",
      "z(x,t) depth sorting per column for realistic occlusion",
      "Interstrand rung connectors for DNA/rope depth"
    ],
    codeSnippet: `// Implementation: Canvas 3D Painter's Algorithm Helix
// 3 phase-offset sine strands z-sorted per segment
// for realistic occlusion and depth rendering.`
  },
  {
    name: "Phase Transition",
    tag: "Spatial : Ising Annealing",
    category: "spatial",
    type: "phase-transition",
    rotate: false,
    particleCount: 144,
    trailSpan: 0.15,
    durationMs: 5000,
    rotationDurationMs: 0,
    pulseDurationMs: 0,
    strokeWidth: 3.5,
    curveScale: 1,
    point(progress: number, _: number, __: any) {
      const t = progress * Math.PI * 2;
      return { x: 50 + 25 * Math.cos(t), y: 50 + 25 * Math.sin(t) };
    },
    mathFormula: [
      "Spin s_i ∈ {-1, +1} lattice",
      "Metropolis update: dE = 2·s_i·Σ s_j",
      "Temperature annealing: T(t) decreases over cycle",
      "Order parameter m = |Σ s_i / N| -> 1 (crystallization)"
    ],
    codeSnippet: `// Implementation: Canvas 2D Ising Model Monte Carlo
// Lattice of spin arrows annealing from high-T random chaos
// into low-T ferromagnetic magnetic domain alignment.`
  }
];
