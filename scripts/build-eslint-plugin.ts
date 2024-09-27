import fs, { emptyDir } from 'fs-extra';

import { runCommand } from './utils/spawn';

async function buildESLintPlugin(): Promise<void> {
  await runCommand('npx', [
    'nx',
    'run-many',
    '--target=build',
    '--projects=eslint-plugin,eslint-plugin-template',
  ]);

  await emptyDir('node_modules/@skyux-eslint');

  await fs.copy(
    'dist/libs/sdk/eslint-plugin',
    'node_modules/@skyux-eslint/eslint-plugin',
  );

  await fs.copy(
    'dist/libs/sdk/eslint-plugin-template',
    'node_modules/@skyux-eslint/eslint-plugin-template',
  );
}

buildESLintPlugin();
