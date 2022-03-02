import { readFile, readJson, writeJson } from 'fs-extra';
import glob from 'glob';
import { join } from 'path';
import { PackageConfig } from 'shared/package-config';
import { PackageJson } from 'shared/package-json';

import { getPublishableProjects } from './lib/get-publishable-projects';
import { sortObjectByKeys } from './utils/sort-object-by-keys';

const argv = require('minimist')(process.argv.slice(2));
const CWD = process.cwd();

function cloneAndArrangePackageJsonFields(packageJson: any) {
  const fieldOrder = [
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

  const newJson: any = {};

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

async function findUnlistedPeers(
  projectName: string,
  packageConfig: PackageConfig,
  monorepoPackageNames: string[],
  packageJson: PackageJson,
  fix = false
): Promise<{ errors: string[]; packagesFoundInSourceCode: string[] }> {
  const errors: string[] = [];

  const packageLockJson = await readJson(join(CWD, 'package-lock.json'));

  const dependencies = Object.keys(packageJson.dependencies || {}).concat(
    Object.keys(packageJson.peerDependencies || {})
  );

  // Find all import statements within source files.
  const files = glob.sync(join(CWD, packageConfig.root, '**/*.ts'), {
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

      const ignoredPackages = [
        'path', // system level package
        'rxjs', // peer of @angular/core
      ];
      if (ignoredPackages.includes(foundPackage)) {
        continue;
      }

      // ng2-dragula also requires the dragula package.
      if (foundPackage === 'ng2-dragula') {
        packagesFoundInSourceCode.push('dragula');
      }

      // The following dependencies are provided by @angular/cli.
      if (
        foundPackage.startsWith('@angular-devkit/') ||
        foundPackage.startsWith('@schematics/')
      ) {
        foundPackage = '@angular/cli';
      }

      packagesFoundInSourceCode.push(foundPackage);

      if (dependencies.includes(foundPackage)) {
        continue;
      }

      if (fix) {
        const version = packageLockJson.dependencies[foundPackage]
          ? `^${packageLockJson.dependencies[foundPackage].version}`
          : monorepoPackageNames.includes(foundPackage)
          ? '0.0.0-PLACEHOLDER'
          : undefined;

        if (!version) {
          errors.push(
            `A version could not be located for package '${foundPackage}'. Is it installed?\n`
          );
        } else {
          packageJson.peerDependencies = packageJson.peerDependencies || {};
          if (!packageJson.peerDependencies[foundPackage]) {
            packageJson.peerDependencies[foundPackage] = version;
            console.log(
              ` [fix] --> ${projectName}: Added '${foundPackage}' as a peer dependency.`
            );
          }
        }
      } else {
        const affectedFile = fileName.replace(join(CWD, '/'), '');
        errors.push(
          `The library '${projectName}' imports from '${foundPackage}' but it is not listed as a peer!\n` +
            `   see: ${affectedFile}\n` +
            `        ${'^'.repeat(affectedFile.length)}\n`
        );
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

  const peers = Object.keys(packageJson.peerDependencies || {});

  // All component libraries should have these dependencies.
  const ignoredPackages = ['@angular/core', '@angular/common', 'tslib'];

  for (const peer of peers) {
    if (ignoredPackages.includes(peer)) {
      continue;
    }

    if (packagesFoundInSourceCode.includes(peer)) {
      continue;
    }

    if (fix) {
      if (packageJson.peerDependencies && packageJson.peerDependencies[peer]) {
        delete packageJson.peerDependencies[peer];
        console.log(
          ` [fix] --> ${projectName}: Removed '${peer}' as a peer dependency since it is not being used.`
        );
      }
    } else {
      const affectedFile = join(packageConfig.root, 'package.json');
      errors.push(
        `The library '${projectName}' requests a peer of '${peer}' but it is not found in the source code.\n` +
          `   Remove the peer from: '${affectedFile}'.\n` +
          `                          ${'^'.repeat(affectedFile.length)}\n`
      );
    }
  }

  return { errors };
}

async function checkLibraryMissingPeers() {
  console.log('Checking libraries for missing peer dependencies...\n');

  let errors: string[] = [];

  const packageConfigs = await getPublishableProjects();

  const monorepoPackageNames: string[] = [];
  for (const p in packageConfigs) {
    monorepoPackageNames.push(packageConfigs[p].npmName!);
  }

  for (const projectName in packageConfigs) {
    const packageConfig = packageConfigs[projectName];
    const packageJsonPath = join(CWD, packageConfig.root, 'package.json');
    const packageJson = await readJson(packageJsonPath);

    const unlistedPeersResult = await findUnlistedPeers(
      projectName,
      packageConfig,
      monorepoPackageNames,
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

      await writeJson(
        packageJsonPath,
        cloneAndArrangePackageJsonFields(packageJson),
        {
          spaces: 2,
        }
      );
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

  console.log('\n ✔ Done checking library peers. OK.');
}

checkLibraryMissingPeers();
