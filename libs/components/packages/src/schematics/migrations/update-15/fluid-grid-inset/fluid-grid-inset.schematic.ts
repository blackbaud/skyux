import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
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
const STATIC_ATTRIBUTE = 'disablemargin';
const BOUND_ATTRIBUTE = '[disablemargin]';

function isElement(
  node: DefaultTreeAdapterTypes.Node,
): node is ElementWithLocation {
  return 'tagName' in node;
}

function isFluidGrid(node: ElementWithLocation): boolean {
  return node.tagName.toLowerCase() === 'sky-fluid-grid';
}

function removeAttribute(
  node: ElementWithLocation,
  attributeName: string,
  content: string,
  offset: number,
  recorder: UpdateRecorder,
): void {
  const location = node.sourceCodeLocation.attrs[attributeName];

  // Also remove the whitespace preceding the attribute.
  let start = location.startOffset;
  while (/\s/.test(content.charAt(start - 1))) {
    start--;
  }

  recorder.remove(offset + start, location.endOffset - start);
}

function replaceAttribute(
  node: ElementWithLocation,
  attributeName: string,
  replacement: string,
  offset: number,
  recorder: UpdateRecorder,
): void {
  const location = node.sourceCodeLocation.attrs[attributeName];

  recorder.remove(
    offset + location.startOffset,
    location.endOffset - location.startOffset,
  );
  recorder.insertLeft(offset + location.startOffset, replacement);
}

/**
 * Migrates a single `sky-fluid-grid` element's `disableMargin` usage to the
 * new `inset` input, which has the opposite meaning:
 * - A static or bound literal `true` is removed, since hiding the margin is
 *   now the default behavior.
 * - A static or bound literal `false` becomes `inset="true"` (or
 *   `[inset]="true"`), preserving the margin.
 * - A bound, non-literal expression becomes `[inset]="!(expression)"`.
 * - If `disableMargin` isn't set at all, nothing changes: the fluid grid's
 *   default behavior is changing, so the file is left for manual review.
 */
function migrateFluidGrid(
  node: ElementWithLocation,
  content: string,
  offset: number,
  recorder: UpdateRecorder,
): boolean {
  const staticAttr = node.attrs.find(
    (attr) => attr.name === STATIC_ATTRIBUTE,
  );
  const boundAttr = node.attrs.find((attr) => attr.name === BOUND_ATTRIBUTE);

  if (!staticAttr && !boundAttr) {
    return false;
  }

  if (staticAttr) {
    const value = staticAttr.value.trim().toLowerCase();
    if (value === 'false') {
      replaceAttribute(node, STATIC_ATTRIBUTE, 'inset="true"', offset, recorder);
    } else {
      // An empty value (bare attribute) or "true" both disable the margin,
      // which is now the default, so the attribute can be removed.
      removeAttribute(node, STATIC_ATTRIBUTE, content, offset, recorder);
    }
    return true;
  }

  if (boundAttr) {
    const value = boundAttr.value.trim();
    if (value === 'true') {
      removeAttribute(node, BOUND_ATTRIBUTE, content, offset, recorder);
    } else if (value === 'false') {
      replaceAttribute(node, BOUND_ATTRIBUTE, '[inset]="true"', offset, recorder);
    } else {
      replaceAttribute(
        node,
        BOUND_ATTRIBUTE,
        `[inset]="!(${value})"`,
        offset,
        recorder,
      );
    }
  }
  return true;
}

function migrateTemplate(
  content: string,
  offset: number,
  recorder: UpdateRecorder,
): number {
  const nodeQueue: DefaultTreeAdapterTypes.Node[] = [parseTemplate(content)];
  let notConfiguredCount = 0;

  while (nodeQueue.length) {
    const node = nodeQueue.shift() as DefaultTreeAdapterTypes.Node;

    if (isElement(node) && isFluidGrid(node)) {
      const migrated = migrateFluidGrid(node, content, offset, recorder);
      if (!migrated) {
        notConfiguredCount++;
      }
    }

    if (isParentNode(node)) {
      nodeQueue.push(...node.childNodes);
    }
  }

  return notConfiguredCount;
}

async function updateSourceFiles(
  tree: Tree,
  context: SchematicContext,
): Promise<void> {
  const workspace = await getWorkspace(tree);
  let notConfiguredCount = 0;

  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
        const content = tree.readText(filePath);

        if (!content.toLowerCase().includes('sky-fluid-grid')) {
          return;
        }

        const recorder = tree.beginUpdate(filePath);

        if (filePath.endsWith('.html')) {
          notConfiguredCount += migrateTemplate(content, 0, recorder);
        } else {
          const templates = getInlineTemplates(parseSourceFile(tree, filePath));

          templates.forEach((template) => {
            notConfiguredCount += migrateTemplate(
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

  if (notConfiguredCount > 0) {
    context.logger.warn(
      `Found ${notConfiguredCount} <sky-fluid-grid> element(s) that do not set 'disableMargin'. ` +
        "Starting in SKY UX 15, the fluid grid's outer left and right margin is hidden by default. " +
        "Review these elements and add the 'inset' input (e.g. [inset]=\"true\") to any that should keep their margin.",
    );
  }
}

/**
 * Migrates `sky-fluid-grid` templates from the deprecated `disableMargin`
 * input to the new `inset` input, which has the opposite default: the fluid
 * grid's outer left and right margin is now hidden unless `inset` is set to
 * `true`.
 */
export default function (): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    await updateSourceFiles(tree, context);
  };
}
