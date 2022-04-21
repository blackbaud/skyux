import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { readRequiredFile } from '../../utility/tree';

export default function (): Rule {
  return async (tree, context) => {
    const packageJson = JSON.parse(readRequiredFile(tree, 'package.json'));

    const packagesThatDependOnCdk = ['@skyux/flyout'];

    const dependencies = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    let packageFound = false;
    for (const packageName of packagesThatDependOnCdk) {
      if (dependencies[packageName]) {
        packageFound = true;
        break;
      }
    }

    if (packageFound) {
      context.addTask(new NodePackageInstallTask());

      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: '@angular/cdk',
        version: '^13.0.0',
        overwrite: true,
      });
    }
  };
}
