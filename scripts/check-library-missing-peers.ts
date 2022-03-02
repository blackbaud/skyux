import { readFile, readJson, writeJson } from 'fs-extra';
import glob from 'glob';
import { join } from 'path';
import { PackageConfig, PackageConfigs } from 'shared/package-config';
import { PackageJson } from 'shared/package-json';

import { getPublishableProjects } from './lib/get-publishable-projects';
import { sortObjectByKeys } from './utils/sort-object-by-keys';

const argv = require('minimist')(process.argv.slice(2));
const CWD = process.cwd();

function getPackageDependencyNames(packageJson: PackageJson): string[] {
  return Object.keys(packageJson.dependencies || {}).concat(
    Object.keys(packageJson.peerDependencies || {})
  );
}

async function findUnlistedPeers(
  projectName: string,
  projectConfigs: PackageConfigs,
  packageJson: PackageJson,
  fix = false
): Promise<{ errors: string[]; packagesFoundInSourceCode: string[] }> {
  const errors: string[] = [];

  const packageLockJson = await readJson(join(CWD, 'package-lock.json'));

  const dependencies = getPackageDependencyNames(packageJson);

  const projectConfig = projectConfigs[projectName];
  const publishableProjectNames = Object.keys(projectConfigs);

  // Find all import statements within source files.
  const files = glob.sync(join(CWD, projectConfig.root, '**/*.ts'), {
    nodir: true,
    ignore: ['**/fixtures/**', '**/*.fixture.ts', '**/*.spec.ts', '**/test.ts'],
  });

  const packagesFoundInSourceCode: string[] = [];

  for (const fileName of files) {
    const contents = (await readFile(join(fileName))).toString();

    const matches = contents.matchAll(/(?:import|from)\s+\'((?!\.).*)\'/g);
    for (const match of matches) {
      let foundPackage = match[1];

      // Resolve package name from "deep" import paths.
      const fragments = foundPackage.split('/');
      if (fragments[0].startsWith('@')) {
        foundPackage = `${fragments[0]}/${fragments[1]}`;
      } else {
        foundPackage = fragments[0];
      }

      // Abort if the found package name is equal to the current library's package name.
      if (foundPackage === packageJson.name) {
        continue;
      }

      packagesFoundInSourceCode.push(foundPackage);

      // ng2-dragula also requires the dragula package.
      if (foundPackage === 'ng2-dragula') {
        packagesFoundInSourceCode.push('dragula');
      }

      const ignoredPackages = [
        '@angular-devkit/core', // direct dependency of @angular-devkit/build-angular
        '@angular-devkit/schematics', // direct dependency of @angular/cli
        '@schematics/angular', // direct dependency of @angular/cli
        'path', // system level package
        'rxjs', // peer of @angular/core
      ];
      if (ignoredPackages.includes(foundPackage)) {
        continue;
      }

      if (!dependencies.includes(foundPackage)) {
        if (fix) {
          const version = packageLockJson.dependencies[foundPackage]
            ? `^${packageLockJson.dependencies[foundPackage].version}`
            : publishableProjectNames.includes(foundPackage)
            ? '0.0.0-PLACEHOLDER'
            : undefined;

          if (!version) {
            errors.push(
              `A version could not be located for package ${foundPackage}. Is it installed?`
            );
          } else {
            packageJson.peerDependencies = packageJson.peerDependencies || {};
            if (!packageJson.peerDependencies[foundPackage]) {
              packageJson.peerDependencies[foundPackage] = version;
              console.log(
                ` [fix] --> ${projectName}: Added ${foundPackage} as a peer dependency.`
              );
            }
          }
        } else {
          errors.push(
            `The library '${projectName}' imports from ${foundPackage} but it is not listed as a peer! ` +
              `(see: ${fileName.replace(join(CWD, '/'), '')})`
          );
        }
      }
    }
  }

  return {
    errors,
    packagesFoundInSourceCode: [...new Set(packagesFoundInSourceCode)], // remove duplicates
  };
}

async function findUnusedPeers(
  projectName: string,
  packageConfig: PackageConfig,
  packageJson: PackageJson,
  packagesFoundInSourceCode: string[],
  fix = false
): Promise<{ errors: string[] }> {
  const errors: string[] = [];

  const dependencies = getPackageDependencyNames(packageJson);

  // All component libraries should have these dependencies.
  const ignoredPackages = ['@angular/core', '@angular/common', 'tslib'];

  for (const dependency of dependencies) {
    if (ignoredPackages.includes(dependency)) {
      continue;
    }

    if (packagesFoundInSourceCode.includes(dependency)) {
      continue;
    }

    if (fix) {
      if (
        packageJson.peerDependencies &&
        packageJson.peerDependencies[dependency]
      ) {
        delete packageJson.peerDependencies[dependency];
        console.log(
          ` [fix] --> ${projectName}: Removed ${dependency} as a peer dependency since it is not being used.`
        );
      }

      if (packageJson.dependencies && packageJson.dependencies[dependency]) {
        delete packageJson.dependencies[dependency];
        console.log(
          ` [fix] --> ${projectName}: Removed ${dependency} as a dependency since it is not being used.`
        );
      }
    } else {
      errors.push(
        `The library '${projectName}' requests a peer of ${dependency} but it is not found in the source code. ` +
          `Please remove the peer from '${join(
            packageConfig.root,
            'package.json'
          )}'.`
      );
    }
  }

  return { errors };
}

async function checkLibraryMissingPeers() {
  console.log('Checking libraries for missing peer dependencies...');

  let errors: string[] = [];

  const projectConfigs = await getPublishableProjects();

  for (const projectName in projectConfigs) {
    const packageConfig = projectConfigs[projectName];
    const packageJsonPath = join(CWD, packageConfig.root, 'package.json');
    const packageJson = await readJson(packageJsonPath);

    const unlistedPeersResult = await findUnlistedPeers(
      projectName,
      projectConfigs,
      packageJson,
      argv.fix
    );

    const unusedPeersResult = await findUnusedPeers(
      projectName,
      packageConfig,
      packageJson,
      unlistedPeersResult.packagesFoundInSourceCode,
      argv.fix
    );

    errors = errors
      .concat(unlistedPeersResult.errors)
      .concat(unusedPeersResult.errors);

    if (argv.fix) {
      packageJson.peerDependencies = sortObjectByKeys(
        packageJson.peerDependencies
      );

      await writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  if (errors.length > 0) {
    errors.forEach((err) => console.error(` ✘ ${err}`));
    console.error(
      `
======================================================
  [!] Missing peers found!
      Append the command with '-- --fix' to fix them.
======================================================

`
    );
    process.exit(1);
  }

  console.log(' ✔ Done checking library peers. OK.');
}

checkLibraryMissingPeers();
