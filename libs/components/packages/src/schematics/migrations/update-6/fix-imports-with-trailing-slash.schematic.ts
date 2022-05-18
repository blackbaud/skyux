import { Rule } from '@angular-devkit/schematics';

import { replaceTypeScriptImports } from '../../rules/replace-typescript-imports';

export default function fixImportsWithTrailingSlash(): Rule {
  return replaceTypeScriptImports((importStatement, importPath) => {
    if (importPath.endsWith('/')) {
      return importStatement.replace(importPath, importPath.slice(0, -1));
    }
    return importStatement;
  });
}
