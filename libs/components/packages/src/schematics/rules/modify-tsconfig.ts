import { Rule } from '@angular-devkit/schematics';

import { JsonFile } from '../utility/json-file';

export function modifyTsConfig(): Rule {
  return (tree) => {
    const filePath = '/tsconfig.json';
    const tsConfig = new JsonFile(tree, filePath);

    // Allow importing JSON files.
    tsConfig.modify(['compilerOptions', 'resolveJsonModule'], true);
  };
}
