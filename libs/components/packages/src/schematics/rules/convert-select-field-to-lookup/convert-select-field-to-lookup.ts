import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import { isImported, parse5, parseSourceFile } from '@angular/cdk/schematics';
import { getEOL } from '@schematics/angular/utility/eol';

import {
  ElementWithLocation,
  SwapTagCallback,
  getElementsByTagName,
  parseTemplate,
  swapTags,
} from '../../utility/template';
import { getInlineTemplates } from '../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

import { ConvertSelectFieldToLookupOptions } from './options';

function bestEffortMessage(
  msg: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
): void {
  if (options.bestEffortMode) {
    context.logger.warn(
      `${msg} Please review the code to ensure it still works as expected.`,
    );
  } else {
    throw new Error(
      `${msg} The 'bestEffortMode' option is required to continue.`,
    );
  }
}

function defineAttribute(
  before: string,
  attr: parse5.Token.Attribute,
  newAttrName: string,
): string {
  // Normalize the attribute name to remove any brackets or parentheses.
  let attrName = newAttrName.replace(/^[[(]|[\])]$/g, '');
  if (attr.name.startsWith('[') && attr.name.endsWith(']')) {
    attrName = `[${attrName}]`;
  } else if (attr.name.startsWith('(') && attr.name.endsWith(')')) {
    attrName = `(${attrName})`;
  }
  return `${before}${attrName}="${attr.value}"`;
}

function buildShowMoreConfig(
  before: string,
  pickerHeading: parse5.Token.Attribute | undefined,
  customPicker: parse5.Token.Attribute | undefined,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
): string {
  let showMoreConfig = `${before}[showMoreConfig]="{ `;
  if (pickerHeading) {
    const pickerHeadingValue = pickerHeading.value.trim();
    showMoreConfig += `nativePickerConfig: { `;
    if (pickerHeading.name === '[pickerHeading]'.toLowerCase()) {
      showMoreConfig += `title: ( ${pickerHeadingValue} )`;
    } else if (
      pickerHeadingValue.startsWith('{{') &&
      pickerHeadingValue.endsWith('}}')
    ) {
      showMoreConfig += `title: ( ${pickerHeadingValue.slice(2, -2).trim()} )`;
    } else {
      showMoreConfig += `title: '${pickerHeadingValue}'`;
    }
    showMoreConfig += ` }`;
  }
  if (customPicker && pickerHeading) {
    showMoreConfig += `, `;
  }
  if (customPicker) {
    bestEffortMessage(
      `The "customPicker" attribute is not supported on the <sky-lookup> component, and the replacement showMoreConfig option has a different API.`,
      context,
      options,
    );
    const customPickerValue = customPicker.value.trim();
    showMoreConfig += `customPicker: ${customPickerValue}`;
  }
  showMoreConfig += ` }"`;
  return showMoreConfig;
}

function attrNameIsOneOf(attrName: string, checkAttrName: string[]): boolean {
  return checkAttrName.map((name) => name.toLowerCase()).includes(attrName);
}

function findShowMoreConfigAttributes(node: ElementWithLocation): {
  customPicker: parse5.Token.Attribute | undefined;
  pickerHeading: parse5.Token.Attribute | undefined;
  eitherShowMoreConfig: parse5.Token.Attribute | undefined;
} {
  const customPicker = node.attrs.find(
    (attr) =>
      'customPicker'.toLowerCase() ===
      attr.name.replace('attr.', '').replace(/^\[|\]$/g, ''),
  );
  const pickerHeading = node.attrs.find(
    (attr) =>
      'pickerHeading'.toLowerCase() ===
      attr.name.replace('attr.', '').replace(/^\[|\]$/g, ''),
  );
  const eitherShowMoreConfig = customPicker ?? pickerHeading;
  return { customPicker, pickerHeading, eitherShowMoreConfig };
}

function getIndentation(
  previousAttrLine: number,
  node: ElementWithLocation,
  attr: parse5.Token.Attribute,
  eol: string,
): string {
  return previousAttrLine < node.sourceCodeLocation.attrs[attr.name].startLine
    ? `${eol}${' '.repeat(node.sourceCodeLocation.attrs[attr.name].startCol)}`
    : ' ';
}

function normalizeAttrName(attr: parse5.Token.Attribute): string {
  return attr.name.replace('attr.', '').replace(/^[[(]|[\])]$/g, '');
}

