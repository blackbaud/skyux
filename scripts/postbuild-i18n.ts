import fs from 'fs-extra';
import path from 'path';

import { runCommand } from './utils/spawn';

const CWD = process.cwd();
const LIB_PATH = path.resolve(CWD, 'libs/components/i18n');

async function buildSchematics() {
  console.log('Building @skyux/i18n schematics...');

  await runCommand(path.resolve(CWD, 'node_modules/.bin/tsc'), [
    '--project',
    'libs/components/i18n/tsconfig.schematics.json',
  ]);

  // Copy collection.json.
  fs.copySync(
    path.join(LIB_PATH, 'schematics/collection.json'),
    path.join(CWD, 'dist/libs/components/i18n/schematics/collection.json')
  );

  // Copy schemas.
  fs.copySync(
    path.join(
      LIB_PATH,
      'schematics/ng-generate/lib-resources-module/schema.json'
    ),
    path.join(
      CWD,
      'dist/libs/components/i18n/schematics/ng-generate/lib-resources-module/schema.json'
    )
  );

  // Copy template files.
  fs.copySync(
    path.join(LIB_PATH, 'schematics/ng-generate/lib-resources-module/files'),
    path.join(
      CWD,
      'dist/libs/components/i18n/schematics/ng-generate/lib-resources-module/files'
    )
  );

  console.log('Done.');
}

async function postbuildI18n() {
  try {
    await buildSchematics();
  } catch (err) {
    console.error('[postbuild-i18n error]', err);
    process.exit(1);
  }
}

postbuildI18n();
