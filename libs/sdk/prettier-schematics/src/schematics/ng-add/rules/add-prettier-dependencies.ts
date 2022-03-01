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
      version: '2.4.1',
      overwrite: true,
    });

    addPackageJsonDependency(tree, {
      name: 'eslint-config-prettier',
      type: NodeDependencyType.Dev,
      version: '8.3.0',
      overwrite: true,
    });
  };
}
