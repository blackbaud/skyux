import { Rule, chain } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { ensurePeersInstalled } from '../../../rules/ensure-peers-installed';
import { readRequiredFile } from '../../../utility/tree';
import { getWorkspace } from '../../../utility/workspace';

function renameTypeScriptImportPaths(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    for (const [, projectDefinition] of workspace.projects.entries()) {
      tree.getDir(projectDefinition.root).visit((filePath) => {
        if (filePath.match(/\.ts$/)) {
          const content = readRequiredFile(tree, filePath);

          const updatedContent = content.replace(
            /import {\s*(?:\w|,|\s)+\s*} from ['"](@circlon)\/angular-tree-component(?:\w|\/)*['"];/g,
            (match, importPath) => match.replace(importPath, '@blackbaud')
          );

          if (updatedContent !== content) {
            tree.overwrite(filePath, updatedContent);
          }
        }
      });
    }
  };
}

export default function (): Rule {
  return chain([
    renameTypeScriptImportPaths(),
    ensurePeersInstalled(
      '@skyux/angular-tree-component',
      [
        {
          name: '@blackbaud/angular-tree-component',
          version: '1.0.0-alpha.0',
          type: NodeDependencyType.Default,
        },
      ],
      [
        {
          name: '@circlon/angular-tree-component',
        },
      ]
    ),
  ]);
}
