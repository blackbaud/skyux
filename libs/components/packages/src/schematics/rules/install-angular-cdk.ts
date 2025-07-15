import { Rule } from '@angular-devkit/schematics';
import { VERSION } from '@angular/cli';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

export function installAngularCdk(): Rule {
  return (tree) => {
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@angular/cdk',
      version: `^${VERSION.major}.0.0`,
      overwrite: true,
    });
  };
}
