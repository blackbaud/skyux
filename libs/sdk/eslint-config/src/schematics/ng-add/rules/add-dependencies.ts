import { Rule } from '@angular-devkit/schematics';

// import {
//   NodeDependencyType,
//   addPackageJsonDependency,
// } from '@schematics/angular/utility/dependencies';

export function addDependencies(): Rule {
  return (tree, context) => {
    context.logger.info('Adding dependencies...');

    // addPackageJsonDependency(tree, {
    //   name: 'prettier',
    //   type: NodeDependencyType.Dev,
    //   version: '2.8.4',
    //   overwrite: true,
    // });

    // addPackageJsonDependency(tree, {
    //   name: 'eslint-config-prettier',
    //   type: NodeDependencyType.Dev,
    //   version: '8.7.0',
    //   overwrite: true,
    // });
  };
}
