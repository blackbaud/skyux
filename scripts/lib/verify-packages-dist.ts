import { PackageConfigs } from '../shared/package-config';
import { PackageJson } from '../shared/package-json';

import { verifyLibraryDependencies } from './verify-library-dependencies';

export async function verifyPackagesDist(
  projects: PackageConfigs,
  workspacePackageJson: PackageJson
) {
  const configs: PackageConfigs = {};

  for (const packageName in projects) {
    configs[packageName] = {
      root: projects[packageName].distRoot!,
    };
  }

  await verifyLibraryDependencies(configs, workspacePackageJson);
}
