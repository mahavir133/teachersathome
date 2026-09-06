import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const distServer = path.join(process.cwd(), 'dist', 'server.js');

if (!existsSync(distServer)) {
  console.log('dist/server.js not found at startup. Running build...');
  try {
    execSync('npx vite build && npx esbuild server.ts --bundle --platform=node --format=esm --packages=external --outfile=dist/server.js', { stdio: 'inherit' });
  } catch (err) {
    console.error('Build execution error:', err.message);
  }
}

import('./dist/server.js');
