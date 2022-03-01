import { readFile, readJson } from 'fs-extra';
import glob from 'glob';
import { join } from 'path';

import { getPublishableProjects } from './lib/get-publishable-projects';

async function checkLibraryMissingPeers() {
  const argv = require('minimist')(process.argv.slice(2));
  const cwd = process.cwd();

  const errors: string[] = [];

  const packageLockJson = await readJson(join(cwd, 'package-lock.json'));

  const distPackages = await getPublishableProjects();

  for (const projectName in distPackages) {
    const packageConfig = distPackages[projectName];
    const packageJson = await readJson(
      join(cwd, packageConfig.root, 'package.json')
    );

    const dependencies = Object.keys(packageJson.dependencies || {}).concat(
      Object.keys(packageJson.peerDependencies || {})
    );

    // console.log(
    //   `Checking dependencies for ${projectName}:\n - ${dependencies.join(
    //     '\n - '
    //   )}`
    // );

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

      const matches = contents.matchAll(/from\s+\'([^\n.]+)\'/g);

      for (const match of matches) {
        let foundPackage = match[1];
        foundPackages.push(foundPackage);

        const fragments = foundPackage.split('/');
        if (fragments[0].startsWith('@')) {
          foundPackage = `${fragments[0]}/${fragments[1]}`;
        } else {
          foundPackage = fragments[0];
        }

        // if (foundPackage.startsWith('rxjs')) {
        //   continue;
        // }

        if (['path', 'rxjs'].includes(foundPackage)) {
          continue;
        }

        if (!dependencies.includes(foundPackage)) {
          errors.push(
            `The library '${projectName}' imports from ${foundPackage} but it is not listed as a peer! (see: ${fileName.replace(
              join(cwd, '/'),
              ''
            )})`
          );

          if (argv.fix) {
            const version = packageLockJson.dependencies[foundPackage]
              ? packageLockJson.dependencies[foundPackage].version
              : /^@skyux/.test(foundPackage)
              ? '0.0.0-PLACEHOLDER'
              : undefined;

            if (!version) {
              errors.push(
                `A version could not be located for package ${foundPackage}. Is it installed?`
              );
            }

            // const range = `^${version}`;
            // packageJson.peerDependencies[foundPackage] = version;
            // console.log(
            //   `- Added (${foundPackage}@${range}) as a peer dependency to '${projectName}'.`
            // );
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
        errors.push(
          `The library '${projectName}' requests a peer of ${dependency} but it is not found in the source code. Please remove the peer from '${join(
            packageConfig.root,
            'package.json'
          )}'.`
        );
      }
    }
  }

  if (errors.length > 0) {
    errors.forEach((err) => console.error(` ✘ ${err}`));
    process.exit(1);
  }

  console.log(' ✔ Done checking library peers. OK.');
}

checkLibraryMissingPeers();
