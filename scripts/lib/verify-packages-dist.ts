import { PackageConfigs } from '../shared/package-config';
import { PackageJson } from '../shared/package-json';

import { verifyLibraryDependencies } from './verify-library-dependencies';

export async function verifyPackagesDist(
  projects: PackageConfigs,
  workspacePackageJson: PackageJson
) {
  const configs: PackageConfigs = {};

  const npmPackageNames: string[] = [];
  for (const packageName in projects) {
    configs[packageName] = {
      root: projects[packageName].distRoot!,
    };
    npmPackageNames.push(projects[packageName].npmName!);
  }

  await verifyLibraryDependencies(
    configs,
    workspacePackageJson,
    npmPackageNames
  );
}