function buildOpeningTag(
  node: ElementWithLocation,
  content: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
): string {
  const eol = getEOL(content);
  let previousAttrLine = node.sourceCodeLocation.startLine;
  let value = `<sky-lookup`;
  const { customPicker, pickerHeading, eitherShowMoreConfig } =
    findShowMoreConfigAttributes(node);
  let before = '';
  for (const attr of node.attrs) {
    before = getIndentation(previousAttrLine, node, attr, eol);
    const attrName = normalizeAttrName(attr);
    if (
      attrNameIsOneOf(attrName, [
        'inMemorySearchEnabled',
        'multipleSelectOpenButtonText',
        'singleSelectClearButtonTitle',
        'singleSelectOpenButtonTitle',
      ])
    ) {
      bestEffortMessage(
        `The "${attrName}" attribute is not supported on the <sky-lookup> component.`,
        context,
        options,
      );
    } else if (attrNameIsOneOf(attrName, ['blur', 'searchApplied'])) {
      bestEffortMessage(
        `The "${attrName}" event is not supported on the <sky-lookup> component.`,
        context,
        options,
      );
    } else if (attr.name === '[data]') {
      value += `${before}[data]="${attr.value} | async"`;
      // todo: import async pipe if not already imported
    } else if (attrNameIsOneOf(attrName, ['descriptorKey'])) {
      value += defineAttribute(before, attr, 'descriptorProperty');
    } else if (attrNameIsOneOf(attrName, ['singleSelectPlaceholderText'])) {
      value += defineAttribute(before, attr, 'placeholderText');
    } else if (attrNameIsOneOf(attrName, ['showAddNewRecordButton'])) {
      value += defineAttribute(before, attr, 'showAddButton');
    } else if (attrNameIsOneOf(attrName, ['addNewRecordButtonClick'])) {
      value += defineAttribute(before, attr, 'addClick');
    } else if (eitherShowMoreConfig === attr) {
      value += buildShowMoreConfig(
        before,
        pickerHeading,
        customPicker,
        context,
        options,
      );
    } else if (
      attrName &&
      !attrNameIsOneOf(attrName, ['pickerHeading', 'customPicker'])
    ) {
      value += before;
      value += content.substring(
        node.sourceCodeLocation.attrs[attr.name].startOffset,
        node.sourceCodeLocation.attrs[attr.name].endOffset,
      );
    }
    previousAttrLine = node.sourceCodeLocation.attrs[attr.name].startLine;
  }

  // If there was no "descriptorKey" attribute, we need to add a descriptorProperty="label" attribute.
  if (
    !node.attrs.some(
      (attr) => normalizeAttrName(attr) === 'descriptorKey'.toLowerCase(),
    )
  ) {
    value += `${before}descriptorProperty="label"`;
  }
  // Set the idProperty to "id" -- select-field did not have an input to override this.
  value += `${before}idProperty="id"`;

  if (!node.sourceCodeLocation.endTag) {
    value += ' />';
  } else {
    value += '>';
  }
  return value;
}

function selectFieldTagSwap(
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
): SwapTagCallback<'sky-select-field'> {
  return (position, _oldTag, node, content) => {
    if (position === 'open') {
      return buildOpeningTag(node, content, context, options);
    } else {
      return `</sky-lookup>`;
    }
  };
}

function convertTemplate(
  recorder: UpdateRecorder,
  content: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
  offset = 0,
): void {
  const fragment = parseTemplate(content);
  const selectFields = getElementsByTagName('sky-select-field', fragment);
  for (const selectField of selectFields) {
    swapTags(
      content,
      recorder,
      offset,
      ['sky-select-field'],
      selectFieldTagSwap(context, options),
      selectField,
    );
  }
}

function convertHtmlFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
): void {
  const content = tree.readText(filePath);
  if (content.includes('<sky-select-field')) {
    const recorder = tree.beginUpdate(filePath);
    convertTemplate(recorder, content, context, options);
    tree.commitUpdate(recorder);
  }
}

function convertTypescriptFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
): void {
  const source = parseSourceFile(tree, filePath);
  const templates = getInlineTemplates(source);
  const recorder = tree.beginUpdate(filePath);
  if (templates.length > 0) {
    const content = tree.readText(filePath);
    for (const template of templates) {
      const templateContent = content.slice(template.start, template.end);
      if (templateContent.includes('<sky-select-field')) {
        convertTemplate(
          recorder,
          templateContent,
          context,
          options,
          template.start,
        );
      }
    }
  }
  if (isImported(source, 'SkySelectFieldModule', '@skyux/select-field')) {
    swapImportedClass(recorder, filePath, source, [
      {
        classNames: { SkySelectFieldModule: 'SkyLookupModule' },
        moduleName: { old: '@skyux/select-field', new: '@skyux/lookup' },
      },
    ]);
  }
  tree.commitUpdate(recorder);
}

export function convertSelectFieldToLookup(
  projectPath: string,
  options: ConvertSelectFieldToLookupOptions,
): Rule {
  return (tree, context) => {
    visitProjectFiles(tree, projectPath, (filePath) => {
      if (filePath.endsWith('.html')) {
        convertHtmlFile(tree, filePath, context, options);
      } else if (filePath.endsWith('.ts')) {
        convertTypescriptFile(tree, filePath, context, options);
      }
    });
  };
}
