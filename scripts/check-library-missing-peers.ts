import { readFile, readJson, writeJson } from 'fs-extra';
import glob from 'glob';
import { join } from 'path';

import { getPublishableProjects } from './lib/get-publishable-projects';
import { sortObjectByKeys } from './utils/sort-object-by-keys';

async function checkLibraryMissingPeers() {
  console.log('Checking libraries for missing peer dependencies...');

  const argv = require('minimist')(process.argv.slice(2));
  const cwd = process.cwd();

  const errors: string[] = [];

  const packageLockJson = await readJson(join(cwd, 'package-lock.json'));

  const distPackages = await getPublishableProjects();

  for (const projectName in distPackages) {
    const packageConfig = distPackages[projectName];
    const packageJsonPath = join(cwd, packageConfig.root, 'package.json');
    const packageJson = await readJson(packageJsonPath);

    const dependencies = Object.keys(packageJson.dependencies || {}).concat(
      Object.keys(packageJson.peerDependencies || {})
    );

    let foundPackages = [];

    const files = glob.sync(join(cwd, packageConfig.root, '**/*.ts'), {
      nodir: true,
      ignore: [
        '**/fixtures/**',
        '**/*.fixture.ts',
        '**/*.spec.ts',
        '**/test.ts',
      ],
    });

    for (const fileName of files) {
      const contents = (await readFile(join(fileName))).toString();

      const matches = contents.matchAll(/(?:import|from)\s+\'((?!\.).*)\'/g);
      for (const match of matches) {
        let foundPackage = match[1];

        const fragments = foundPackage.split('/');
        if (fragments[0].startsWith('@')) {
          foundPackage = `${fragments[0]}/${fragments[1]}`;
        } else {
          foundPackage = fragments[0];
        }

        foundPackages.push(foundPackage);
        if (foundPackage === 'ng2-dragula') {
          foundPackages.push('dragula');
        }

        if (foundPackage === packageJson.name) {
          continue;
        }

        if (
          [
            '@angular-devkit/core', // dependency of @angular-devkit/build-angular
            '@angular-devkit/schematics', // dependency of @angular/cli
            '@schematics/angular', // dependency of @angular/cli
            'path', // system level package
            'rxjs',
          ].includes(foundPackage)
        ) {
          continue;
        }

        if (!dependencies.includes(foundPackage)) {
          if (argv.fix) {
            const version = packageLockJson.dependencies[foundPackage]
              ? `^${packageLockJson.dependencies[foundPackage].version}`
              : /^@skyux/.test(foundPackage)
              ? '0.0.0-PLACEHOLDER'
              : undefined;

            if (!version) {
              errors.push(
                `A version could not be located for package ${foundPackage}. Is it installed?`
              );
            } else {
              packageJson.peerDependencies = packageJson.peerDependencies || {};
              packageJson.peerDependencies[foundPackage] = version;
              console.log(
                ` [fix] --> Added ${foundPackage}@${version} as a peer dependency of '${projectName}'.`
              );
            }
          } else {
            errors.push(
              `The library '${projectName}' imports from ${foundPackage} but it is not listed as a peer! (see: ${fileName.replace(
                join(cwd, '/'),
                ''
              )})`
            );
          }
        }
      }
    }

    foundPackages = [...new Set(foundPackages)];
    for (const dependency of dependencies) {
      if (['tslib'].includes(dependency)) {
        continue;
      }

      if (!foundPackages.includes(dependency)) {
        if (argv.fix) {
          if (packageJson.peerDependencies) {
            delete packageJson.peerDependencies[dependency];
          }

          if (packageJson.dependencies) {
            delete packageJson.dependencies[dependency];
          }

          console.log(
            ` [fix] --> Removed ${dependency} as a peer dependency of '${projectName}' since it is not being used.`
          );
        } else {
          errors.push(
            `The library '${projectName}' requests a peer of ${dependency} but it is not found in the source code. Please remove the peer from '${join(
              packageConfig.root,
              'package.json'
            )}'.`
          );
        }
      }
    }

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
      'Missing peers found. Re-run command with `--fix` to automatically fix them.'
    );
    process.exit(1);
  }

  console.log(' ✔ Done checking library peers. OK.');
}

checkLibraryMissingPeers();
