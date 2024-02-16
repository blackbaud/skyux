import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

/**
 * Sets axe-core to ~4.8.3. We can't put this in the ng-update.packageGroup
 * because we only want to update a customer's axe-core version if they've
 * installed @skyux-sdk/testing.
 */
export default function updateAxeCore(): Rule {
  return (tree, context) => {
    if (getPackageJsonDependency(tree, '@skyux-sdk/testing') !== null) {
      const axeCore = getPackageJsonDependency(tree, 'axe-core');

      if (axeCore !== null) {
        axeCore.version = '~4.8.3';
        axeCore.overwrite = true;

        addPackageJsonDependency(tree, axeCore, 'package.json');

        context.addTask(new NodePackageInstallTask());
      }
    }
  };
}
