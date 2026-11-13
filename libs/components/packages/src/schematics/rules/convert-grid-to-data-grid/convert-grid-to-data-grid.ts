import { Path, dirname, join, normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
  chain,
} from '@angular-devkit/schematics';
import { ExistingBehavior, addDependency } from '@schematics/angular/utility';
import {
  findNodes,
  getDecoratorMetadata,
  insertImport,
} from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';

import ts from 'typescript';

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
const DATA_MANAGER_DOC_URL =
  'https://developer.blackbaud.com/skyux/components/data-manager';

const TODO_PREFIX = 'TODO: data-grid-migration:';

/**
 * Emitted both when a migration run adds the data grid classes alongside
 * SkyGridModule and on a later run that only finds the [columns] grid, so a
 * re-run recognizes its own TODO.
 */
const COLUMNS_GRID_IMPORT_TODO =
  'Replace SkyGridModule with SkyDataGrid and SkyDataGridColumn from @skyux/data-grid after migrating the <sky-grid> that uses [columns].';

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
 * listed (`data`, `selectedRowIds`, `selectedColumnIds`, `rowDeleteCancel`,
 * `rowDeleteConfirm`) is copied through unchanged.
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

const FIT_LITERAL_VALUE = /^=(["'])(width|scroll)\1$/;

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
    const match = FIT_LITERAL_VALUE.exec(valueText);
    if (match) {
      const translated = match[2] === 'width' ? 'container' : 'content';
      return `${newAttribute}=${match[1]}${translated}${match[1]}`;
    }
  }
  return newAttribute + getAttributeValueText(content, node, oldAttribute);
};

/**
 * Follow-up instructions for `<sky-grid>` bindings that need manual work.
 * Bindings that are fully translated, or dropped without a replacement to
 * wire up, have no entry.
 */
const GRID_WARNINGS: { attributes: string[]; message: string }[] = [
  {
    attributes: [outputForm('multiselectSelectionChange')],
    message:
      'Update the <sky-data-grid> (selectedRowIdsChange) handler: it receives a string[] of selected row IDs, not a SkyGridSelectedRowsModelChange object.',
  },
  {
    attributes: [...inputForms('sortField'), outputForm('sortFieldChange')],
    message:
      'Convert the <sky-data-grid> [sort] value and (sortChange) handler from { fieldSelector, descending } to SkyDataGridSort: { field, direction: "asc" | "desc" }.',
  },
  {
    attributes: inputForms('data'),
    message:
      'Give every row in the array bound to <sky-data-grid> [data] a unique string "id" property (SkyDataGridRowData).',
  },
  {
    attributes: inputForms('hasToolbar'),
    message:
      'Restore the toolbar with the data manager: host <sky-data-grid> in a <sky-data-view> inside <sky-data-manager>, and move the toolbar content into <sky-data-manager-toolbar>. <sky-data-grid> has no hasToolbar input.',
  },
  {
    attributes: inputForms('height'),
    message:
      'Constrain the <sky-data-grid> height through its container: it has no height input and grows to fit its rows. Set dock="fill" inside a fixed-size, positioned container, or set [minHeight] for a minimum.',
  },
  {
    attributes: inputForms('width'),
    message:
      'Set the width on an element that wraps <sky-data-grid>: it has no width input and fills its container.',
  },
  {
    attributes: inputForms('highlightText'),
    message:
      'Move search-text highlighting to the data manager: host <sky-data-grid> in a <sky-data-view searchHighlightEnabled> inside <sky-data-manager>. <sky-data-grid> has no highlightText input.',
  },
  {
    attributes: inputForms('messageStream'),
    message:
      'Replace SkyGridMessage commands sent through messageStream with <sky-data-grid> bindings: for SelectAll set [(selectedRowIds)] to every row ID and for ClearAll set it to []; for PromptDeleteRow add the row ID to [(rowDeleteIds)] and for AbortDeleteRow remove it. <sky-data-grid> has no messageStream input.',
  },
  {
    attributes: inputForms('settingsKey'),
    message:
      "To persist the user's grid settings, host <sky-data-grid> in <sky-data-manager> and set settingsKey on the data manager. <sky-data-grid> has no settingsKey input.",
  },
];

