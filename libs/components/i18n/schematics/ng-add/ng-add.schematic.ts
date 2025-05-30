import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { getSkyuxVersion } from '../utility/get-skyux-version';
import { readRequiredFile } from '../utility/tree';

function addPackageJsonScript(): Rule {
  return (tree) => {
    const packageJson = JSON.parse(
      readRequiredFile(tree, 'package.json').toString(),
    );

    packageJson.scripts = packageJson.scripts || {};

    packageJson.scripts['skyux:generate-lib-resources-module'] =
      'ng generate @skyux/i18n:lib-resources-module';

    tree.overwrite('package.json', JSON.stringify(packageJson, undefined, 2));
  };
}

export default function ngAdd(): Rule {
  return (tree, context) => {
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/assets',
      version: getSkyuxVersion(),
      overwrite: true,
    });

    context.addTask(new NodePackageInstallTask());

    return chain([addPackageJsonScript()]);
  };
}
