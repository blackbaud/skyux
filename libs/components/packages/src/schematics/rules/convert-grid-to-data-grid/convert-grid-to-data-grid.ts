import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
  chain,
} from '@angular-devkit/schematics';
import { ExistingBehavior, addDependency } from '@schematics/angular/utility';

import { logOnce } from '../../utility/log-once';
import {
  ElementWithLocation,
  SwapAttributeCallback,
  SwapTagCallback,
  getAttributeValueText,
  getElementsByTagName,
  parseTemplate,
  swapAttributes,
  swapTags,
} from '../../utility/template';
import {
  getInlineTemplates,
  isImportedFromPackage,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

const MIGRATION_DOC_URL =
  'https://developer.blackbaud.com/skyux/components/data-grid';

const GRID_TAG: 'sky-grid'[] = ['sky-grid'];
const COLUMN_TAG: 'sky-grid-column'[] = ['sky-grid-column'];

/**
 * Attribute name swaps applied to `<sky-grid>`. A value of `''` drops the
 * attribute. Bound (`[x]`) and event (`(x)`) spellings are listed separately
 * because parse5 treats them as distinct attribute names. `fit`'s unbound
 * `width`/`scroll` literal values are additionally translated to `columnFit`'s
 * `container`/`content` values by `gridAttributeSwapCallback`. Anything not
 * listed (`data`, `selectedRowIds`) is copied through unchanged.
 */
const GRID_ATTRIBUTE_SWAPS: Record<string, string> = {
  enableMultiselect: 'multiselect',
  '[enableMultiselect]': '[multiselect]',
  '(multiselectSelectionChange)': '(selectedRowIdsChange)',
  fit: 'columnFit',
  '[fit]': '[columnFit]',
  hasToolbar: '',
  '[hasToolbar]': '',
  height: '',
  '[height]': '',
  highlightText: '',
  '[highlightText]': '',
  messageStream: '',
  '[messageStream]': '',
  multiselectRowId: '',
  '[multiselectRowId]': '',
  '(rowDeleteCancel)': '',
  '(rowDeleteConfirm)': '',
  rowHighlightedId: '',
  '[rowHighlightedId]': '',
  selectedColumnIds: '',
  '[selectedColumnIds]': '',
  '(selectedColumnIdsChange)': '',
  settingsKey: '',
  '[settingsKey]': '',
  sortField: 'sort',
  '[sortField]': '[sort]',
  '(sortFieldChange)': '(sortChange)',
  width: '',
  '[width]': '',
  '(columnWidthChange)': '',
};

/**
 * Inputs removed from `<sky-grid>` with no `<sky-data-grid>` equivalent.
 */
const GRID_REMOVED_INPUTS = [
  'hasToolbar',
  'height',
  'highlightText',
  'messageStream',
  'multiselectRowId',
  'rowHighlightedId',
  'selectedColumnIds',
  'settingsKey',
  'width',
];

/** Outputs removed from `<sky-grid>` with no `<sky-data-grid>` equivalent. */
const GRID_REMOVED_OUTPUTS = [
  'selectedColumnIdsChange',
  'columnWidthChange',
  'rowDeleteCancel',
  'rowDeleteConfirm',
];

/**
 * Inputs removed from `<sky-grid-column>` with no `<sky-data-grid-column>`
 * equivalent. `alignment` and the help-popover inputs are handled separately
 * because their messages depend on the value or on sibling attributes.
 */
const COLUMN_REMOVED_INPUTS = ['excludeFromHighlighting', 'search', 'type'];

/**
 * Returns the parse5 attribute names for an input, covering the plain and
 * property-bound (`[x]`) spellings. parse5 lowercases attribute names.
 */
function inputForms(name: string): string[] {
  const lower = name.toLowerCase();
  return [lower, `[${lower}]`];
}

/** Returns the parse5 attribute name for an event binding (`(x)`). */
function outputForm(name: string): string {
  return `(${name.toLowerCase()})`;
}

function gridRemovedMessage(label: string): string {
  return `The "${label}" binding on <sky-grid> is not supported on <sky-data-grid> and was removed. Review the component for an alternative.`;
}

function columnRemovedMessage(label: string): string {
  return `The "${label}" binding on <sky-grid-column> is not supported on <sky-data-grid-column> and was removed. Review the component for an alternative.`;
}

function hasAttribute(node: ElementWithLocation, names: string[]): boolean {
  return node.attrs.some((attr) => names.includes(attr.name));
}

function findAttribute(
  node: ElementWithLocation,
  names: string[],
): { name: string; value: string } | undefined {
  return node.attrs.find((attr) => names.includes(attr.name));
}

/**
 * Builds the replacement open tag, rewriting the attribute list with
 * `swapAttributes` (which preserves the spacing between attributes) and
 * preserving whether the original tag was self-closing.
 */
function buildOpenTag(
  newTag: string,
  swaps: Record<string, string>,
  node: ElementWithLocation,
  content: string,
  callback?: SwapAttributeCallback<string, string>,
): string {
  const attributes =
    node.attrs.length > 0
      ? swapAttributes(node, swaps, content, callback).replace(/\s+$/, '')
      : '';
  const startTagText = content.substring(
    node.sourceCodeLocation.startTag.startOffset,
    node.sourceCodeLocation.startTag.endOffset,
  );
  const selfClosing = /\/>\s*$/.test(startTagText);
  return `<${newTag}${attributes}${selfClosing ? ' />' : '>'}`;
}

/**
 * Translates `fit`'s unbound `"width"`/`"scroll"` literal values to
 * `columnFit`'s `"container"`/`"content"` values. Falls back to a plain
 * name swap (keeping the original value text) for `[fit]` (bound, so the
 * runtime value can't be statically translated) and for every other
 * attribute in `GRID_ATTRIBUTE_SWAPS`.
 */
const gridAttributeSwapCallback: SwapAttributeCallback<string, string> = (
  oldAttribute,
  newAttribute,
  node,
  content,
) => {
  if (oldAttribute === 'fit') {
    const valueText = getAttributeValueText(content, node, oldAttribute);
    const match = /^=(["'])(width|scroll)\1$/.exec(valueText);
    if (match) {
      const translated = match[2] === 'width' ? 'container' : 'content';
      return `${newAttribute}=${match[1]}${translated}${match[1]}`;
    }
  }
  return newAttribute + getAttributeValueText(content, node, oldAttribute);
};

function gridTagSwap(context: SchematicContext): SwapTagCallback<'sky-grid'> {
  return (position, _tag, node, content) => {
    if (position === 'close') {
      return '</sky-data-grid>';
    }
    if (hasAttribute(node, [outputForm('multiselectSelectionChange')])) {
      logOnce(
        context,
        'warn',
        'The "(multiselectSelectionChange)" output on <sky-grid> was renamed to "(selectedRowIdsChange)" on <sky-data-grid>. The emitted value is now a string[] of selected row IDs instead of a SkyGridSelectedRowsModelChange object (the "source" property is no longer available). Review the handler.',
      );
    }
    if (
      hasAttribute(node, [
        ...inputForms('sortField'),
        outputForm('sortFieldChange'),
      ])
    ) {
      logOnce(
        context,
        'warn',
        'The "sortField"/"(sortFieldChange)" bindings on <sky-grid> were renamed to "sort"/"(sortChange)" on <sky-data-grid>. The value shape changed from { fieldSelector: string, descending: boolean } to { field: string, direction: "asc" | "desc" }. Review the bound value and handler.',
      );
    }
    if (hasAttribute(node, inputForms('fit'))) {
      logOnce(
        context,
        'warn',
        'The "fit" input on <sky-grid> was renamed to "columnFit" on <sky-data-grid>, with values "width"/"scroll" renamed to "container"/"content". A bound "[fit]" value could not be translated automatically; review it.',
      );
    }
    for (const label of GRID_REMOVED_INPUTS) {
      if (hasAttribute(node, inputForms(label))) {
        logOnce(context, 'warn', gridRemovedMessage(label));
      }
    }
    for (const label of GRID_REMOVED_OUTPUTS) {
      if (hasAttribute(node, [outputForm(label)])) {
        logOnce(context, 'warn', gridRemovedMessage(label));
      }
    }
    return buildOpenTag(
      'sky-data-grid',
      GRID_ATTRIBUTE_SWAPS,
      node,
      content,
      gridAttributeSwapCallback,
    );
  };
}

/**
 * Logs the help-popover, alignment, and removed-input warnings for a single
 * `<sky-grid-column>`.
 */
function warnColumnAttributes(
  context: SchematicContext,
  node: ElementWithLocation,
  hasInlineHelp: boolean,
  hasDescription: boolean,
): void {
  if (hasInlineHelp) {
    logOnce(
      context,
      'warn',
      'The "inlineHelpPopover" input on <sky-grid-column> was mapped to "helpPopoverContent" on <sky-data-grid-column>. Review the binding: "helpPopoverContent" accepts a string or a TemplateRef.',
    );
    if (hasDescription) {
      logOnce(
        context,
        'warn',
        'The "description" input on <sky-grid-column> could not be migrated because "helpPopoverContent" was already mapped from "inlineHelpPopover". Review the column.',
      );
    }
  } else if (hasDescription) {
    logOnce(
      context,
      'warn',
      'The "description" input on <sky-grid-column> was mapped to "helpPopoverContent" on <sky-data-grid-column>. Review the result.',
    );
  }

  const alignment = findAttribute(node, inputForms('alignment'));
  if (alignment) {
    if (alignment.name === 'alignment' && alignment.value === 'right') {
      logOnce(
        context,
        'warn',
        'The "alignment" input is not supported on <sky-data-grid-column>. For right alignment, set dataType="number" on the column.',
      );
    } else {
      logOnce(
        context,
        'warn',
        'The "alignment" input is not supported on <sky-data-grid-column> and was removed. Apply alignment via a cell template or CSS.',
      );
    }
  }

  for (const label of COLUMN_REMOVED_INPUTS) {
    if (hasAttribute(node, inputForms(label))) {
      logOnce(context, 'warn', columnRemovedMessage(label));
    }
  }
}

function buildColumnSwaps(hasInlineHelp: boolean): Record<string, string> {
  return {
    heading: 'headingText',
    '[heading]': '[headingText]',
    hidden: 'columnHidden',
    '[hidden]': '[columnHidden]',
    id: 'columnId',
    '[id]': '[columnId]',
    isSortable: 'sortable',
    '[isSortable]': '[sortable]',
    inlineHelpPopover: 'helpPopoverContent',
    '[inlineHelpPopover]': '[helpPopoverContent]',
    description: hasInlineHelp ? '' : 'helpPopoverContent',
    '[description]': hasInlineHelp ? '' : '[helpPopoverContent]',
    alignment: '',
    '[alignment]': '',
    excludeFromHighlighting: '',
    '[excludeFromHighlighting]': '',
    search: '',
    '[search]': '',
    type: '',
    '[type]': '',
  };
}

function columnTagSwap(
  context: SchematicContext,
): SwapTagCallback<'sky-grid-column'> {
  return (position, _tag, node, content) => {
    if (position === 'close') {
      return '</sky-data-grid-column>';
    }

    const hasInlineHelp = hasAttribute(node, inputForms('inlineHelpPopover'));
    const hasDescription = hasAttribute(node, inputForms('description'));

    warnColumnAttributes(context, node, hasInlineHelp, hasDescription);

    return buildOpenTag(
      'sky-data-grid-column',
      buildColumnSwaps(hasInlineHelp),
      node,
      content,
    );
  };
}

function convertTemplate(
  recorder: UpdateRecorder,
  content: string,
  context: SchematicContext,
  offset = 0,
): void {
  const fragment = parseTemplate(content);
  const grids = getElementsByTagName('sky-grid', fragment);

  // Columns belonging to a skipped `[columns]` grid are excluded from the
  // column swap so we never leave `<sky-data-grid-column>` inside `<sky-grid>`.
  const skippedColumns = new Set<ElementWithLocation>();
  let converted = 0;

  for (const grid of grids) {
    if (hasAttribute(grid, ['columns', '[columns]'])) {
      logOnce(
        context,
        'warn',
        'A <sky-grid> using the "columns" input was left unchanged. The data grid has no "columns" input; define columns with <sky-data-grid-column> elements and migrate this usage manually.',
      );
      getElementsByTagName('sky-grid-column', grid).forEach((column) =>
        skippedColumns.add(column),
      );
      continue;
    }
    // Each grid is swapped on its own so traversal never has to descend into
    // self-closing columns (which parse5 nests instead of treating as siblings).
    swapTags(content, recorder, offset, GRID_TAG, gridTagSwap(context), grid);
    converted++;
  }

  // Collect columns from the whole fragment (getElementsByTagName traverses
  // unconditionally) and swap each individually for the same reason.
  const columns = getElementsByTagName('sky-grid-column', fragment).filter(
    (column) => !skippedColumns.has(column),
  );
  for (const column of columns) {
    swapTags(
      content,
      recorder,
      offset,
      COLUMN_TAG,
      columnTagSwap(context),
      column,
    );
  }

  if (converted > 0) {
    logOnce(
      context,
      'info',
      `Converted <sky-grid> component(s) to <sky-data-grid> component(s). Next steps: ${MIGRATION_DOC_URL}`,
    );
    logOnce(
      context,
      'info',
      'Data grid columns default to dataType="text". Review numeric and date columns and set "dataType" so sorting and formatting behave correctly.',
    );
    logOnce(
      context,
      'warn',
      'Some <sky-grid> features have no <sky-data-grid> equivalent (toolbar, text and row highlighting, custom per-column search, message-stream commands such as row delete, settingsKey persistence, and explicit width/height). Reimplement these manually as needed.',
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
    convertTemplate(recorder, content, context);
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
        content.slice(template.start, template.end),
        context,
        template.start,
      );
    }
  }
  if (isImportedFromPackage(source, 'SkyGridModule', '@skyux/grids')) {
    swapImportedClass(recorder, filePath, source, [
      {
        classNames: {
          SkyGridModule: ['SkyDataGrid', 'SkyDataGridColumn'],
        },
        moduleName: {
          old: '@skyux/grids',
          new: '@skyux/data-grid',
        },
      },
    ]);
  }
  tree.commitUpdate(recorder);
}

export function convertGridToDataGrid(projectPath: string): Rule {
  return chain([
    (tree, context): void => {
      visitProjectFiles(tree, projectPath, (filePath) => {
        if (filePath.endsWith('.html')) {
          convertHtmlFile(tree, filePath, context);
        } else if (filePath.endsWith('.ts')) {
          convertTypescriptFile(tree, filePath, context);
        }
      });
    },
    addDependency('@skyux/data-grid', `0.0.0-PLACEHOLDER`, {
      existing: ExistingBehavior.Skip,
    }),
  ]);
}
