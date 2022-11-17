import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { readRequiredFile } from '../utility/tree';

type PackageDetails = {
  name: string;
  version: string;
  type: NodeDependencyType;
};

function installPackages(packages: PackageDetails[]): Rule {
  return (tree, context) => {
    for (const details of packages) {
      // Remove the package (if it exists) so we can ensure it's added to the appropriate section.
      removePackageJsonDependency(tree, details.name, '/package.json');
      addPackageJsonDependency(tree, {
        type: details.type,
        name: details.name,
        version: details.version,
      });
    }

    context.addTask(new NodePackageInstallTask());
  };
}

/**
 * Ensures peer dependencies for a given package are installed on the client's workspace.
 * If the client does not use the target package, this function is skipped.
 * @param targetPackageName The name of the package that has peer dependencies.
 * @param peers The target package's peer dependencies to install on the client's workspace.
 */
export function ensurePeersInstalled(
  targetPackageName: string,
  peers: PackageDetails[]
): Rule {
  return (tree) => {
    const packageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    } = JSON.parse(readRequiredFile(tree, '/package.json'));

    const dependencies: Record<string, string> = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    return dependencies[targetPackageName] ? installPackages(peers) : undefined;
  };
}
