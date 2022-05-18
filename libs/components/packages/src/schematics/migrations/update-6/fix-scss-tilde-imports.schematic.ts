import { extname } from '@angular-devkit/core';
import { FileVisitor, Rule } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';

/**
 * Replaces the tilde character in SCSS import statements with 'node_modules', since
 * support for the tilde was dropped in Angular 13.
 * @see: https://github.com/angular/components/commit/f2ff9e31425f0e395e6926bcaf48f876688000d8
 */
export default function fixScssTildeImports(): Rule {
  return async (tree) => {
    const visitor: FileVisitor = (filePath) => {
      const extension = extname(filePath);
      if (extension === '.scss' || extension === '.css') {
        const content = readRequiredFile(tree, filePath);

        const migratedContent = content.replace(
          /@(?:import|use) +['"](~.*)['"].*;?/g,
          (match, importPath) => {
            return match.replace(
              importPath,
              importPath
                // Replace leading tilde.
                .replace(/^~/, 'node_modules/')
                // Remove path extensions.
                .replace(/\.(s?css)$/, '')
            );
          }
        );

        if (content !== migratedContent) {
          tree.overwrite(filePath, migratedContent);
        }
      }
    };

    tree.getDir('projects').visit(visitor);
    tree.getDir('src').visit(visitor);
  };
}
