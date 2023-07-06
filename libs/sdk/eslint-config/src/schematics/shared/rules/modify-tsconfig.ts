import { Rule } from '@angular-devkit/schematics';

import { JsonFile } from '../utility/json-file';

export function modifyTsConfig(): Rule {
  return (tree) => {
    const tsConfig = new JsonFile(tree, '/tsconfig.json');

    // Strict null checks are needed for the 'prefer-nullish-coalescing' rule.
    tsConfig.modify(['compilerOptions', 'strictNullChecks'], true);
  };
}
