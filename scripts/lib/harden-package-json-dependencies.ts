import { readJson, writeJson } from 'fs-extra';
import { join } from 'path';

import { PackageJsonDependencies } from '../shared/package-json';
import { PackageLockJson } from '../shared/package-lock-json';

function hardenDependencyVersions(
  dependencies: PackageJsonDependencies,
  packageLock: PackageLockJson
) {
  for (const packageName in dependencies) {
    const installedVersion = packageLock.dependencies[packageName]?.version;
    if (!installedVersion) {
      console.warn(
        `Warning: The package ${packageName} was found in package.json but is not installed.`
      );
      continue;
    }

    const version = dependencies[packageName];
    if (version !== installedVersion) {
      console.info(
        `Fixing version for dependency ${packageName} @ "${installedVersion}" (was "${version}")...`
      );
      dependencies[packageName] = installedVersion;
    }
  }
}

/**
 * Sets specific versions for package.json `dependencies` and `devDependencies`.
 */
export async function hardenPackageJsonDependencies(workingDirectory?: string) {
  console.info('Hardening package.json dependency versions...');

  workingDirectory = workingDirectory || process.cwd();

  const packageJson = await readJson(join(workingDirectory, 'package.json'));
  const packageLockJson = await readJson(
    join(workingDirectory, 'package-lock.json')
  );

  hardenDependencyVersions(packageJson.dependencies, packageLockJson);
  hardenDependencyVersions(packageJson.devDependencies, packageLockJson);

  await writeJson(join(workingDirectory, 'package.json'), packageJson, {
    spaces: 2,
  });

  console.info('Done hardening dependencies.');
}
