import { copy } from 'fs-extra';
import path from 'node:path';

const CWD = process.cwd();

async function copyFilesToDist(): Promise<void> {
  const projectRoot = 'libs/sdk/testing';

  const pathsToCopy = [
    path.join(projectRoot, 'collection.json'),
    path.join(projectRoot, 'schematics/ng-add/schema.json'),
  ];

  for (const filePath of pathsToCopy) {
    const distPath = path.join('dist', filePath);
    await copy(path.join(CWD, filePath), path.join(CWD, distPath));
    console.log(`Successfully copied ${filePath} to ${distPath}`);
  }
}

void copyFilesToDist();
