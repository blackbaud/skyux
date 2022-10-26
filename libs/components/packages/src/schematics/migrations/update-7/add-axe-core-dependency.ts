import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { readRequiredFile } from '../../utility/tree';

export default function (): Rule {
  return async (tree, context) => {
    const packageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    } = JSON.parse(readRequiredFile(tree, '/package.json'));

    const dependencies: Record<string, string> = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    if (dependencies['@skyux-sdk/testing']) {
      context.addTask(new NodePackageInstallTask());

      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Dev,
        name: 'axe-core',
        version: '3.5.6',
        overwrite: false,
      });
    }
  };
}
