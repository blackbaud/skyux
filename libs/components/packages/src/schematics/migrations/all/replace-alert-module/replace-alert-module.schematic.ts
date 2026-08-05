import { Rule } from '@angular-devkit/schematics';

import { parseSourceFile } from '../../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../../utility/visit-project-files';

/**
 * Replaces the deprecated `SkyAlertModule` with the standalone `SkyAlert`
 * component in consumer TypeScript files.
 */
export default function replaceAlertModule(): Rule {
  return (tree) => {
    visitProjectFiles(tree, '', (filePath) => {
      if (
        !filePath.endsWith('.ts') ||
        !tree.readText(filePath).includes('SkyAlertModule')
      ) {
        return;
      }

      const recorder = tree.beginUpdate(filePath);

      swapImportedClass(recorder, filePath, parseSourceFile(tree, filePath), [
        {
          classNames: { SkyAlertModule: 'SkyAlert' },
          moduleName: '@skyux/indicators',
        },
      ]);

      tree.commitUpdate(recorder);
    });
  };
}
