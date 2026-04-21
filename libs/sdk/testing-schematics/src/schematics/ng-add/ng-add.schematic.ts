import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

function installDependencies(): Rule {
  return (tree, context) => {
    let packageJson: Record<string, unknown>;

    try {
      packageJson = require('@skyux-sdk/testing/package.json');
    } catch {
      throw new Error(
        'Could not resolve @skyux-sdk/testing/package.json. ' +
          'Ensure @skyux-sdk/testing is installed.',
      );
    }

    const axeCoreVersion = (
      packageJson['ng-update'] as Record<string, Record<string, string>>
    )?.['packageGroup']?.['axe-core'];

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Dev,
      name: 'axe-core',
      version: axeCoreVersion,
      overwrite: true,
    });

    context.addTask(new NodePackageInstallTask());
  };
}

export default function ngAdd(): Rule {
  return chain([installDependencies()]);
}
