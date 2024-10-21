import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fsPromises from 'node:fs/promises';
import path from 'node:path';

function hardenPackageVersion(): Rule {
  return async (tree) => {
    const thisPackageJson = JSON.parse(
      await fsPromises.readFile(
        path.resolve(__dirname, '../../../package.json'),
        { encoding: 'utf-8' },
      ),
    );

    addPackageJsonDependency(tree, {
      name: thisPackageJson.name,
      version: thisPackageJson.version,
      type: NodeDependencyType.Dev,
    });
  };
}

export default function ngAdd(): Rule {
  return (tree, context) => {
    if (
      !getPackageJsonDependency(tree, '@angular-eslint/schematics') &&
      !getPackageJsonDependency(tree, 'angular-eslint')
    ) {
      throw new Error(
        "The package 'angular-eslint' is not installed. " +
          "Run 'ng add @angular-eslint/schematics' and try this command again.\n" +
          'See: https://github.com/angular-eslint/angular-eslint#quick-start',
      );
    }

    context.addTask(new NodePackageInstallTask());

    return chain([hardenPackageVersion()]);
  };
}
