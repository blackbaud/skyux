import { copy } from 'fs-extra';
import { join } from 'path';

const CWD = process.cwd();

async function copyFilesToDist() {
  const projectRoot = 'libs/sdk/eslint-config';

  const pathsToCopy = [
    join(projectRoot, 'collection.json'),
    join(projectRoot, 'recommended.json'),
    join(projectRoot, 'src/schematics/migrations/migration-collection.json'),
    join(projectRoot, 'src/schematics/ng-add/schema.json'),
  ];

  for (const filePath of pathsToCopy) {
    const distPath = join('dist', filePath);
    await copy(join(CWD, filePath), join(CWD, distPath));
    console.log(`Successfully copied ${filePath} to ${distPath}`);
  }
}

copyFilesToDist();