/**
 * `sky-grid` has no boolean transform on `enableMultiselect`, so only a bound
 * `false` disables multiselect; a plain `enableMultiselect="false"` is a
 * truthy string.
 */
function isMultiselectEnabled(node: ElementWithLocation): boolean {
  const [, bound] = inputForms('enableMultiselect');
  const attribute = findAttribute(node, inputForms('enableMultiselect'));
  return (
    !!attribute &&
    !(attribute.name === bound && attribute.value.trim() === 'false')
  );
}

function getGridWarnings(node: ElementWithLocation, content: string): string[] {
  const warnings = GRID_WARNINGS.filter(({ attributes }) =>
    hasAttribute(node, attributes),
  ).map(({ message }) => message);
  // selectedColumnIdsChange doesn't emit column reorders while
  // selectedColumnIds is undefined.
  const twoWaySelectedColumnIds = '[(selectedcolumnids)]';
  if (
    hasAttribute(node, [
      twoWaySelectedColumnIds,
      outputForm('selectedColumnIdsChange'),
    ])
  ) {
    warnings.push(
      hasAttribute(node, [
        twoWaySelectedColumnIds,
        ...inputForms('selectedColumnIds'),
      ])
        ? 'Initialize the property bound to <sky-data-grid> selectedColumnIds to an array of column IDs: selectedColumnIdsChange does not emit column reorders while selectedColumnIds is undefined.'
        : 'Bind <sky-data-grid> [selectedColumnIds] to a property initialized to an array of column IDs: selectedColumnIdsChange does not emit column reorders while selectedColumnIds is undefined.',
    );
  }
  // gridAttributeSwapCallback copies any value it can't translate through
  // unchanged, so the same check decides whether a TODO is needed.
  const fit = findAttribute(node, inputForms('fit'));
  if (
    fit &&
    (fit.name === '[fit]' ||
      !FIT_LITERAL_VALUE.test(getAttributeValueText(content, node, 'fit')))
  ) {
    warnings.push(
      'Change the value bound to <sky-data-grid> [columnFit] from "width" to "container" and from "scroll" to "content".',
    );
  }
  const multiselectRowId = findAttribute(node, inputForms('multiselectRowId'));
  if (multiselectRowId) {
    const source = multiselectRowId.name.startsWith('[')
      ? 'the property named by the former [multiselectRowId] binding'
      : `its "${multiselectRowId.value}" property`;
    warnings.push(
      `Set each <sky-data-grid> row's "id" property to the value of ${source}: rows and selectedRowIds are identified by "id", and there is no multiselectRowId input.`,
    );
  }
  const rowHighlightedId = findAttribute(node, inputForms('rowHighlightedId'));
  if (rowHighlightedId) {
    if (isMultiselectEnabled(node)) {
      warnings.push(
        'Indicate the highlighted row another way, such as in a column template: <sky-data-grid> highlights a row by selecting it through [selectedRowIds], which this grid already uses for multiselect. <sky-data-grid> has no rowHighlightedId input.',
      );
    } else {
      const rowId = rowHighlightedId.name.startsWith('[')
        ? rowHighlightedId.value
        : `'${rowHighlightedId.value}'`;
      warnings.push(
        `Highlight the row by binding <sky-data-grid> [selectedRowIds]="[${rowId}]": selecting a single row highlights it, even without multiselect. <sky-data-grid> has no rowHighlightedId input.`,
      );
    }
  }
  return warnings;
}

