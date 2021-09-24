import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import fs from 'fs-extra';
import getLatestVersion from 'latest-version';
import path from 'path';
import semver from 'semver';

import { readRequiredFile } from '../utility/tree';

const TARGET_PACKAGES_REGEXP =
  /^((@skyux(-sdk)?\/)|(@blackbaud\/)|(@blackbaud-internal\/skyux-.*)|(@angular(-devkit)?\/)|(ng-packagr)|(tslib))/;

async function ensureLatestVersions(
  context: SchematicContext,
  dependencies: {
    [_: string]: string;
  },
  packageGroup: {
    [_: string]: string;
  }
): Promise<void> {
  for (const packageName in dependencies) {
    if (TARGET_PACKAGES_REGEXP.test(packageName)) {
      let version = packageGroup[packageName]
        ? packageGroup[packageName]
        : dependencies[packageName];

      // Check if the version provided is valid.
      const validRange = semver.validRange(version);
      if (!validRange) {
        context.logger.warn(
          `Invalid range provided for "${packageName}" (wanted "${version}"). Skipping.`
        );
        continue;
      }

      // Convert the specific version into a range.
      version =
        validRange === version
          ? `^${version}`
          : `^${semver.minVersion(validRange)!.version}`;

      // Get the latest version from NPM.
      const latestVersion = await getLatestVersion(packageName, { version });

      if (latestVersion !== dependencies[packageName]) {
        context.logger.info(
          `Updated "${packageName}" from version (${dependencies[packageName]}) to (${latestVersion}).`
        );

        dependencies[packageName] = latestVersion;
      } else {
        context.logger.info(
          `Skipped "${packageName}" because it is already on the latest version.`
        );
      }
    }
  }
}

export default function ngAdd(): Rule {
  return async (tree, context) => {
    const packageJsonPath = 'package.json';
    const packageJson = JSON.parse(readRequiredFile(tree, packageJsonPath));

    const { packageGroup } = fs.readJsonSync(
      path.resolve(__dirname, '../../../package.json')
    )['ng-update'];

    await ensureLatestVersions(context, packageJson.dependencies, packageGroup);
    await ensureLatestVersions(
      context,
      packageJson.devDependencies,
      packageGroup
    );

    tree.overwrite(packageJsonPath, JSON.stringify(packageJson, undefined, 2));

    context.addTask(new NodePackageInstallTask());
  };
}
