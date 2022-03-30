import { extname } from '@angular-devkit/core';
import { Rule } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';

/**
 * Replaces the tilde character in SCSS import statements with 'node_modules', since support for
 * the tilde was dropped in Angular 13.
 * @see: https://github.com/angular/components/commit/f2ff9e31425f0e395e6926bcaf48f876688000d8
 */
export default function fixScssTildeImports(): Rule {
  return async (tree) => {
    tree.visit((filePath) => {
      const extension = extname(filePath);
      if (extension === '.scss' || extension === '.css') {
        const content = readRequiredFile(tree, filePath);

        const migratedContent = content
          // Simply remove the tilde for known @skyux/theme imports, since we added exports for these
          // files in libs/components/theme/package.json.
          .replace(
            /@(?:import|use) +['"]~@skyux\/theme\/scss\/(variables|mixins).*['"].*;?/g,
            (match) => {
              return match.replace('~', '');
              // const index = match.indexOf('~');
              // return match.slice(0, index) + match.slice(index + 1);
            }
          )
          // For all other tilde imports, replace with 'node_modules'.
          .replace(/@(?:import|use) +['"]~.*['"].*;?/g, (match) => {
            // const index = match.indexOf('~');
            // return (
            //   match.slice(0, index) + 'node_modules/' + match.slice(index + 1)
            // );
            return match.replace('~', 'node_modules/');
          });

        if (content !== migratedContent) {
          tree.overwrite(filePath, migratedContent);
        }
      }
    });
  };
}