const gridTagSwap: SwapTagCallback<'sky-grid'> = (
  position,
  _tag,
  node,
  content,
) =>
  position === 'close'
    ? '</sky-data-grid>'
    : buildOpenTag(
        'sky-data-grid',
        GRID_ATTRIBUTE_SWAPS,
        node,
        content,
        gridAttributeSwapCallback,
      );

/**
 * Returns a follow-up instruction for each `<sky-grid-column>` binding that
 * needs manual work.
 */
function getColumnWarnings(node: ElementWithLocation): string[] {
  const warnings: string[] = [];
  if (hasAttribute(node, inputForms('inlineHelpPopover'))) {
    warnings.push(
      'Bind a TemplateRef or string to <sky-data-grid-column> [helpPopoverContent], not a <sky-popover> reference: move the popover body into an <ng-template> and its popoverTitle to helpPopoverTitle.',
    );
  }

  const alignment = findAttribute(node, inputForms('alignment'));
  const literalAlignment =
    alignment?.name === 'alignment' ? alignment.value : undefined;
  if (literalAlignment === 'right') {
    warnings.push(
      'Set dataType="number" on this <sky-data-grid-column> if it holds numbers, which right-aligns them; otherwise right-align the cell content in a column template. <sky-data-grid-column> has no alignment input.',
    );
  } else if (alignment && literalAlignment !== 'left') {
    warnings.push(
      'Recreate the former alignment of this <sky-data-grid-column> in a column template, or set dataType="number" to right-align numbers. <sky-data-grid-column> has no alignment input.',
    );
  }
  const type = findAttribute(node, inputForms('type'));
  if (type) {
    const former = type.name.startsWith('[')
      ? 'the former [type] binding'
      : `its former type "${type.value}"`;
    warnings.push(
      `Set dataType on this <sky-data-grid-column> to match ${former} so its values sort and format correctly: <sky-data-grid-column> has no type input, and columns default to dataType="text".`,
    );
  }
  if (hasAttribute(node, inputForms('search'))) {
    warnings.push(
      "Restore this column's custom search with the data manager: host <sky-data-grid> in a <sky-data-view searchEnabled> inside <sky-data-manager>, and apply the search function when filtering [data] by the data manager's [(searchText)]. <sky-data-grid-column> has no search input.",
    );
  }
  return warnings;
}

const COLUMN_ATTRIBUTE_SWAPS: Record<string, string> = {
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
  alignment: '',
  '[alignment]': '',
  excludeFromHighlighting: '',
  '[excludeFromHighlighting]': '',
  search: '',
  '[search]': '',
  type: '',
  '[type]': '',
};

const columnTagSwap: SwapTagCallback<'sky-grid-column'> = (
  position,
  _tag,
  node,
  content,
) =>
  position === 'close'
    ? '</sky-data-grid-column>'
    : buildOpenTag(
        'sky-data-grid-column',
        COLUMN_ATTRIBUTE_SWAPS,
        node,
        content,
      );

/**
 * Logs each warning once per run, and inserts a TODO comment for each warning
 * above every element it applies to so the follow-up is visible in place.
 * Must run before `swapTags` rewrites the element, because insertions at the
 * same offset are applied in call order. `quote` is the delimiter of the
 * TypeScript string literal holding an inline template, if any.
 */
