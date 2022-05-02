import { extname } from '@angular-devkit/core';
import { FileVisitor, Rule } from '@angular-devkit/schematics';

import { readRequiredFile } from '../utility/tree';

/**
 * Calls a replacer function on every import statement of every TypeScript file in the tree.
 * If changes are made to the import statements, you may call the `beforeFileUpdate` callback
 * to make any changes to the file's contents before the file is updated on the file system.
 * @param importStatementReplacer Returns the updated import statement.
 * @param beforeFileUpdate Returns the updated file contents.
 */
export function replaceTypeScriptImports(
  importStatementReplacer: (
    importStatement: string,
    importPath: string,
    fileContents: string
  ) => string,
  beforeFileUpdate: (fileContents: string) => string = (content) => content
): Rule {
  return (tree) => {
    const visitor: FileVisitor = (filePath) => {
      const extension = extname(filePath);
      if (extension === '.ts') {
        const contents = readRequiredFile(tree, filePath);

        const migratedContents = contents.replace(
          /import +{?[\w,\s]+}? +from +['"](.*)['"];?/g,
          (importStatement, importPath) => {
            return importStatementReplacer(
              importStatement,
              importPath,
              contents
            );
          }
        );

        if (contents !== migratedContents) {
          tree.overwrite(filePath, beforeFileUpdate(migratedContents));
        }
      }
    };

    tree.getDir('projects').visit(visitor);
    tree.getDir('src').visit(visitor);
  };
}
