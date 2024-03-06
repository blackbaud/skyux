import { Rule, Tree } from '@angular-devkit/schematics';

import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

const TAB_INDEX_BRACKETS_REGEX =
  /(?<beforeTabIndex><sky-tab[^>]+)\[tabIndex\]=/g;
const TAB_INDEX_NO_BRACKETS_REGEX =
  /(?<beforeTabIndex><sky-tab[^>]+)tabIndex=/g;

function renameTabIndex(html: string): string {
  return html
    .replaceAll(
      TAB_INDEX_BRACKETS_REGEX,
      (_, beforeTabIndex) => `${beforeTabIndex}[tabIndexValue]=`,
    )
    .replaceAll(
      TAB_INDEX_NO_BRACKETS_REGEX,
      (_, beforeTabIndex) => `${beforeTabIndex}tabIndexValue=`,
    );
}

async function updateSourceFiles(tree: Tree): Promise<void> {
  const { workspace } = await getWorkspace(tree);
  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      const content = tree.readText(filePath);
      const updatedContent = renameTabIndex(content);

      if (updatedContent !== content) {
        tree.overwrite(filePath, updatedContent);
      }
    });
  });
}

/**
 * Rename tabIndex inputs on sky-tab to tabIndexValue.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    await updateSourceFiles(tree);
  };
}
