import { Rule } from '@angular-devkit/schematics';

import { JsonFile } from '../utility/json-file';

/**
 * Configures TypeScript to meet requirements of our libraries.
 */
export function modifyTsConfig(): Rule {
  return (tree) => {
    const filePath = '/tsconfig.json';
    const tsConfig = new JsonFile(tree, filePath);

    // Allow importing default exports from ECMAScript modules.
    tsConfig.modify(['compilerOptions', 'esModuleInterop'], true);

    // Forces the casing of imports to match the file name's casing.
    tsConfig.modify(
      ['compilerOptions', 'forceConsistentCasingInFileNames'],
      true
    );

    // Allow importing JSON files.
    tsConfig.modify(['compilerOptions', 'resolveJsonModule'], true);
  };
}
