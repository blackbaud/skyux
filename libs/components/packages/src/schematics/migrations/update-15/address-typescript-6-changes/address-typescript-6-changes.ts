import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { convertSourceFiles } from './lib/convert-source-files';
import { buildTsconfigModel } from './lib/tsconfig-model';
import { updateTsconfigFiles } from './lib/update-tsconfig-files';

/**
 * Prepares a workspace for TypeScript 6: converts implicit-`baseUrl` imports
 * to relative imports and legacy `module Foo {}` namespaces before removing
 * `baseUrl` (rebasing `paths`), and cleans up deprecated/default tsconfig
 * compiler options.
 */
export default function addressTypescript6Changes(): Rule {
  return (tree: Tree, context: SchematicContext): void => {
    const model = buildTsconfigModel(tree);

    convertSourceFiles(tree, model, context);
    updateTsconfigFiles(tree, model, context);
  };
}
