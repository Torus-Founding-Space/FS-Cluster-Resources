<div align="center">

  <img src="public/logos/LOGOGIF.gif" alt="FS Cluster Logo" width="160" style="border-radius: 12px;" />

  # ⚡ FS Cluster Docs & `cluster-loaders`

  > **High-Performance Physics, Dither Shaders & Parametric Loaders for React**  
  > *Curated Free Open-Source Developer, Branding & Startup Resources by FS Cluster & Torus Founding Space*

  [![npm version](https://img.shields.io/npm/v/cluster-loaders.svg?color=89B4FA&style=for-the-badge)](https://www.npmjs.com/package/cluster-loaders)
  [![license](https://img.shields.io/github/license/fs-cluster/cluster-loaders.svg?color=A6E3A1&style=for-the-badge)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-F9E2AF.svg?style=for-the-badge)](https://github.com/Torus-Founding-Space/FS-Cluster-Resources/pulls)
  [![Torus FS](https://img.shields.io/badge/Torus--FS-Free%20Membership-CBA6F7.svg?style=for-the-badge)](https://torusfoundingspace.com)

</div>

---

### 👾 Dither & Shader Aesthetics Engine

```
  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
  ░░ ░░░░░░░░░░  FS CLUSTER DITHER ENGINE v2.0  ░░░░░░░░░░░░░░░░░░░░░ ░░
  ▒▒  [✦] Stochastic Static  [✦] Bayer 8x8 Dither  [✦] Noise Shaders   ▒▒
  ▓▓  [✦] Parametric Curves  [✦] Spring Physics    [✦] 3D Spatial Visuals▓▓
  ███████████████████████████████████████████████████████████████████████
```

---

## 🧰 Free Resources Directory

### 💻 1. Free Developer Resources
* **`cluster-loaders` Library**: Lightweight, zero-dependency parametric, physics, and dither-shader React components rendered with SVG and HTML5 Canvas.
* **CLI Component Installer**: Add components straight into your project source with `npx cluster-loaders add <loader>`.
* **Dither Shaders & Algorithms**: Bayer Matrix 8x8, Stochastic Static Noise, Chladni wave interference, and Voronoi cell dynamics.
* **Next.js & Fumadocs Boilerplate**: Pre-configured, high-performance documentation site template.

### 🎨 2. Free Branding Resources
* **Logo & Visual Assets**: High-resolution animated logo GIFs and PNGs in [`public/logos/`](public/logos/).
* **Color Palette System**: Pre-defined HSL dark-mode theme tokens (`#CBA6F7`, `#89B4FA`, `#A6E3A1`, `#F9E2AF`).
* **Design Tokens & Icons**: Standardized CSS design tokens for modern Web3, AI, and developer tools.

### 🚀 3. Free Startup Resources
* **[Open Source Playbook](packages/cluster-loaders/OPEN_SOURCE_PLAYBOOK.md)**: Step-by-step guide for creating free GitHub Orgs, publishing NPM packages, and building developer trust.
* **Zero-Cost Infrastructure**: Complete setup for $0/mo hosting on Vercel, Cloudflare Pages, and GitHub Actions.
* **Growth & Distribution Funnel**: Actionable frameworks to turn open-source utility tools into startup user pipelines.

---

## ⚡ Quick Start (`cluster-loaders`)

### 1. Install via Package Manager
```bash
npm install cluster-loaders
# or
pnpm add cluster-loaders
```

### 2. Add via CLI (shadcn-style)
```bash
npx cluster-loaders add astroid
```

### 3. Usage Example
```tsx
import React from 'react';
import { CurveLoader, curves } from 'cluster-loaders';

export default function LoadingState() {
  const astroid = curves.find(c => c.name === "Astroid");

  return (
    <div className="w-24 h-24 text-[#CBA6F7]">
      <CurveLoader config={astroid} />
    </div>
  );
}
```

---

## 🛠️ Step-by-Step Contribution Guide

We welcome contributions from developers of all skill levels! Here is how to get started:

1. **Fork the Repository**  
   Click **Fork** at the top right of this repository.

2. **Clone Your Fork**  
   ```bash
   git clone https://github.com/YOUR_USERNAME/FS-Cluster-Resources.git
   cd FS-Cluster-Resources
   ```

3. **Install Dependencies**  
   ```bash
   npm install
   ```

4. **Start Development Server**  
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view live updates.

5. **Create & Test Changes**  
   * Add UI components or canvas loaders in `src/components/`.
   * Add package components in `packages/cluster-loaders/src/`.

6. **Submit a Pull Request (PR)**  
   Push changes to your fork and submit a PR with a concise description of your work.

---

## 🎯 Join Torus Founding Space (100% Free)

> **Is starting your own company or working at a high-growth startup your ultimate goal?**

**[Torus Founding Space](https://torusfoundingspace.com)** provides a zero-cost launchpad and ecosystem for builders, developers, and future founders.

* 🤝 **Co-Founder Matching**: Connect with technical & business co-founders.
* 🛠️ **Free Infrastructure & Resources**: Access free tech stacks, startup playbooks, and mentorship.
* 🚀 **Venture Scaling**: Get guidance on turning open-source projects into venture-backed companies.

👉 **[Apply Now at torusfoundingspace.com](https://torusfoundingspace.com)** — *Membership is 100% Free!*

---

<div align="center">

  **Made with ❤️ by [FS Cluster](https://github.com/Torus-Founding-Space/FS-Cluster-Resources) & [Torus Founding Space](https://torusfoundingspace.com)**

</div>
