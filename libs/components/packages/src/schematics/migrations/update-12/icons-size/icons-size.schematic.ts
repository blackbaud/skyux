import { Rule, Tree } from '@angular-devkit/schematics';

import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

const NO_SIZE_REGEX =
  /(?<beforeEnd><sky-icon(?![^>]* size=)(?![^>]*(?:size|iconSize)=))/g;

function addSize(html: string): string {
  return html.replaceAll(
    NO_SIZE_REGEX,
    (_, beforeEnd) => `${beforeEnd} size="md"`,
  );
}

async function updateSourceFiles(tree: Tree): Promise<void> {
  const { workspace } = await getWorkspace(tree);

  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
        const content = tree.readText(filePath);
        const updatedContent = addSize(content);

        if (updatedContent !== content) {
          tree.overwrite(filePath, updatedContent);
        }
      }
    });
  });
}

/**
 * Adds `size` to all icon components.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    await updateSourceFiles(tree);
  };
}
