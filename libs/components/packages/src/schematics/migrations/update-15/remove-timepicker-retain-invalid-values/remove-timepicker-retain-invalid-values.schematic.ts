import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import type { DefaultTreeAdapterTypes } from 'parse5';

import {
  ElementWithLocation,
  isParentNode,
  parseTemplate,
} from '../../../utility/template';
import {
  getInlineTemplates,
  parseSourceFile,
} from '../../../utility/typescript/ng-ast';
import { visitProjectFiles } from '../../../utility/visit-project-files';

// parse5 lowercases attribute names.
const RETAIN_ATTRIBUTES = [
  'skytimepickerretaininvalidvalues',
  '[skytimepickerretaininvalidvalues]',
];

function isElement(
  node: DefaultTreeAdapterTypes.Node,
): node is ElementWithLocation {
  return 'tagName' in node;
}

function removeRetainAttributes(
  content: string,
  offset: number,
  recorder: UpdateRecorder,
): void {
  const nodeQueue: DefaultTreeAdapterTypes.Node[] = [parseTemplate(content)];

  while (nodeQueue.length) {
    const node = nodeQueue.shift() as DefaultTreeAdapterTypes.Node;

    if (isElement(node)) {
      node.attrs
        .filter((attr) => RETAIN_ATTRIBUTES.includes(attr.name))
        .forEach((attr) => {
          const location = node.sourceCodeLocation.attrs[attr.name];

          // Also remove the whitespace preceding the attribute.
          let start = location.startOffset;
          while (/\s/.test(content.charAt(start - 1))) {
            start--;
          }

          recorder.remove(offset + start, location.endOffset - start);
        });
    }

    if (isParentNode(node)) {
      nodeQueue.push(...node.childNodes);
    }
  }
}

async function updateSourceFiles(tree: Tree): Promise<void> {
  const workspace = await getWorkspace(tree);

  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
        const content = tree.readText(filePath);

        if (
          !content.toLowerCase().includes('skytimepickerretaininvalidvalues')
        ) {
          return;
        }

        const recorder = tree.beginUpdate(filePath);

        if (filePath.endsWith('.html')) {
          removeRetainAttributes(content, 0, recorder);
        } else {
          const templates = getInlineTemplates(parseSourceFile(tree, filePath));

          templates.forEach((template) => {
            removeRetainAttributes(
              content.substring(template.start, template.end),
              template.start,
              recorder,
            );
          });
        }

        tree.commitUpdate(recorder);
      }
    });
  });
}

/**
 * Remove the `skyTimepickerRetainInvalidValues` input from timepicker inputs
 * since retaining invalid values is now the default and only behavior.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    await updateSourceFiles(tree);
  };
}
