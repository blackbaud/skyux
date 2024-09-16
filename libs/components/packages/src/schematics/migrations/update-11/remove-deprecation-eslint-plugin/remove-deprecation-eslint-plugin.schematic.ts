import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { JsonFile } from '../../../utility/json-file';

/**
 * Remove the deprecation ESLint plugin as it is not compatible with ESLint 9. A new compatible rule is now set using `@typescript/eslint`
 */
export default function removeDeprecationPlugin(): Rule {
  return (tree, context) => {
    if (getPackageJsonDependency(tree, '@skyux-sdk/eslint-config') !== null) {
      const packageJsonPath = '/package.json';

      const filePath = '/.eslintrc.json';
      let eslintConfig: JsonFile | undefined;
      try {
        eslintConfig = new JsonFile(tree, filePath);
      } finally {
        if (eslintConfig?.content.indexOf('deprecation') === -1) {
          removePackageJsonDependency(
            tree,
            'eslint-plugin-deprecation',
            packageJsonPath,
          );
        }
      }
    }

    context.addTask(new NodePackageInstallTask());
  };
}
