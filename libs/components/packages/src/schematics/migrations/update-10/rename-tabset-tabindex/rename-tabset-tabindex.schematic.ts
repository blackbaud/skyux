import { Rule, Tree } from '@angular-devkit/schematics';

import cheerio from 'cheerio';

import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

function replaceTabIndexAttr(
  $elem: cheerio.Cheerio,
  oldName: string,
  newName: string,
): void {
  const value = $elem.attr(oldName);

  if (value) {
    $elem.attr(newName, value);

    $elem.removeAttr(oldName);
  }
}

function renameTabIndex(html: string): string {
  const $ = cheerio.load(html, {
    decodeEntities: false,
    lowerCaseTags: false,
    lowerCaseAttributeNames: false,
  });

  const tabs = $('sky-tab');

  tabs.each((_, elem) => {
    const $elem = $(elem);
    replaceTabIndexAttr($elem, 'tabIndex', 'tabIndexValue');
    replaceTabIndexAttr($elem, '[tabIndex]', '[tabIndexValue]');
  });

  return $.html().toString();
}

async function updateSourceFiles(tree: Tree): Promise<void> {
  const { workspace } = await getWorkspace(tree);
  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      if (!filePath.endsWith('.html')) {
        return;
      }

      const content = tree.readText(filePath);

      if (!content || !content.includes('sky-tab')) {
        return;
      }

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
