import { extname } from '@angular-devkit/core';
import { FileVisitor, Rule } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';

/**
 * Convert any occurance of `ngUnsubscribe` from `Subject<any>` to `Subject<void>`.
 * @see https://github.com/ReactiveX/rxjs/issues/6324#issuecomment-831645897
 */
export default function fixNgUnsubscribeGenerics(): Rule {
  return (tree) => {
    const visitor: FileVisitor = (filePath) => {
      const extension = extname(filePath);
      if (extension === '.ts') {
        const content = readRequiredFile(tree, filePath);

        const migratedContent = content.replace(
          /(?:ngUnsubscribe).*(Subject<any>)/g,
          (match, group) => {
            return match.replace(group, group.replace('<any>', '<void>'));
          }
        );

        if (migratedContent !== content) {
          tree.overwrite(filePath, migratedContent);
        }
      }
    };

    tree.getDir('projects').visit(visitor);
    tree.getDir('src').visit(visitor);
  };
}
