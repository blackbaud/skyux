import fs from 'fs-extra';
import path from 'path';

import { runCommand } from './utils/spawn';

const CWD = process.cwd();
const LIB_PATH = path.resolve(CWD, 'libs/components/i18n');

async function buildSchematics(): Promise<void> {
  console.log('Building @skyux/i18n schematics...');

  await runCommand(path.resolve(CWD, 'node_modules/.bin/tsc'), [
    '--project',
    'libs/components/i18n/tsconfig.schematics.json',
  ]);

  // Copy template files.
  fs.copySync(
    path.join(LIB_PATH, 'schematics/ng-generate/lib-resources-module/files'),
    path.join(
      CWD,
      'dist/libs/components/i18n/schematics/ng-generate/lib-resources-module/files',
    ),
  );
  fs.copySync(
    path.join(
      LIB_PATH,
      'schematics/ng-generate/remote-modules-resources-module/files',
    ),
    path.join(
      CWD,
      'dist/libs/components/i18n/schematics/ng-generate/remote-modules-resources-module/files',
    ),
  );

  console.log('Done.');
}

async function postbuildI18n(): Promise<void> {
  try {
    await buildSchematics();
  } catch (err) {
    console.error('[postbuild-i18n error]', err);
    process.exit(1);
  }
}

void postbuildI18n();
