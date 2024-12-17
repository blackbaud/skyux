import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import * as semver from 'semver';

import { readRequiredFile } from '../utility/tree';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Ensures a given package is installed at a given version.
 * If the client does not use the target package, this function is skipped.
 * @param targetPackageName The name of the package that has peer dependencies.
 * @param newVersion The target package's version to install on the client's workspace.
 * @param currentVersionCheck The version that the target package's prior version must be for the upgrade to occur. If the target package's prior version does not meet the criteria, this function is skipped.
 */
export function updateInstalledPackage(
  targetPackageName: string,
  newVersion: string,
  currentVersionCheck?: string,
): Rule {
  return (tree, context) => {
    const packageJson: PackageJson = JSON.parse(
      readRequiredFile(tree, '/package.json'),
    );

    const dependencies: Record<string, string> = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    const upgrade =
      !!dependencies[targetPackageName] &&
      (!currentVersionCheck ||
        semver.satisfies(dependencies[targetPackageName], currentVersionCheck));

    if (upgrade) {
      context.addTask(new NodePackageInstallTask());

      return addPackageJsonDependency(tree, {
        type: packageJson.dependencies?.[targetPackageName]
          ? NodeDependencyType.Default
          : NodeDependencyType.Dev,
        name: targetPackageName,
        version: newVersion,
        overwrite: true,
      });
    }
  };
}
