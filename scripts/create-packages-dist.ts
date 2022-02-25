import {
  existsSync,
  readFile,
  readJson,
  removeSync,
  writeFile,
} from 'fs-extra';
import { join } from 'path';

import { PackageJson } from './shared/package-json';

import { createDocumentationJson } from './lib/create-documentation-json';
import { getPublishableProjects } from './lib/get-publishable-projects';
import { getSkyuxDevConfig } from './lib/get-skyux-dev-config';
import { inlineExternalResourcesPaths } from './lib/inline-external-resources-paths';
import { verifyPackagesDist } from './lib/verify-packages-dist';

import { runCommand } from './utils/spawn';

/**
 * Replaces any occurrence of '0.0.0-PLACEHOLDER' with a version number.
 */
async function replacePlaceholderTextWithVersion(
  filePath: string,
  skyuxVersion: string,
  skyuxPackagesVersion: string
) {
  const contents = (await readFile(filePath))
    .toString()
    .replace(/0\.0\.0-PLACEHOLDER/g, skyuxVersion)
    .replace(/0\.0\.0-PACKAGES_PLACEHOLDER/g, skyuxPackagesVersion);
  await writeFile(filePath, contents);
}

async function createPackagesDist(): Promise<void> {
  try {
    console.log('Creating distribution packages for all libraries...');

    const cwd = process.cwd();

    const skyuxDevConfig = await getSkyuxDevConfig();

    const packageJson: PackageJson = await readJson(join(cwd, 'package.json'));

    const skyuxVersion = packageJson.version;

    // Add 1000 to the minor version number.
    // e.g. 5.5.1 --> 5.1005.1
    const skyuxPackagesVersion = packageJson.version.replace(
      /\.([0-9])\./,
      (match, group) => {
        return match.replace(/[0-9]/, `${+group + 1000}`);
      }
    );

    await removeSync('dist');

    const distPackages = await getPublishableProjects();
    const projectNames = Object.keys(distPackages);

    // Build all libraries.
    await runCommand(
      'npx',
      [
        'nx',
        'run-many',
        '--target=build',
        `--projects=${projectNames.join(',')}`,
        '--parallel',
        '--maxParallel=2',
      ],
      {
        stdio: 'inherit',
      }
    );

    // Run postbuild steps.
    await runCommand(
      'npx',
      [
        'nx',
        'run-many',
        '--target=postbuild',
        `--projects=${projectNames.join(',')}`,
        '--parallel',
        '--maxParallel=2',
      ],
      {
        stdio: 'inherit',
      }
    );

    for (const projectName in distPackages) {
      const distPackage = distPackages[projectName];

      await replacePlaceholderTextWithVersion(
        join(distPackage.distRoot!, 'package.json'),
        skyuxVersion,
        skyuxPackagesVersion
      );

      inlineExternalResourcesPaths(distPackage.distRoot!);

      if (!skyuxDevConfig.documentation.excludeProjects.includes(projectName)) {
        await createDocumentationJson(projectName, distPackage);
      }

      const migrationCollectionJsonPath = join(
        distPackage.distRoot!,
        'src/schematics/migrations/migration-collection.json'
      );

      if (existsSync(migrationCollectionJsonPath)) {
        await replacePlaceholderTextWithVersion(
          migrationCollectionJsonPath,
          skyuxVersion,
          skyuxPackagesVersion
        );
      }
    }

    await verifyPackagesDist(distPackages, packageJson);

    console.log(' ✔ Done creating distribution packages for all libraries.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createPackagesDist();
