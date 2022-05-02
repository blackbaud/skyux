import { Rule } from '@angular-devkit/schematics';

import { replaceTypeScriptImports } from '../../rules/replace-typescript-imports';

/**
 * Replace imports from 'rxjs/internal-compatibility' with 'rxjs' since
 * this entry point was removed in RxJS v7.
 */
export default function fixRxJsInternalCompatibilityImports(): Rule {
  return replaceTypeScriptImports(
    (importStatement, importPath, fileContents) => {
      if (importPath === 'rxjs/internal-compatibility') {
        // Make sure 'from' isn't already imported.
        importStatement =
          /import +{[\s\w,]*from[\s\w,]*} +from\s+['"]rxjs['"]/.test(
            fileContents
          )
            ? ''
            : "import { from } from 'rxjs';";
      }

      return importStatement;
    },
    // Replace all occurances of 'fromPromise' with 'from'.
    (fileContents) => fileContents.replace(/fromPromise\(/g, 'from(')
  );
}
