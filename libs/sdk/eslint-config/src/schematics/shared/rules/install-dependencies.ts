import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

export function installDependencies(): Rule {
  return (tree, context) => {
    context.addTask(new NodePackageInstallTask());

    const packages: Record<string, string> = {
      '@angular-eslint/eslint-plugin': '^15.2.1',
      '@angular-eslint/eslint-plugin-template': '^15.2.1',
      '@angular-eslint/template-parser': '^15.2.1',
      '@typescript-eslint/eslint-plugin': '^5.48.2',
      '@typescript-eslint/parser': '^5.48.2',
      'eslint-plugin-deprecation': '^1.4.1',
      eslint: '^8.36.0',
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
