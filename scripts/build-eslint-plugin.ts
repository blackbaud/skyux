import { copy, emptyDir } from 'fs-extra';
import path from 'node:path';

import { runCommand } from './utils/spawn';

/**
 * Builds the ESLint plugins and copies them to the local node_modules directory
 * to allow local ESLint configs to pick them up.
 */
async function buildESLintPlugin(): Promise<void> {
  await runCommand('npx', [
    'nx',
    'run-many',
    '--target=build',
    '--projects=eslint-plugin,eslint-plugin-template',
  ]);

  await emptyDir('node_modules/@skyux-eslint');

  await copy(
    path.normalize('dist/libs/sdk/eslint-plugin'),
    path.normalize('node_modules/@skyux-eslint/eslint-plugin'),
  );

  await copy(
    path.normalize('dist/libs/sdk/eslint-plugin-template'),
    path.normalize('node_modules/@skyux-eslint/eslint-plugin-template'),
  );
}

buildESLintPlugin();
