import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { readRequiredFile } from '../utility/tree';

interface PackageDetails {
  matchVersion?: boolean;
  name: string;
  version?: string;
  type: NodeDependencyType;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function installPackages(
  packages: PackageDetails[],
  targetPackageVersion?: string,
): Rule {
  return (tree, context) => {
    for (const details of packages) {
      // Remove the package (if it exists) so we can ensure it's added to the appropriate section.
      removePackageJsonDependency(tree, details.name, '/package.json');

      const version = targetPackageVersion;

      if (version) {
        addPackageJsonDependency(tree, {
          type: details.type,
          name: details.name,
          version,
        });
      }
    }

    context.addTask(new NodePackageInstallTask());
  };
}

/**
 * Ensures peer dependencies for a given package are installed on the client's workspace.
 * If the client does not use the target package, this function is skipped.
 * @param targetPackageName The name of the package that has peer dependencies.
 * @param peers The target package's peer dependencies to install on the client's workspace.
 * @param peersToRemove The target package's prior peer dependencies that should be removed. NOTE: This should be done with extreme caution and only on things that we have high certainty won't be there for other reasons.
 */
export function ensurePeersInstalled(
  targetPackageName: string,
  peers: PackageDetails[],
): Rule {
  return (tree) => {
    const packageJson: PackageJson = JSON.parse(
      readRequiredFile(tree, '/package.json'),
    );
    const targetPackageVersion =
      packageJson.dependencies?.[targetPackageName] ??
      packageJson.devDependencies?.[targetPackageName];

    const dependencies: Record<string, string> = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    return dependencies[targetPackageName]
      ? chain([installPackages(peers, targetPackageVersion)])
      : undefined;
  };
}
