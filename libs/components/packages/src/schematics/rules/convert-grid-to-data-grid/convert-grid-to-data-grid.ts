import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';

import { logOnce } from '../../utility/log-once';
import {
  SwapTagCallback,
  getElementsByTagName,
  parseTemplate,
  swapTags,
} from '../../utility/template';
import {
  getInlineTemplates,
  isImportedFromPackage,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

const gridInputMap = Object.fromEntries(
  Object.entries({
    enableMultiselect: 'multiselect',
    multiselectSelectionChange: 'selectedRowIdsChange',
  }).map(([oldValue, newValue]) => [oldValue.toLowerCase(), newValue]),
);
const gridInputUnchanged = [
  'data',
  'fit',
  'height',
  'multiselectRowId',
  'rowDeleteCancel',
  'rowDeleteConfirm',
  'rowHighlightedId',
  'selectedColumnIds',
  'selectedColumnIdsChange',
  'selectedRowIds',
  'width',
].map((t) => t.toLowerCase());

const gridColumnInputMap = Object.fromEntries(
  Object.entries({
    id: 'columnId',
    inlineHelpPopover: 'helpPopoverContent',
  }).map(([oldValue, newValue]) => [oldValue.toLowerCase(), newValue]),
);
const gridColumnInputUnchanged = [
  `description`,
  `field`,
  `heading`,
  `hidden`,
  `isSortable`,
  `locked`,
  `template`,
  `width`,
].map((t) => t.toLowerCase());

const tags = {
  'sky-grid': 'sky-data-grid',
  'sky-grid-column': 'sky-data-grid-column',
} as const;
function gridTagSwap(
  context: SchematicContext,
): SwapTagCallback<keyof typeof tags> {
  return (position, oldTag, node, content) => {
    if (position === 'open') {
      const attributesString = content.substring(
        node.sourceCodeLocation.startOffset + oldTag.length + 1,
        node.sourceCodeLocation.startTag.endOffset,
      );
      if (oldTag === 'sky-grid') {
        let value = `<${tags[oldTag]}`;
        // Copy over any other attributes that are not in the new tag.
        for (const attr of node.attrs) {
          if (
            gridInputUnchanged.includes(attr.name) ||
            gridInputUnchanged.includes(
              attr.name.substring(1, attr.name.length - 1),
            )
          ) {
            value += ` ${attr.name}="${attr.value}"`;
          } else if (
            attr.name.substring(1, attr.name.length - 1) in gridInputMap
          ) {
            const open = attr.name.charAt(0);
            const close = attr.name.charAt(attr.name.length - 1);
            value += ` ${open}${gridInputMap[attr.name.substring(1, attr.name.length - 1)]}${close}="${attr.value}"`;
          } else if (attr.name.includes('sortField'.toLowerCase())) {
            context.logger.warn(
              `The "${attr.name}" attribute is not supported on the <${tags[oldTag]}> component. Your code will need to be modified to use the new "sort" model signal on <${tags[oldTag]}>.`,
            );
          } else {
            context.logger.warn(
              `The "${attr.name}" attribute is not supported on the <${tags[oldTag]}> component. Please review the code to ensure it still works as expected.`,
            );
          }
        }
        value += '>';
        return value;
      }
      if (oldTag === 'sky-grid-column') {
        let value = `<${tags[oldTag]}`;
        // Copy over any other attributes that are not in the new tag.
        for (const attr of node.attrs) {
          if (
            gridColumnInputUnchanged.includes(attr.name) ||
            gridColumnInputUnchanged.includes(
              attr.name.substring(1, attr.name.length - 1),
            )
          ) {
            value += ` ${attr.name}="${attr.value}"`;
          } else if (attr.name in gridColumnInputMap) {
            value += ` ${gridColumnInputMap[attr.name]}="${attr.value}"`;
          } else if (
            attr.name.substring(1, attr.name.length - 1) in gridColumnInputMap
          ) {
            const open = attr.name.charAt(0);
            const close = attr.name.charAt(attr.name.length - 1);
            value += ` ${open}${gridColumnInputMap[attr.name.substring(1, attr.name.length - 1)]}${close}="${attr.value}"`;
          } else {
            context.logger.warn(
              `The "${attr.name}" attribute is not supported on the <${tags[oldTag]}> component. Please review the code to ensure it still works as expected.`,
            );
          }
        }
        if (attributesString.endsWith('/>')) {
          value += ' />';
        } else {
          value += '>';
        }
        return value;
      }
    }
    return `</${tags[oldTag]}>`;
  };
}

function convertTemplate(
  recorder: UpdateRecorder,
  context: SchematicContext,
  content: string,
  offset = 0,
): void {
  const fragment = parseTemplate(content);
  const grids = getElementsByTagName('sky-grid', fragment);
  for (const grid of grids) {
    swapTags(
      content,
      recorder,
      offset,
      Object.keys(tags) as (keyof typeof tags)[],
      gridTagSwap(context),
      { expectNestedSelfClosingTags: true },
      grid,
    );
  }
  if (grids.length > 0) {
    logOnce(
      context,
      'info',
      `Converted ${grids.length} <sky-grid> component(s) to <sky-data-grid> component(s). Next steps: https://developer.blackbaud.com/skyux/learn/develop/deprecation/grid`,
    );
  }
}

function convertHtmlFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
): void {
  const content = tree.readText(filePath);
  if (content.includes('<sky-grid')) {
    const recorder = tree.beginUpdate(filePath);
    convertTemplate(recorder, context, content);
    tree.commitUpdate(recorder);
  }
}

function convertTypescriptFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
): void {
  const source = parseSourceFile(tree, filePath);
  const templates = getInlineTemplates(source);
  const recorder = tree.beginUpdate(filePath);
  if (templates.length > 0) {
    const content = tree.readText(filePath);
    for (const template of templates) {
      convertTemplate(
        recorder,
        context,
        content.slice(template.start, template.end),
        template.start,
      );
    }
  }
  if (isImportedFromPackage(source, 'SkyGridModule', '@skyux/grids')) {
    swapImportedClass(recorder, filePath, source, [
      {
        classNames: {
          SkyGridModule: 'SkyDataGridModule',
        },
        moduleName: { old: '@skyux/grids', new: '@skyux/data-grid' },
      },
    ]);
  }
  tree.commitUpdate(recorder);
}

export function convertGridToDataGrid(projectPath: string): Rule {
  return (tree, context) => {
    visitProjectFiles(tree, projectPath, (filePath) => {
      if (filePath.endsWith('.html')) {
        convertHtmlFile(tree, filePath, context);
      } else if (filePath.endsWith('.ts')) {
        convertTypescriptFile(tree, filePath, context);
      }
    });
  };
}
