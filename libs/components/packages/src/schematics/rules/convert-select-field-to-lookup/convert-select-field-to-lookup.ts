import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import { isImported, parse5, parseSourceFile } from '@angular/cdk/schematics';

import {
  SwapTagCallback,
  getElementsByTagName,
  parseTemplate,
  swapTags,
} from '../../utility/template';
import { getInlineTemplates } from '../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

import { ConvertSelectFieldToLookupOptions } from './options';

const regexpEscape = (str: string): string =>
  str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

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
  let attrName = String(newAttrName).replace(/^[[(]|[\]\)]$/g, '');
  if (attr.name.startsWith('[') && attr.name.endsWith(']')) {
    attrName = `[${newAttrName}]`;
  } else if (attr.name.startsWith('(') && attr.name.endsWith(')')) {
    attrName = `(${newAttrName})`;
  }
  return `${before}${attrName}="${attr.value}"`;
}

function selectFieldTagSwap(
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
): SwapTagCallback<'sky-select-field'> {
  return (position, oldTag, node, content) => {
    if (position === 'open') {
      let previousAttrLine = node.sourceCodeLocation.startLine;
      const attributesString = content.substring(
        node.sourceCodeLocation.startOffset + oldTag.length + 1,
        node.sourceCodeLocation.startTag.endOffset,
      );
      let value = `<sky-lookup`;
      const customPicker = node.attrs.find(
        (attr) =>
          'custompicker' ===
          attr.name.replace('attr.', '').replace(/^\[|\]$/g, ''),
      );
      const pickerHeading = node.attrs.find(
        (attr) =>
          'pickerheading' ===
          attr.name.replace('attr.', '').replace(/^\[|\]$/g, ''),
      );
      const eitherShowMoreConfig = customPicker ?? pickerHeading;
      for (const attr of node.attrs) {
        const attrName = attr.name
          .replace('attr.', '')
          .replace(/^[[(]|[\]\)]$/g, '');
        const before =
          previousAttrLine < node.sourceCodeLocation.attrs[attr.name].startLine
            ? `\n${' '.repeat(node.sourceCodeLocation.attrs[attr.name].startCol)}`
            : ' ';
        if (
          [
            'inmemorysearchenabled',
            'multipleselectopenbuttontext',
            'singleselectclearbuttontitle',
            'singleselectopenbuttontitle',
          ].includes(attrName)
        ) {
          bestEffortMessage(
            `The "${attrName}" attribute is not supported on the <sky-lookup> component.`,
            context,
            options,
          );
        } else if (['blur', 'searchapplied'].includes(attrName)) {
          bestEffortMessage(
            `The "${attrName}" event is not supported on the <sky-lookup> component.`,
            context,
            options,
          );
        } else if (
          ['arialabel', 'arialabelledby', 'disabled', 'selectmode'].includes(
            attrName,
          )
        ) {
          value += before;
          value += content.substring(
            node.sourceCodeLocation.attrs[attr.name].startOffset,
            node.sourceCodeLocation.attrs[attr.name].endOffset,
          );
        } else if (attrName === 'data') {
          value += `${before}[data]="${attr.value} | async"`;
          // todo: import async pipe if not already imported
        } else if (attrName === 'descriptorKey'.toLowerCase()) {
          value += defineAttribute(before, attr, 'descriptorProperty');
        } else if (attrName === 'singleSelectPlaceholderText'.toLowerCase()) {
          value += defineAttribute(before, attr, 'placeholderText');
        } else if (attrName === 'showAddNewRecordButton'.toLowerCase()) {
          value += defineAttribute(before, attr, 'showAddButton');
        } else if (attrName === 'addNewRecordButtonClick'.toLowerCase()) {
          value += defineAttribute(before, attr, 'addClick');
        } else if (eitherShowMoreConfig === attr) {
          value += `${before}[showMoreConfig]="{ `;
          if (pickerHeading) {
            const pickerHeadingValue = pickerHeading.value.trim();
            value += `nativePickerConfig: { `;
            if (pickerHeading.name === '[pickerheading]') {
              value += `title: ( ${pickerHeadingValue} )`;
            } else if (
              pickerHeadingValue.startsWith('{{') &&
              pickerHeadingValue.endsWith('}}')
            ) {
              value += `title: ( ${pickerHeadingValue.slice(2, -2).trim()} )`;
            } else {
              value += `title: '${pickerHeadingValue}'`;
            }
            value += ` }`;
          }
          if (customPicker && pickerHeading) {
            value += `, `;
          }
          if (customPicker) {
            bestEffortMessage(
              `The "customPicker" attribute is not supported on the <sky-lookup> component, and the replacement showMoreConfig option has a different API.`,
              context,
              options,
            );
            const customPickerValue = customPicker.value.trim();
            value += `customPicker: ${customPickerValue}`;
          }
          value += ` }"`;
        } else if (!['pickerheading', 'custompicker'].includes(attrName)) {
          const attributeText = new RegExp(
            `(?<=\\s)${regexpEscape(attr.name)}(="[^"]*")?`,
            'di',
          )
            .exec(attributesString)
            ?.shift();
          if (attributeText) {
            value += `${before}${attributeText}`;
          }
        }
        previousAttrLine = node.sourceCodeLocation.attrs[attr.name].startLine;
      }
      if (!node.sourceCodeLocation.endTag) {
        value += ' />';
      } else {
        value += '>';
      }
      return value;
    }
    return `</sky-lookup>`;
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
