import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const distServer = path.join(process.cwd(), 'dist', 'server.js');

if (!existsSync(distServer)) {
  console.log('dist/server.js not found. Triggering build...');
  execSync('npm run build', { stdio: 'inherit' });
}

import('./dist/server.js');
