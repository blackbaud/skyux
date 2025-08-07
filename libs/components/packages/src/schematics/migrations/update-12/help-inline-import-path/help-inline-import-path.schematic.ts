import { Tree } from '@angular-devkit/schematics';
import { isImported, parseSourceFile } from '@angular/cdk/schematics';

import { moveClassToLibrary } from '../../../utility/move-class-to-library';
import { visitProjectFiles } from '../../../utility/visit-project-files';

export default function () {
  return (tree: Tree): void => {
    visitProjectFiles(tree, '', (path) => {
      if (!path.endsWith('.ts')) {
        return;
      }

      const sourceFile = parseSourceFile(tree, path);

      if (
        !sourceFile ||
        !isImported(sourceFile, 'SkyHelpInlineModule', '@skyux/indicators')
      ) {
        return;
      }

      moveClassToLibrary(tree, path, {
        classNames: ['SkyHelpInlineModule'],
        previousLibrary: '@skyux/indicators',
        newLibrary: '@skyux/help-inline',
      });
    });
  };
}
