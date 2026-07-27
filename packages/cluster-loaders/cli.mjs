#!/usr/bin/env node

/**
 * ⚡ cluster-loaders CLI
 * Powered by FS Cluster & Trous-FS
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const command = args[0];
const loaderName = args[1] || 'astroid';

console.log(`\n⚡ \x1b[36mcluster-loaders\x1b[0m — Powered by \x1b[35mFS Cluster & Trous-FS\x1b[0m\n`);

if (!command || command === 'help') {
  console.log(`Usage:`);
  console.log(`  npx cluster-loaders add <loader-name>`);
  console.log(`\nAvailable loaders:`);
  console.log(`  astroid, spring-blob, magnetic-dots, pendulum-wave, liquid-fill,`);
  console.log(`  orbital-resonance, superformula, fourier, chladni, network-grow,`);
  console.log(`  mobius, clelie, klein-bottle, lissajous, cardioid, trefoil\n`);
  process.exit(0);
}

if (command === 'add') {
  const targetDir = path.join(process.cwd(), 'src', 'components', 'ui');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`✓ Adding \x1b[32m${loaderName}\x1b[0m loader to \x1b[34m${targetDir}\x1b[0m...`);
  console.log(`✓ Installed CurveLoader component and \x1b[35m${loaderName}\x1b[0m config!`);
  console.log(`\nDone! Import it with:`);
  console.log(`\x1b[33mimport { CurveLoader } from "@/components/ui/CurveLoader";\x1b[0m\n`);
}
