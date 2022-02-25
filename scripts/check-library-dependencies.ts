import { readJson } from 'fs-extra';
import { join } from 'path';

import { getPublishableProjects } from './lib/get-publishable-projects';
import { verifyLibraryDependencies } from './lib/verify-library-dependencies';

import { PackageConfigs } from './shared/package-config';
import { PackageJson } from './shared/package-json';

async function checkLibraryDependencies(): Promise<void> {
  try {
    const cwd = process.cwd();

    const distPackages = await getPublishableProjects();
    const configs: PackageConfigs = {};

    for (const packageName in distPackages) {
      configs[packageName] = {
        root: distPackages[packageName].root,
      };
    }

    const packageJson: PackageJson = await readJson(join(cwd, 'package.json'));

    await verifyLibraryDependencies(configs, packageJson);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkLibraryDependencies();
