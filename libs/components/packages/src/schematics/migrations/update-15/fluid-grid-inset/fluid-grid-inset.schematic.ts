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
// `[disableMargin]` and the equivalent long-form `bind-disableMargin` syntax
// are both bound (real boolean) forms.
const BOUND_ATTRIBUTES = ['[disablemargin]', 'bind-disablemargin'];
const INSET_ATTRIBUTES = ['inset', '[inset]', 'bind-inset'];

/**
 * Quotes a value for use as an HTML attribute, choosing a quote character
 * that doesn't appear in the value when possible. If the value contains
 * both quote characters, double quotes are used and any embedded double
 * quotes are entity-encoded so the attribute isn't terminated early.
 */
function quoteAttributeValue(value: string): string {
  if (!value.includes('"')) {
    return `"${value}"`;
  }
  if (!value.includes("'")) {
    return `'${value}'`;
  }
  return `"${value.replace(/"/g, '&quot;')}"`;
}

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
 * - A static (unbound) attribute binds its literal string value, and
 *   `disableMargin`'s `@Input()` doesn't coerce that to a boolean. So only a
 *   bare/empty attribute is falsy (the margin was shown); any other value --
 *   including the literal string `"false"` -- is truthy and already hides
 *   the margin, same as `"true"`. A bare/empty attribute becomes
 *   `inset="true"` to keep the margin; any other static value is removed.
 * - A bound literal `true` or `false` is a real boolean, so `[disableMargin]="true"`
 *   (or the equivalent `bind-disableMargin="true"`) is removed (hiding the
 *   margin is now the default) and `[disableMargin]="false"` becomes
 *   `[inset]="true"` (preserving the margin).
 * - A bound, non-literal expression becomes `[inset]="!(expression)"`.
 * - If `disableMargin` isn't set at all, nothing changes: the fluid grid's
 *   default behavior is changing, so the file is left for manual review --
 *   unless `inset` is already set, in which case it's already migrated and
 *   doesn't need a warning.
 *
 * Known limitation: this only recognizes literal `disableMargin`/
 * `[disableMargin]`/`bind-disableMargin` template attributes. It can't see
 * usages set programmatically (e.g. via `ViewChild` or `Renderer2`), and a
 * static, interpolated attribute (`disableMargin="{{ expression }}"`) is
 * judged by its literal source text rather than the expression's runtime
 * value.
 */
function migrateFluidGrid(
  node: ElementWithLocation,
  content: string,
  offset: number,
  recorder: UpdateRecorder,
): boolean {
  const staticAttr = node.attrs.find((attr) => attr.name === STATIC_ATTRIBUTE);
  const boundAttr = node.attrs.find((attr) =>
    BOUND_ATTRIBUTES.includes(attr.name),
  );

  if (!staticAttr && !boundAttr) {
    // Elements that already set `inset` (static or bound) have already been
    // migrated, so they don't need a warning even though `disableMargin`
    // isn't present.
    return node.attrs.some((attr) => INSET_ATTRIBUTES.includes(attr.name));
  }

  if (staticAttr) {
    if (staticAttr.value.trim() === '') {
      replaceAttribute(
        node,
        STATIC_ATTRIBUTE,
        'inset="true"',
        offset,
        recorder,
      );
    } else {
      removeAttribute(node, STATIC_ATTRIBUTE, content, offset, recorder);
    }
  }

  if (boundAttr) {
    const attributeName = boundAttr.name;
    const value = boundAttr.value.trim();
    if (value === 'true') {
      removeAttribute(node, attributeName, content, offset, recorder);
    } else if (value === 'false') {
      replaceAttribute(node, attributeName, '[inset]="true"', offset, recorder);
    } else {
      replaceAttribute(
        node,
        attributeName,
        `[inset]=${quoteAttributeValue(`!(${value})`)}`,
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
  const visitedFiles = new Set<string>();

  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
        // Overlapping project roots (e.g. an app project at the workspace
        // root with libraries nested inside it) can cause the same file to
        // be visited more than once.
        if (visitedFiles.has(filePath)) {
          return;
        }
        visitedFiles.add(filePath);

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
        'Review these elements and add the \'inset\' input (e.g. [inset]="true") to any that should keep their margin.',
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
