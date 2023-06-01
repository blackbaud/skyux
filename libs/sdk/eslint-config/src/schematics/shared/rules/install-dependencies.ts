import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { getLatestVersion } from '../utility/get-latest-version';

export function installDependencies(): Rule {
  return async (tree, context) => {
    context.addTask(new NodePackageInstallTask());

    const packages: Record<string, string> = {
      'eslint-plugin-deprecation': await getLatestVersion(
        'eslint-plugin-deprecation',
        '^1.4.1'
      ),
    };

    for (const [packageName, version] of Object.entries(packages)) {
      addPackageJsonDependency(tree, {
        name: packageName,
        type: NodeDependencyType.Dev,
        version,
        overwrite: true,
      });
    }
  };
}
