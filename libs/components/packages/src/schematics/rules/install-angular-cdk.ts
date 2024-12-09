import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { VERSION } from '@angular/cli';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

export function installAngularCdk(): Rule {
  return (tree, context) => {
    context.addTask(new NodePackageInstallTask());

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@angular/cdk',
      version: `^${VERSION.major}.0.0`,
      overwrite: true,
    });
  };
}
