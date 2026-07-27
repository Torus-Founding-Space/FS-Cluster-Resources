<div align="center">

  <img src="public/logos/LOGOGIF.gif" alt="FS Cluster Logo" width="550" style="max-width: 100%; height: auto; border-radius: 16px;" />

  # FS Cluster Docs & `cluster-loaders`

  **Physics-Driven, Dither Shaders & Parametric Loaders for React**

  [Documentation Site](https://fs-cluster-docs.vercel.app) | [NPM Package](https://www.npmjs.com/package/cluster-loaders) | [Torus Founding Space](https://torusfoundingspace.com)

  [![NPM Version](https://img.shields.io/npm/v/cluster-loaders.svg?style=flat-square)](https://www.npmjs.com/package/cluster-loaders)
  [![License](https://img.shields.io/github/license/Torus-Founding-Space/FS-Cluster-Resources.svg?style=flat-square)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg?style=flat-square)](https://github.com/Torus-Founding-Space/FS-Cluster-Resources/pulls)

</div>

---

## Overview

FS Cluster Docs is an open-source documentation hub and component ecosystem containing `cluster-loaders`—a zero-dependency library of physics-driven, mathematical, parametric, and dither-shader SVG and HTML5 Canvas loaders for React.

- **Documentation**: [Official Documentation Hub](https://fs-cluster-docs.vercel.app) (or run locally with `npm run dev`)
- **NPM Package**: [`cluster-loaders`](https://www.npmjs.com/package/cluster-loaders)

### Preview & Media

![FS Cluster Loaders Preview](public/logos/LOGOGIF.gif)

---

## Quick Start

### Installation via NPM
```bash
npm install cluster-loaders
```

### Installation via CLI (shadcn-style)
```bash
npx cluster-loaders add astroid
```

### Basic Usage
```tsx
import React from 'react';
import { CurveLoader, curves } from 'cluster-loaders';

export default function LoadingState() {
  const astroid = curves.find(c => c.name === "Astroid");

  return (
    <div className="w-24 h-24 text-purple-400">
      <CurveLoader config={astroid} />
    </div>
  );
}
```

---

## Contributing

This project is maintained as open source. Contributions, bug reports, and pull requests are welcomed.

### Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/Torus-Founding-Space/FS-Cluster-Resources.git
   cd FS-Cluster-Resources
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local server:
   ```bash
   npm run dev
   ```
4. Create your feature branch, add components under `src/components/` or `packages/cluster-loaders/src/`, and submit a Pull Request.

---

## Socials & Links

- **Website**: [torusfoundingspace.com](https://torusfoundingspace.com)
- **GitHub**: [Torus-Founding-Space / FS-Cluster-Resources](https://github.com/Torus-Founding-Space/FS-Cluster-Resources)
- **NPM**: [cluster-loaders](https://www.npmjs.com/package/cluster-loaders)
- **Twitter / X**: [@TorusFS](https://x.com)
- **Discord**: [Join Community](https://discord.gg)

---

## Torus Founding Space

If starting your own company or joining a startup as a founding member is your ultimate goal, you can apply for membership at [torusfoundingspace.com](https://torusfoundingspace.com). Membership is 100% free.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.
