import fs, { emptyDir, ensureDir } from 'fs-extra';

import { runCommand } from './utils/spawn';

async function buildESLintPlugin(): Promise<void> {
  await runCommand('npx', ['nx', 'build', 'eslint-plugin']);

  await ensureDir('node_modules/@skyux-eslint');
  await emptyDir('node_modules/@skyux-eslint');

  await fs.copy(
    'dist/libs/sdk/eslint-plugin',
    'node_modules/@skyux-eslint/eslint-plugin',
  );
}

buildESLintPlugin();
