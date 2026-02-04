import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

interface UpdateDependencyOptions {
  ifThisPackageIsInstalled: string;
  installThese: Record<string, string>;
  type?: NodeDependencyType;
}

/**
 * Conditionally update dependencies if another package is being used.
 */
export default function updateDependency(
  options: UpdateDependencyOptions,
): Rule {
  return (tree, context) => {
    if (
      getPackageJsonDependency(tree, options.ifThisPackageIsInstalled) !== null
    ) {
      Object.keys(options.installThese).forEach((name) => {
        removePackageJsonDependency(tree, name);
      });
      Object.entries(options.installThese).forEach(([name, version]) => {
        addPackageJsonDependency(tree, {
          name,
          version,
          type: options.type ?? NodeDependencyType.Default,
          overwrite: true,
        });
      });
    }

    context.addTask(new NodePackageInstallTask());
  };
}
