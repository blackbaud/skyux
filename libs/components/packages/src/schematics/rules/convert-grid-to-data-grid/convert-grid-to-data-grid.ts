import { Path, dirname, join, normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
  chain,
} from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { ExistingBehavior, addDependency } from '@schematics/angular/utility';
import {
  findNodes,
  getDecoratorMetadata,
} from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';

import { logOnce } from '../../utility/log-once';
import {
  ElementWithLocation,
  SwapAttributeCallback,
  SwapTagCallback,
  getAttributeValueText,
  getElementsByTagName,
  hasAncestorTag,
  parseTemplate,
  swapAttributes,
  swapTags,
} from '../../utility/template';
import {
  addSymbolToClassMetadata,
  getInlineTemplates,
  getTemplateUrls,
  isImportedFromPackage,
  isSymbolInClassMetadataFieldArray,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import { removeClassReference } from '../../utility/typescript/remove-class-reference';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

const MIGRATION_DOC_URL =
  'https://developer.blackbaud.com/skyux/components/data-grid';

const SKY_GRID_MODULE = 'SkyGridModule';
const SKY_GRID_MODULE_PACKAGE = '@skyux/grids';
const SKY_LIST_VIEW_GRID_MODULE = 'SkyListViewGridModule';
const SKY_LIST_VIEW_GRID_MODULE_PACKAGE = '@skyux/list-builder-view-grids';

/**
 * `SkyDataGrid`/`SkyDataGridColumn` are standalone components that replace
 * `SkyGridModule`. Unlike an NgModule, they must be present in an NgModule's
 * `imports` array to also appear in that NgModule's `exports` array.
 */
const DATA_GRID_CLASS_NAMES = ['SkyDataGrid', 'SkyDataGridColumn'];

const GRID_TAG: 'sky-grid'[] = ['sky-grid'];
const COLUMN_TAG: 'sky-grid-column'[] = ['sky-grid-column'];
const LIST_VIEW_GRID_TAG = 'sky-list-view-grid';

/**
 * Attribute name swaps applied to `<sky-grid>`. A value of `''` drops the
 * attribute. Bound (`[x]`) and event (`(x)`) spellings are listed separately
 * because parse5 treats them as distinct attribute names. `fit`'s unbound
 * `width`/`scroll` literal values are additionally translated to `columnFit`'s
 * `container`/`content` values by `gridAttributeSwapCallback`. Anything not
 * listed (`data`, `selectedRowIds`, `selectedColumnIds`) is copied through
 * unchanged.
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
  'settingsKey',
  'width',
];

/** Outputs removed from `<sky-grid>` with no `<sky-data-grid>` equivalent. */
const GRID_REMOVED_OUTPUTS = [
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
    if (hasAttribute(node, inputForms('data'))) {
      logOnce(
        context,
        'warn',
        'The "data" binding on <sky-grid> was copied to <sky-data-grid>, whose "data" input is typed as SkyDataGridRowData[]: each row object must have a unique string "id" property. Update the bound array if template type checking reports an assignment error.',
      );
    }
    if (
      hasAttribute(node, [
        ...inputForms('selectedColumnIds'),
        outputForm('selectedColumnIdsChange'),
      ])
    ) {
      logOnce(
        context,
        'warn',
        'The "selectedColumnIds"/"(selectedColumnIdsChange)" bindings on <sky-grid> were copied to <sky-data-grid>, where an empty array means every column displays instead of no columns. Review the bound value and handler.',
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

interface ConvertTemplateResult {
  /** Number of `<sky-grid>`/`<sky-grid-column>` elements actually converted. */
  converted: number;
  /**
   * Number of `<sky-grid>`/`<sky-grid-column>` elements left unchanged because
   * they're nested inside `<sky-list-view-grid>`, which has no `<sky-data-grid>`
   * equivalent in this migration.
   */
  listViewGridSkipped: number;
  /**
   * Number of `<sky-grid>` elements left unchanged because they use the
   * `columns` input, which has no `<sky-data-grid>` equivalent. These grids
   * still require `SkyGridModule`.
   */
  columnsSkipped: number;
}

function convertTemplate(
  recorder: UpdateRecorder,
  content: string,
  context: SchematicContext,
  offset = 0,
): ConvertTemplateResult {
  const fragment = parseTemplate(content);
  const grids = getElementsByTagName('sky-grid', fragment).filter(
    (grid) => !hasAncestorTag(grid, LIST_VIEW_GRID_TAG),
  );

  // Columns belonging to a skipped `[columns]` grid are excluded from the
  // column swap so we never leave `<sky-data-grid-column>` inside `<sky-grid>`.
  const skippedColumns = new Set<ElementWithLocation>();
  let converted = 0;
  let listViewGridSkipped = 0;
  let columnsSkipped = 0;

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
      columnsSkipped++;
      continue;
    }
    // Each grid is swapped on its own so traversal never has to descend into
    // self-closing columns (which parse5 nests instead of treating as siblings).
    swapTags(content, recorder, offset, GRID_TAG, gridTagSwap(context), grid);
    converted++;
  }

  // Collect columns from the whole fragment (getElementsByTagName traverses
  // unconditionally) and swap each individually for the same reason.
  const allColumns = getElementsByTagName('sky-grid-column', fragment);
  const columns = allColumns.filter((column) => {
    if (hasAncestorTag(column, LIST_VIEW_GRID_TAG)) {
      listViewGridSkipped++;
      return false;
    }
    return !skippedColumns.has(column);
  });
  if (listViewGridSkipped > 0) {
    logOnce(
      context,
      'warn',
      'A <sky-grid-column> inside <sky-list-view-grid> was left unchanged. <sky-list-view-grid> has no <sky-data-grid> equivalent in this migration.',
    );
  }
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

  return { converted, listViewGridSkipped, columnsSkipped };
}

function convertHtmlFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
): ConvertTemplateResult | undefined {
  const content = tree.readText(filePath);
  // The `<sky-grid` substring also matches `<sky-grid-column`, so templates
  // whose only grid usage is columns inside `<sky-list-view-grid>` still get
  // counted as evidence for the import decisions.
  if (content.includes('<sky-grid')) {
    const recorder = tree.beginUpdate(filePath);
    const result = convertTemplate(recorder, content, context);
    tree.commitUpdate(recorder);
    return result;
  }
  return undefined;
}

/**
 * Template evidence collected from a `.ts` file during the first pass, used
 * to decide the file's (and, via `classNames`, other files') `SkyGridModule`
 * import handling in the second pass.
 */
interface TsFileEvidence {
  /** Names of the classes declared in the file. */
  classNames: string[];
  /** Tree-absolute paths of the file's external `templateUrl` templates. */
  templateUrls: Path[];
  /** Combined result of the file's inline templates. */
  inline: ConvertTemplateResult;
}

function emptyResult(): ConvertTemplateResult {
  return { converted: 0, listViewGridSkipped: 0, columnsSkipped: 0 };
}

function addResults(
  target: ConvertTemplateResult,
  source: ConvertTemplateResult,
): void {
  target.converted += source.converted;
  target.listViewGridSkipped += source.listViewGridSkipped;
  target.columnsSkipped += source.columnsSkipped;
}

function hasEvidence(result: ConvertTemplateResult): boolean {
  return (
    result.converted > 0 ||
    result.listViewGridSkipped > 0 ||
    result.columnsSkipped > 0
  );
}

function getClassNames(source: ts.SourceFile): string[] {
  return findNodes(source, ts.isClassDeclaration)
    .map((declaration) => declaration.name?.text)
    .filter((name): name is string => !!name);
}

/**
 * First pass: converts the file's inline templates and returns the template
 * evidence for the import pass. Imports are not touched here. Returns
 * `undefined` when the file has no template evidence at all, keeping the
 * evidence map small and avoiding class-name associations from files that
 * can't influence any import decision.
 */
function convertTypescriptTemplates(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
): TsFileEvidence | undefined {
  const source = parseSourceFile(tree, filePath);
  const templates = getInlineTemplates(source);
  const inline = emptyResult();
  if (templates.length > 0) {
    const content = tree.readText(filePath);
    const recorder = tree.beginUpdate(filePath);
    for (const template of templates) {
      addResults(
        inline,
        convertTemplate(
          recorder,
          content.slice(template.start, template.end),
          context,
          template.start,
        ),
      );
    }
    tree.commitUpdate(recorder);
  }
  const templateUrls = getTemplateUrls(source).map((url) =>
    join(dirname(normalize(filePath)), url),
  );
  if (templateUrls.length === 0 && !hasEvidence(inline)) {
    return undefined;
  }
  return { classNames: getClassNames(source), templateUrls, inline };
}

/**
 * Sums the template evidence associated with a `.ts` file: its own aggregate
 * plus the aggregates of the defining files of every class the file
 * references (declarations, TestBed imports, etc.).
 *
 * Association is intentionally approximate. It matches identifier text, so a
 * class name shared by two files pools evidence from both, and it is one
 * level deep, so a file only inherits evidence from classes it references
 * directly — a spec that imports SkyGridModule for a modal launched by the
 * component under test sees no evidence from the modal. A false match can
 * only add evidence (an unnecessary swap that still compiles), and a missing
 * link can only withhold it (the import is left in place with a warning);
 * neither produces a silent compile break.
 */
function getAssociatedEvidence(
  source: ts.SourceFile,
  filePath: string,
  fileAggregates: ReadonlyMap<string, ConvertTemplateResult>,
  classToFiles: ReadonlyMap<string, string[]>,
): ConvertTemplateResult {
  const contributingFiles = new Set<string>([filePath]);
  if (classToFiles.size > 0) {
    const identifiers = new Set(
      findNodes(source, ts.SyntaxKind.Identifier).map(
        (node) => (node as ts.Identifier).text,
      ),
    );
    for (const [className, definingFiles] of classToFiles) {
      if (identifiers.has(className)) {
        definingFiles.forEach((definingFile) =>
          contributingFiles.add(definingFile),
        );
      }
    }
  }

  const total = emptyResult();
  for (const contributingFile of contributingFiles) {
    const aggregate = fileAggregates.get(contributingFile);
    if (aggregate) {
      addResults(total, aggregate);
    }
  }
  return total;
}

/**
 * True for an `@NgModule` object literal that exports `SkyGridModule`
 * without also importing it. `SkyDataGrid`/`SkyDataGridColumn` need to be
 * added to that NgModule's `imports` array as well, since a standalone class
 * must be imported before it can be exported. A source file may declare more
 * than one `@NgModule`, so this must be checked per-node rather than
 * file-wide to avoid touching NgModules that already import `SkyGridModule`
 * or that don't reference it at all.
 */
function ngModuleExportsGridModuleWithoutImportingIt(
  node: ts.ObjectLiteralExpression,
): boolean {
  return (
    isSymbolInClassMetadataFieldArray(node, 'exports', SKY_GRID_MODULE) &&
    !isSymbolInClassMetadataFieldArray(node, 'imports', SKY_GRID_MODULE)
  );
}

/**
 * True when any `@NgModule` in `source` exports `SkyGridModule` without also
 * importing it.
 */
function sourceHasNgModuleExportingGridModuleWithoutImportingIt(
  source: ts.SourceFile,
): boolean {
  if (!isImportedFromPackage(source, 'NgModule', '@angular/core')) {
    return false;
  }
  return getDecoratorMetadata(source, 'NgModule', '@angular/core').some(
    (node) =>
      ts.isObjectLiteralExpression(node) &&
      ngModuleExportsGridModuleWithoutImportingIt(node),
  );
}

/**
 * Second pass: decides what to do with a file's `SkyGridModule` import based
 * on the template evidence associated with the file — its own inline and
 * `templateUrl` templates plus, for NgModule and spec files, the templates of
 * every referenced class (declarations, TestBed imports, etc.) recorded in
 * `classToFiles`.
 */
function updateTypescriptImports(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
  fileAggregates: ReadonlyMap<string, ConvertTemplateResult>,
  classToFiles: ReadonlyMap<string, string[]>,
): void {
  if (!tree.readText(filePath).includes(SKY_GRID_MODULE)) {
    return;
  }
  const source = parseSourceFile(tree, filePath);
  if (
    !isImportedFromPackage(source, SKY_GRID_MODULE, SKY_GRID_MODULE_PACKAGE)
  ) {
    return;
  }

  const total = getAssociatedEvidence(
    source,
    filePath,
    fileAggregates,
    classToFiles,
  );

  if (total.converted > 0) {
    if (total.columnsSkipped > 0) {
      logOnce(
        context,
        'warn',
        'The "SkyGridModule" import was replaced, but a <sky-grid> using the "columns" input was left unchanged and still requires "SkyGridModule". Restore the import or complete the manual migration of that grid.',
      );
    }
    // A real conversion needs SkyDataGrid/SkyDataGridColumn. Any list-view-grid
    // skip stays safe because <sky-list-view-grid> requires
    // SkyListViewGridModule, which re-exports SkyGridModule.
    const needsGridImportForExport =
      sourceHasNgModuleExportingGridModuleWithoutImportingIt(source);
    const recorder = tree.beginUpdate(filePath);
    swapImportedClass(recorder, filePath, source, [
      {
        classNames: {
          [SKY_GRID_MODULE]: DATA_GRID_CLASS_NAMES,
        },
        moduleName: {
          old: SKY_GRID_MODULE_PACKAGE,
          new: '@skyux/data-grid',
        },
      },
    ]);
    if (needsGridImportForExport) {
      // The import is already added by swapImportedClass above, so only the
      // metadata array needs the symbols (importPath: null). Restrict the
      // edit to the NgModule(s) that actually need it, since a file can
      // declare more than one NgModule.
      applyToUpdateRecorder(
        recorder,
        addSymbolToClassMetadata(
          source,
          'NgModule',
          filePath,
          'imports',
          DATA_GRID_CLASS_NAMES.join(', '),
          null,
          ngModuleExportsGridModuleWithoutImportingIt,
        ),
      );
    }
    tree.commitUpdate(recorder);
  } else if (total.columnsSkipped > 0) {
    logOnce(
      context,
      'warn',
      'The "SkyGridModule" import was left unchanged because a <sky-grid> using the "columns" input still depends on it. Migrate that grid manually before removing the import.',
    );
  } else if (total.listViewGridSkipped > 0) {
    const listViewGridModuleImported = isImportedFromPackage(
      source,
      SKY_LIST_VIEW_GRID_MODULE,
      SKY_LIST_VIEW_GRID_MODULE_PACKAGE,
    );
    if (listViewGridModuleImported) {
      // SkyListViewGridModule already re-exports SkyGridModule, and nothing
      // associated with this file needs SkyDataGrid/SkyDataGridColumn; it's
      // redundant.
      const recorder = tree.beginUpdate(filePath);
      const removed = removeClassReference(
        recorder,
        source,
        SKY_GRID_MODULE,
        SKY_GRID_MODULE_PACKAGE,
      );
      tree.commitUpdate(recorder);
      if (!removed) {
        // removeClassReference only edits decorator `imports` arrays; a
        // reference elsewhere (e.g. a TestBed configuration) keeps the import.
        logOnce(
          context,
          'warn',
          'The redundant "SkyGridModule" import was kept because it is referenced outside a decorator "imports" array (for example in a TestBed configuration). "SkyListViewGridModule" re-exports "SkyGridModule", so remove the import manually if nothing else needs it.',
        );
      }
    } else {
      logOnce(
        context,
        'warn',
        'The "SkyGridModule" import was left unchanged because a <sky-grid-column> inside <sky-list-view-grid> still depends on it and "SkyListViewGridModule" could not be found in this file\'s imports. If "SkyGridModule" is now unused, review it manually.',
      );
    }
  } else {
    logOnce(
      context,
      'warn',
      'The "SkyGridModule" import was left unchanged because no <sky-grid> usage associated with this file was converted. If the import is unused, or this file re-exports "SkyGridModule" for use elsewhere, update it manually.',
    );
  }
}

export function convertGridToDataGrid(projectPath: string): Rule {
  let anyConverted = false;
  return chain([
    (tree, context): void => {
      const htmlResults = new Map<string, ConvertTemplateResult>();
      const tsEvidence = new Map<string, TsFileEvidence>();
      visitProjectFiles(tree, projectPath, (filePath) => {
        if (filePath.endsWith('.html')) {
          const result = convertHtmlFile(tree, filePath, context);
          if (result) {
            htmlResults.set(filePath, result);
          }
        } else if (filePath.endsWith('.ts')) {
          const evidence = convertTypescriptTemplates(tree, filePath, context);
          if (evidence) {
            tsEvidence.set(filePath, evidence);
          }
        }
      });

      // Fold each .ts file's external template results into a per-file
      // aggregate, and index the file's class names so NgModule and spec
      // files can be associated with it in the import pass.
      const fileAggregates = new Map<string, ConvertTemplateResult>();
      const classToFiles = new Map<string, string[]>();
      for (const [tsPath, evidence] of tsEvidence) {
        const aggregate = emptyResult();
        addResults(aggregate, evidence.inline);
        for (const templateUrl of evidence.templateUrls) {
          const htmlResult = htmlResults.get(templateUrl);
          if (htmlResult) {
            addResults(aggregate, htmlResult);
          }
        }
        if (!hasEvidence(aggregate)) {
          continue;
        }
        fileAggregates.set(tsPath, aggregate);
        for (const className of evidence.classNames) {
          const definingFiles = classToFiles.get(className) ?? [];
          definingFiles.push(tsPath);
          classToFiles.set(className, definingFiles);
        }
      }

      anyConverted =
        [...htmlResults.values()].some((result) => result.converted > 0) ||
        [...tsEvidence.values()].some(
          (evidence) => evidence.inline.converted > 0,
        );

      visitProjectFiles(tree, projectPath, (filePath) => {
        if (filePath.endsWith('.ts')) {
          updateTypescriptImports(
            tree,
            filePath,
            context,
            fileAggregates,
            classToFiles,
          );
        }
      });
    },
    (): Rule | void => {
      if (anyConverted) {
        return addDependency('@skyux/data-grid', `0.0.0-PLACEHOLDER`, {
          existing: ExistingBehavior.Skip,
        });
      }
    },
  ]);
}
