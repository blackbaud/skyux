import { Tree, chain } from '@angular-devkit/schematics';
import { parseSourceFile } from '@angular/cdk/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { ensurePeersInstalled } from '../../../rules/ensure-peers-installed';
import { moveClassToLibrary } from '../../../utility/move-class-to-library';

export default function () {
  return chain([
    ensurePeersInstalled('@skyux/indicators', [
      {
        matchVersion: true,
        name: '@skyux/icon',
        type: NodeDependencyType.Default,
      },
    ]),
    (tree: Tree) => {
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
        /* safety check */
        /* istanbul ignore if */
        if (!sourceFile) {
          return;
        }

        moveClassToLibrary(tree, path, sourceFile, content, {
          classNames: [
            'SkyIconStackItem',
            'SkyIconModule',
            'SkyIconType',
            'SkyIconVariantType',
          ],
          previousLibrary: '@skyux/indicators',
          newLibrary: '@skyux/icon',
        });
      });
    },
  ]);
}
