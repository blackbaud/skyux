import { Rule } from '@angular-devkit/schematics';

import { replaceTypeScriptImports } from '../../rules/replace-typescript-imports';

/**
 * Remove deep imports to '@skyux' packages.
 */
export default function fixDeepImports(): Rule {
  return replaceTypeScriptImports((importStatement, importPath) => {
    const fragments = importPath.split('/');
    if (
      fragments.length > 2 &&
      fragments[0] === '@skyux' &&
      fragments[2] !== 'testing'
    ) {
      return importStatement.replace(
        importPath,
        `${fragments[0]}/${fragments[1]}`
      );
    }
    return importStatement;
  });
}
