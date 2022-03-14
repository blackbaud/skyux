import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { readRequiredFile } from '../../utility/tree';

export default function (): Rule {
  return async (tree, context) => {
    const filePath = 'package.json';
    const relevantPackages = ['@skyux/flyout'];
    const packageJson = JSON.parse(readRequiredFile(tree, filePath));
    let packageFound = false;

    for (const relevantPackage of relevantPackages) {
      if (packageJson.dependencies[relevantPackage]) {
        packageFound = true;
        break;
      }
    }

    if (packageFound) {
      // Run Thing
      context.addTask(new NodePackageInstallTask());

      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: '@angular/cdk',
        version: '^12.0.0',
        overwrite: true,
      });
    }
  };
}
