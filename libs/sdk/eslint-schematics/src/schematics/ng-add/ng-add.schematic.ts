import { Rule, chain } from '@angular-devkit/schematics';

import { JsonFile } from '../utility/json-file';

function modifyTsConfig(): Rule {
  return (tree) => {
    const tsconfig = new JsonFile(tree, '/tsconfig.json');

    // Strict null checks are needed for the '@typescript/eslint:prefer-nullish-coalescing' rule.
    // The `strict` option also sets `strictNullChecks` so we can abort if it's set to true.
    if (tsconfig.get(['compilerOptions', 'strict']) !== true) {
      tsconfig.modify(['compilerOptions', 'strictNullChecks'], true);
    }
  };
}

/**
 * Installs and sets up the `eslint-config-skyux` package.
 */
export default function ngAdd(): Rule {
  return () => {
    return chain([modifyTsConfig()]);
  };
}
