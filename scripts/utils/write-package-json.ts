import { writeJson } from 'fs-extra';

import { PackageJson } from '../shared/package-json';

import { sortObjectByKeys } from './sort-object-by-keys';

function arrangePackageJsonFields(packageJson: PackageJson) {
  const fieldOrder: (keyof PackageJson)[] = [
    'name',
    'version',
    'author',
    'description',
    'keywords',
    'license',
    'repository',
    'bugs',
    'homepage',
    'schematics',
    'ng-add',
    'ng-update',
    'peerDependencies',
    'dependencies',
  ];

  const newJson: PackageJson = {};

  for (const field of fieldOrder) {
    if (packageJson[field]) {
      newJson[field] = packageJson[field];
      delete packageJson[field];
    }
  }

  for (const k in packageJson) {
    newJson[k] = packageJson[k];
  }

  return newJson;
}

export async function writePackageJson(
  filePath: string,
  packageJson: PackageJson
): Promise<void> {
  if (packageJson.peerDependencies) {
    packageJson.peerDependencies = sortObjectByKeys(
      packageJson.peerDependencies
    );
  }

  if (packageJson.dependencies) {
    packageJson.dependencies = sortObjectByKeys(packageJson.dependencies);
  }

  await writeJson(filePath, arrangePackageJsonFields(packageJson), {
    spaces: 2,
  });
}
