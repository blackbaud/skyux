import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependency,
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

const AXE_CORE_PACKAGE = 'axe-core';
const AXE_CORE_VERSION = '~4.10.0';

/**
 * Sets axe-core to ~4.10.0. We can't put this in the ng-update.packageGroup
 * because we only want to update a customer's axe-core version if they've
 * installed @skyux-sdk/testing.
 */
export default function updateAxeCore(): Rule {
  return (tree, context) => {
    if (getPackageJsonDependency(tree, '@skyux-sdk/testing') !== null) {
      const axeCore: NodeDependency = {
        name: AXE_CORE_PACKAGE,
        version: AXE_CORE_VERSION,
        type: NodeDependencyType.Dev,
        overwrite: true,
      };

      const packageJsonPath = '/package.json';

      removePackageJsonDependency(tree, AXE_CORE_PACKAGE, packageJsonPath);
      addPackageJsonDependency(tree, axeCore, packageJsonPath);
    }

    context.addTask(new NodePackageInstallTask());
  };
}
