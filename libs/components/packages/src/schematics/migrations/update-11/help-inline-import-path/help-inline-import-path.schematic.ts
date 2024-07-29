import { Tree } from '@angular-devkit/schematics';
import { isImported, parseSourceFile } from '@angular/cdk/schematics';

import { moveClassToLibrary } from '../../../utility/move-class-to-library';

export default function () {
  return (tree: Tree) => {
    tree.visit((path, entry) => {
      if (
        !path.endsWith('.ts') ||
        path.includes('__skyux') ||
        path.includes('node_modules')
      ) {
        return;
      }
      const content = entry?.content.toString();
      if (!content) {
        return;
      }

      const sourceFile = parseSourceFile(tree, path);
      if (
        !sourceFile ||
        !isImported(sourceFile, 'SkyHelpInlineModule', '@skyux/indicators')
      ) {
        return;
      }

      moveClassToLibrary(tree, path, sourceFile, content, {
        classNames: ['SkyHelpInlineModule'],
        previousLibrary: '@skyux/indicators',
        newLibrary: '@skyux/help-inline',
      });
    });
  };
}
