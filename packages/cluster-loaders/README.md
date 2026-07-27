<div align="center">

  <img src="../../public/logos/LOGOGIF.gif" alt="FS Cluster Logo" width="140" style="border-radius: 12px;" />

  # ⚡ Cluster Loaders (`cluster-loaders`)

  > **Physics-driven, Parametric & Dither-Shader SVG/Canvas Loaders for React**  
  > *Powered by FS Cluster & Torus Founding Space*

  [![npm version](https://img.shields.io/npm/v/cluster-loaders.svg?color=89B4FA&style=for-the-badge)](https://www.npmjs.com/package/cluster-loaders)
  [![license](https://img.shields.io/github/license/fs-cluster/cluster-loaders.svg?color=A6E3A1&style=for-the-badge)](LICENSE)
  [![bundle size](https://img.shields.io/bundlephobia/minzip/cluster-loaders?color=CBA6F7&style=for-the-badge)](https://bundlephobia.com/package/cluster-loaders)
  [![Torus FS](https://img.shields.io/badge/Torus--FS-Free%20Membership-CBA6F7.svg?style=for-the-badge)](https://torusfoundingspace.com)

</div>

---

A lightweight, zero-dependency collection of continuous parametric loaders — mathematical curves, fluid dynamics, standing waves, stochastic noise, Bayer matrix dithering, and 3D projections — rendered in high-performance SVG and HTML5 Canvas.

---

## 📦 Installation Options

### Option 1 — Install via NPM / PNPM / Yarn

```bash
# npm
npm install cluster-loaders

# pnpm
pnpm add cluster-loaders

# yarn
yarn add cluster-loaders
```

### Option 2 — Add Components via CLI (shadcn style)

Add zero-dependency source components directly into your project:

```bash
# Add Astroid curve loader
npx cluster-loaders add astroid

# Add Spring Blob physics loader
npx cluster-loaders add spring-blob
```

---

## 💻 Usage & Examples

### 1. Basic Usage with Preset Curves

```tsx
import React from 'react';
import { CurveLoader, curves } from 'cluster-loaders';

export default function LoadingState() {
  // Select any curve from preset collection
  const astroid = curves.find(c => c.name === "Astroid");

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-24 h-24 text-[#CBA6F7]">
        <CurveLoader config={astroid} />
      </div>
    </div>
  );
}
```

### 2. Custom Color & Sizing

The `CurveLoader` inherits color from the parent CSS `color` property (`currentColor`):

```tsx
// Indigo Glow Loader
<div className="w-16 h-16 text-indigo-400">
  <CurveLoader config={curves[0]} />
</div>

// Emerald Green Loader
<div className="w-20 h-20 text-emerald-400">
  <CurveLoader config={curves[1]} />
</div>
```

---

## 🎨 Included Presets & Shaders

* **Math Curves**: Astroid, Lissajous Figure, Lemniscate of Bernoulli, Cardioid & Nephroid, Limaçon, Butterfly Curve, Trefoil Knot.
* **Physics & Fluid Dynamics**: Spring Blob ($\ddot{x} = -kx - c\dot{x}$), Magnetic Attractors, Pendulum Wave, Liquid Surface.
* **Dither & Stochastic Static**: Bayer Matrix 8x8 halftone dithering, Stochastic static noise, Chladni standing waves ($\sin(m\pi x)\sin(n\pi y) = 0$).
* **3D Projected & Spatial**: Möbius Trail, Clélie Sphere Wrap, Klein Bottle Slice, Voronoi Pulse.

---

## 🛠️ How to Contribute

1. Fork & clone the repo.
2. Run `npm install`.
3. Add your custom parametric curve or dither shader in `src/`.
4. Submit a PR!

---

## 🎯 Join Torus Founding Space (100% Free)

> **Looking to start your own company or join a high-growth startup team?**

Apply at **[torusfoundingspace.com](https://torusfoundingspace.com)** — **Membership is 100% Free!**

---

<div align="center">

  **Made with ❤️ by [FS Cluster](https://github.com/Torus-Founding-Space/FS-Cluster-Resources) & [Torus Founding Space](https://torusfoundingspace.com)**

</div>
