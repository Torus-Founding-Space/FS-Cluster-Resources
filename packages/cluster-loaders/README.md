<div align="center">

  <img src="https://raw.githubusercontent.com/Torus-Founding-Space/FS-Cluster-Resources/main/public/logos/LOGOGIF.gif" alt="FS Cluster Logo" width="450" style="max-width: 100%; height: auto;" />

  # Cluster Loaders (`cluster-loaders`)

  **Free Open-Source Developer Tools & Founder Resources**

  [Documentation](https://clusterdocs.torusfoundingspace.com/docs/math-loaders) | [NPM Package](https://www.npmjs.com/package/cluster-loaders) | [Torus Founding Space](https://torusfoundingspace.com)

  [![NPM Version](https://img.shields.io/npm/v/cluster-loaders.svg?style=flat-square)](https://www.npmjs.com/package/cluster-loaders)
  [![License](https://img.shields.io/github/license/Torus-Founding-Space/FS-Cluster-Resources.svg?style=flat-square)](https://github.com/Torus-Founding-Space/FS-Cluster-Resources/blob/main/LICENSE)

</div>

---

## Overview

`cluster-loaders` is a set of loading animations for **React**, built from parametric
equations and small physics simulations. Simple curves render as SVG; the
heavier presets (gravity wells, Ising lattices, Voronoi fields) render to
`<canvas>` and are code-split, so you only download the loader you use.

React and React DOM are the only peer dependencies. There is no animation
library underneath.

---

## Installation

### Package manager

```bash
npm install cluster-loaders
```

```tsx
import { CurveLoader, curveById } from "cluster-loaders";

const astroid = curveById("astroid")!;

export function Spinner() {
  return (
    <div className="w-24 h-24 text-[#CBA6F7]">
      <CurveLoader config={astroid} />
    </div>
  );
}
```

Loaders draw in the inherited CSS `color`, so set `color` (or a Tailwind
`text-*` class) on a sized container.

### CLI installer (shadcn style)

Copies a loader's real source into your project so you own and can edit it,
no runtime dependency.

```bash
# See every preset id
npx cluster-loaders list

# Copy one in
npx cluster-loaders add gravity-well

# Overwrite files that already exist
npx cluster-loaders add gravity-well --force
```

Files land in `src/components/ui/cluster-loaders/` (or
`components/ui/cluster-loaders/` if your project has no `src` directory).
Shared runtime files are written once; adding a second loader will not
clobber the first.

---

## API

| Export | Description |
| --- | --- |
| `CurveLoader` | The component. Props: `config`, `isActive?`, `className?`. |
| `curves` | Every preset, in gallery order. |
| `curveById(id)` | Look one preset up by its stable id. |
| `loaderIds` | Just the ids. |
| `useCurveAnimation(config, isActive?)` | The SVG animation hook, if you want to build your own markup. |
| `CurveConfig`, `CurveParams`, `CurveType`, `Point` | Types. |

Set `isActive={false}` to pause a loader. The animation frame loop stops and
restarts with it. Loaders also honour `prefers-reduced-motion`, rendering a
single static frame instead of animating.

---

## Non-React projects

The loaders are React components. In Vue, Svelte or plain JavaScript, mount a
React root onto a container element. See the
[framework guides](https://clusterdocs.torusfoundingspace.com/docs/math-loaders)
for working snippets for each stack.

---

## Contributing

This package is open source. Pull requests and resource contributions are welcome.

1. Fork and clone the repository.
2. Run `npm install` at the repo root.
3. Build the package with `npm run package:build`.
4. Submit a Pull Request.

---

## Torus Founding Space

If starting your own company or joining a startup as a founding member is your ultimate goal, apply at [torusfoundingspace.com](https://torusfoundingspace.com). Membership is 100% free.

---

## License

Distributed under the MIT License.
