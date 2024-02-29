import { Rule } from '@angular-devkit/schematics';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

export function addPrettierDependencies(): Rule {
  return (tree, context) => {
    context.logger.info('Adding Prettier dependencies...');

    addPackageJsonDependency(tree, {
      name: 'prettier',
      type: NodeDependencyType.Dev,
      version: '3.2.5',
      overwrite: true,
    });

    addPackageJsonDependency(tree, {
      name: 'eslint-config-prettier',
      type: NodeDependencyType.Dev,
      version: '9.1.0',
      overwrite: true,
    });
  };
}
