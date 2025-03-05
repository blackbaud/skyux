import { Rule, Tree, chain } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { ensurePeersInstalled } from '../../../rules/ensure-peers-installed';
import { moveClassToLibrary } from '../../../utility/move-class-to-library';
import { visitProjectFiles } from '../../../utility/visit-project-files';

export default function (): Rule {
  return chain([
    ensurePeersInstalled('@skyux/indicators', [
      {
        matchVersion: true,
        name: '@skyux/icon',
        type: NodeDependencyType.Default,
      },
    ]),
    (tree: Tree): void => {
      visitProjectFiles(tree, '', (filePath) => {
        if (!filePath.endsWith('.ts')) {
          return;
        }

        moveClassToLibrary(tree, filePath, {
          classNames: [
            'SkyIconStackItem',
            'SkyIconModule',
            'SkyIconType',
            'SkyIconVariantType',
          ],
          previousLibrary: '@skyux/indicators',
          newLibrary: '@skyux/icon',
        });

        moveClassToLibrary(tree, filePath, {
          classNames: ['SkyIconHarness', 'SkyIconHarnessFilters'],
          previousLibrary: '@skyux/indicators/testing',
          newLibrary: '@skyux/icon/testing',
        });
      });
    },
  ]);
}