function warnWithTodo(
  context: SchematicContext,
  recorder: UpdateRecorder,
  content: string,
  offset: number,
  node: ElementWithLocation,
  warnings: string[],
  quote = '',
): void {
  if (warnings.length === 0) {
    return;
  }
  const start = node.sourceCodeLocation.startOffset;
  const lineStart = content.lastIndexOf('\n', start - 1) + 1;
  const leadingText = content.slice(lineStart, start);
  const indent = /^\s*$/.test(leadingText) ? leadingText : '';
  // A single- or double-quoted string literal can't span lines or contain its
  // own unescaped delimiter.
  const isQuoted = quote === "'" || quote === '"';
  const separator = isQuoted ? ' ' : getEOL(content) + indent;
  let todos = '';
  for (const warning of warnings) {
    logOnce(context, 'warn', warning);
    todos += `<!-- ${TODO_PREFIX} ${warning} -->${separator}`;
  }
  if (isQuoted) {
    // Attribute values copied into a warning are raw source text, so their
    // quotes are already escaped; a quote is unescaped only when an even
    // number of backslashes precedes it.
    todos = todos.replace(
      new RegExp(String.raw`(\\*)${quote}`, 'g'),
      (match, backslashes: string) =>
        backslashes.length % 2 === 0 ? `${backslashes}\\${quote}` : match,
    );
  }
  // Elements the migration leaves in place keep their TODOs from a prior run.
  if (content.substring(start - todos.length, start) !== todos) {
    recorder.insertLeft(offset + start, todos);
  }
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
  quote = '',
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
      warnWithTodo(
        context,
        recorder,
        content,
        offset,
        grid,
        [
          'Migrate this <sky-grid> manually: replace it with <sky-data-grid> and declare a <sky-data-grid-column> for each entry in its [columns] array. <sky-data-grid> has no columns input.',
        ],
        quote,
      );
      getElementsByTagName('sky-grid-column', grid).forEach((column) =>
        skippedColumns.add(column),
      );
      columnsSkipped++;
      continue;
    }
    // Each grid is swapped on its own so traversal never has to descend into
    // self-closing columns (which parse5 nests instead of treating as siblings).
    warnWithTodo(
      context,
      recorder,
      content,
      offset,
      grid,
      getGridWarnings(grid, content),
      quote,
    );
    if (hasAttribute(grid, [outputForm('columnWidthChange')])) {
      logOnce(
        context,
        'warn',
        'Column width change events from <sky-grid> have no <sky-data-grid> equivalent. Remove code that depends on them.',
      );
    }
    swapTags(content, recorder, offset, GRID_TAG, gridTagSwap, grid);
    converted++;
  }

  // One "TODO" per list-view grid rather than per column keeps the comments
  // from repeating for every column in the list.
  for (const listViewGrid of getElementsByTagName(
    LIST_VIEW_GRID_TAG,
    fragment,
  )) {
    const listViewColumns = getElementsByTagName(
      'sky-grid-column',
      listViewGrid,
    );
    if (listViewColumns.length > 0) {
      listViewGridSkipped += listViewColumns.length;
      warnWithTodo(
        context,
        recorder,
        content,
        offset,
        listViewGrid,
        [
          `Migrate this <sky-list-view-grid> and its parent <sky-list> to <sky-data-manager> with a <sky-data-view> that contains a <sky-data-grid>, converting each <sky-grid-column> to <sky-data-grid-column>. See ${DATA_MANAGER_DOC_URL}`,
        ],
        quote,
      );
    }
  }

  // Collect columns from the whole fragment (getElementsByTagName traverses
  // unconditionally) and swap each individually for the same reason.
  const columns = getElementsByTagName('sky-grid-column', fragment).filter(
    (column) =>
      !hasAncestorTag(column, LIST_VIEW_GRID_TAG) &&
      !skippedColumns.has(column),
  );
  for (const column of columns) {
    warnWithTodo(
      context,
      recorder,
      content,
      offset,
      column,
      getColumnWarnings(column),
      quote,
    );
    swapTags(content, recorder, offset, COLUMN_TAG, columnTagSwap, column);
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
          content[template.start - 1],
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
 * All `@NgModule` metadata objects in `source` that export `SkyGridModule`
 * without also importing it.
 */
function getNgModulesExportingGridModuleWithoutImportingIt(
  source: ts.SourceFile,
): ts.ObjectLiteralExpression[] {
  if (!isImportedFromPackage(source, 'NgModule', '@angular/core')) {
    return [];
  }
  return getDecoratorMetadata(source, 'NgModule', '@angular/core').filter(
    (node): node is ts.ObjectLiteralExpression =>
      ts.isObjectLiteralExpression(node) &&
      ngModuleExportsGridModuleWithoutImportingIt(node),
  );
}

/**
 * True when `addSymbolToClassMetadata` can add to the NgModule's `imports`:
 * the field is absent or an array literal. A constant or shorthand property
 * can't be edited safely, and neither can any NgModule with a spread, which
 * may supply `imports` that an added or edited field would override.
 */
function hasEditableImports(node: ts.ObjectLiteralExpression): boolean {
  if (node.properties.some(ts.isSpreadAssignment)) {
    return false;
  }
  // getMetadataField skips shorthand properties, so match by name instead.
  const imports = node.properties.find(
    (property) =>
      !!property.name &&
      (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) &&
      property.name.text === 'imports',
  );
  return (
    !imports ||
    (ts.isPropertyAssignment(imports) &&
      ts.isArrayLiteralExpression(imports.initializer))
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
  const gridImport = source.statements.find(
    (statement): statement is ts.ImportDeclaration =>
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text === SKY_GRID_MODULE_PACKAGE &&
      !!statement.importClause?.namedBindings &&
      ts.isNamedImports(statement.importClause.namedBindings) &&
      statement.importClause.namedBindings.elements.some(
        (specifier) =>
          (specifier.propertyName ?? specifier.name).text === SKY_GRID_MODULE,
      ),
  );
  if (!gridImport) {
    return;
  }

  const total = getAssociatedEvidence(
    source,
    filePath,
    fileAggregates,
    classToFiles,
  );

  const recorder = tree.beginUpdate(filePath);
  const warnAtImport = (warning: string): void => {
    logOnce(context, 'warn', warning);
    const start = gridImport.getStart();
    const todo = `// ${TODO_PREFIX} ${warning}${getEOL(source.text)}`;
    // A file the migration leaves unchanged keeps its TODOs from a prior run.
    if (!source.text.includes(todo)) {
      recorder.insertLeft(start, todo);
    }
  };

  if (total.converted > 0) {
    // A real conversion needs SkyDataGrid/SkyDataGridColumn. Any list-view-grid
    // skip stays safe because <sky-list-view-grid> requires
    // SkyListViewGridModule, which re-exports SkyGridModule.
    const modulesNeedingGridImportForExport =
      getNgModulesExportingGridModuleWithoutImportingIt(source);
    // An NgModule whose `imports` can't be edited keeps exporting
    // SkyGridModule, since it can't import SkyDataGrid/SkyDataGridColumn.
    const uneditableModules = modulesNeedingGridImportForExport.filter(
      (moduleNode) => !hasEditableImports(moduleNode),
    );
    const isOutsideUneditableModule = (node: ts.Node): boolean =>
      !uneditableModules.some(
        (moduleNode) =>
          node.getStart() >= moduleNode.getStart() &&
          node.getEnd() <= moduleNode.getEnd(),
      );
    // Listing the data grid classes in place of, or alongside, SkyGridModule
    // is only valid inside an array; elsewhere (a variable initializer, a
    // call argument) it would change the code's meaning.
    const references = findNodes(source, ts.SyntaxKind.Identifier).filter(
      (node) =>
        (node as ts.Identifier).text === SKY_GRID_MODULE &&
        !ts.isImportSpecifier(node.parent) &&
        isOutsideUneditableModule(node),
    );
    const arrayElements = references.filter((node) =>
      ts.isArrayLiteralExpression(node.parent),
    );
    if (total.columnsSkipped > 0) {
      // The [columns] grid still requires SkyGridModule, so the data grid
      // classes are added alongside it rather than replacing it.
      for (const element of arrayElements) {
        recorder.insertRight(
          element.getEnd(),
          `, ${DATA_GRID_CLASS_NAMES.join(', ')}`,
        );
      }
      const missingImports = DATA_GRID_CLASS_NAMES.filter(
        (className) =>
          !isImportedFromPackage(source, className, '@skyux/data-grid'),
      );
      if (arrayElements.length > 0 && missingImports.length > 0) {
        applyToUpdateRecorder(recorder, [
          insertImport(
            source,
            filePath,
            missingImports.join(', '),
            '@skyux/data-grid',
          ),
        ]);
      }
      warnAtImport(COLUMNS_GRID_IMPORT_TODO);
    } else {
      swapImportedClass(recorder, filePath, source, [
        {
          classNames: {
            [SKY_GRID_MODULE]: DATA_GRID_CLASS_NAMES,
          },
          moduleName: {
            old: SKY_GRID_MODULE_PACKAGE,
            new: '@skyux/data-grid',
          },
          filter: (node): boolean => arrayElements.includes(node),
        },
      ]);
    }
    if (arrayElements.length < references.length) {
      warnAtImport(
        'Add SkyDataGrid and SkyDataGridColumn from @skyux/data-grid wherever SkyGridModule is referenced outside an array: the migration only updates arrays.',
      );
    }
    if (uneditableModules.length > 0) {
      warnAtImport(
        'Add SkyDataGrid and SkyDataGridColumn from @skyux/data-grid to the imports and exports of the NgModule that exports SkyGridModule, then remove SkyGridModule from it: the migration cannot safely edit its imports, which is not an array literal or sits alongside a spread.',
      );
    }
    for (const moduleNode of modulesNeedingGridImportForExport.filter(
      hasEditableImports,
    )) {
      // The import is already added by swapImportedClass above, so only the
      // metadata array needs the symbols (importPath: null). Restrict the
      // edit to this NgModule, since a file can declare more than one, and
      // only add whichever class names its `imports` array is missing (it
      // may already reference SkyDataGrid/SkyDataGridColumn directly).
      const missingClassNames = DATA_GRID_CLASS_NAMES.filter(
        (className) =>
          !isSymbolInClassMetadataFieldArray(moduleNode, 'imports', className),
      );
      if (!missingClassNames.length) {
        continue;
      }
      applyToUpdateRecorder(
        recorder,
        addSymbolToClassMetadata(
          source,
          'NgModule',
          filePath,
          'imports',
          missingClassNames.join(', '),
          null,
          (node) => node === moduleNode,
        ),
      );
    }
  } else if (total.columnsSkipped > 0) {
    warnAtImport(COLUMNS_GRID_IMPORT_TODO);
  } else if (total.listViewGridSkipped > 0) {
    const listViewGridModuleImported = isImportedFromPackage(
      source,
      SKY_LIST_VIEW_GRID_MODULE,
      SKY_LIST_VIEW_GRID_MODULE_PACKAGE,
    );
    if (listViewGridModuleImported) {
      // SkyGridModule is redundant only where SkyListViewGridModule, which
      // re-exports it, is imported alongside it; other metadata may need it
      // for templates the evidence didn't associate with this file.
      const removed = removeClassReference(
        recorder,
        source,
        SKY_GRID_MODULE,
        SKY_GRID_MODULE_PACKAGE,
        ['imports'],
        SKY_LIST_VIEW_GRID_MODULE,
      );
      if (!removed) {
        warnAtImport(
          'Remove the remaining SkyGridModule references if nothing uses them: it was removed only where SkyListViewGridModule, which already exports it, is also imported.',
        );
      }
    } else {
      warnAtImport(
        'Replace SkyGridModule with SkyDataGrid and SkyDataGridColumn from @skyux/data-grid after migrating the <sky-list-view-grid> to <sky-data-manager>.',
      );
    }
  } else {
    warnAtImport(
      'Remove SkyGridModule if nothing uses it. Otherwise replace it with SkyDataGrid and SkyDataGridColumn from @skyux/data-grid; an NgModule that re-exports it must list them in both imports and exports.',
    );
  }
  tree.commitUpdate(recorder);
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
