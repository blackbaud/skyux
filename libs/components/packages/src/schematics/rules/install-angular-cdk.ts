import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

export function installAngularCdk(): Rule {
  return async (tree, context) => {
    context.addTask(new NodePackageInstallTask());

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@angular/cdk',
      version: '^13.0.0',
      overwrite: true,
    });
  };
}
