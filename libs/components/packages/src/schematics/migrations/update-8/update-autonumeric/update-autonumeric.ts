import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

export const UPDATE_TO_VERSION = '4.8.1';

/**
 * Update the version of the `autonumeric` dependency.
 */
function updateVersion(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const autonumericDependency = getPackageJsonDependency(tree, 'autonumeric');

    // Autonumeric is not installed, so we don't need to do anything.
    if (!autonumericDependency) {
      return;
    }

    let type = NodeDependencyType.Default;
    const overwrite = true;
    const version = UPDATE_TO_VERSION;

    addPackageJsonDependency(tree, {
      name: `autonumeric`,
      overwrite,
      type,
      version,
    });

    context.addTask(new NodePackageInstallTask());
  };
}

/**
 * Upgrade to `autonumeric` version `4.8.1`.
 */
export default function (): Rule {
  return chain([updateVersion()]);
}
