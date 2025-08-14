import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
  chain,
} from '@angular-devkit/schematics';
import {
  findNodes,
  getDecoratorMetadata,
  isImported,
  parse5,
  parseSourceFile,
} from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { ExistingBehavior, addDependency } from '@schematics/angular/utility';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';
import { applyChangesToFile } from '@schematics/angular/utility/standalone/util';

import { dirname, join, normalize } from 'node:path';

import { logOnce } from '../../utility/log-once';
import {
  ElementWithLocation,
  SwapTagCallback,
  getElementsByTagName,
  getText,
  parseTemplate,
  swapTags,
} from '../../utility/template';
import {
  addSymbolToClassMetadata,
  getInlineTemplates,
  getTemplateUrls,
  getTestingModuleMetadata,
  isSymbolInClassMetadataFieldArray,
} from '../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

import { ConvertSelectFieldToLookupOptions } from './options';

const attrSwap: Record<string, string> = {
  /* eslint-disable-next-line @cspell/spellchecker */
  descriptorkey: 'descriptorProperty',
  /* eslint-disable-next-line @cspell/spellchecker */
  singleselectplaceholdertext: 'placeholderText',
  /* eslint-disable-next-line @cspell/spellchecker */
  showaddnewrecordbutton: 'showAddButton',
  /* eslint-disable-next-line @cspell/spellchecker */
  addnewrecordbuttonclick: 'addClick',
};
const unsupportedAttributes = [
  'inMemorySearchEnabled',
  'multipleSelectOpenButtonText',
  'singleSelectClearButtonTitle',
  'singleSelectOpenButtonTitle',
];
const unsupportedEvents = ['blur', 'searchApplied'];

interface FollowupTasks {
  templateUsesSelectField: boolean;
  addCommentsToFunctions: Record<string, string>;
  addCommentsToProperties: Record<string, string>;
}

function addFollowupComments(
  filePath: string,
  sourceFile: ts.SourceFile,
  followupTasks: FollowupTasks,
  eol: string,
): Change[] {
  const changes: Change[] = [];
  const addComments = ([functionName, comment]: [string, string]): void => {
    const functionNodes = findNodes(
      sourceFile,
      (node): node is ts.Identifier =>
        ts.isIdentifier(node) && node.text === functionName,
    );
    if (functionNodes.length === 1) {
      const line = sourceFile.getLineAndCharacterOfPosition(
        functionNodes[0].getStart(),
      ).line;
      const lineStart = sourceFile.getPositionOfLineAndCharacter(line, 0);
      const lineText = String(sourceFile.text.split('\n')[line]);
      const indentation = lineText.match(/^\s*/)?.[0] || '';
      changes.push(
        new InsertChange(
          filePath,
          lineStart,
          `${indentation}// todo: ${comment}${eol}`,
        ),
      );
    }
  };
  Object.entries(followupTasks.addCommentsToFunctions).forEach(addComments);
  Object.entries(followupTasks.addCommentsToProperties).forEach(addComments);
  return changes;
}

function applyModuleDependencies(
  originalSource: ts.SourceFile,
  tree: Tree,
  filePath: string,
  _context: SchematicContext,
): void {
  (
    [
      ['Component', '@angular/core'],
      ['NgModule', '@angular/core'],
      ['TestBed.configureTestingModule', '@angular/core/testing'],
    ] as ['Component' | 'NgModule' | 'TestBed.configureTestingModule', string][]
  ).forEach(([decorator, decoratorModule]) => {
    if (
      isImported(
        originalSource,
        String(decorator.split('.').shift()),
        decoratorModule,
      )
    ) {
      const metadata =
        decorator === 'TestBed.configureTestingModule'
          ? getTestingModuleMetadata(originalSource)
          : getDecoratorMetadata(originalSource, decorator, decoratorModule);
      ['imports', 'exports'].forEach((metadataField) => {
        if (
          metadata.some(
            (node) =>
              ts.isObjectLiteralExpression(node) &&
              isSymbolInClassMetadataFieldArray(
                node,
                metadataField,
                'SkySelectFieldModule',
              ),
          )
        ) {
          [
            ['SkyInputBoxModule', '@skyux/forms'],
            [
              decorator === 'NgModule' ? 'CommonModule' : 'AsyncPipe',
              '@angular/common',
            ],
          ].forEach(([symbol, module]) => {
            applyChangesToFile(
              tree,
              filePath,
              addSymbolToClassMetadata(
                parseSourceFile(tree, filePath),
                decorator,
                filePath,
                metadataField,
                symbol,
                module,
              ),
            );
          });
          if (decorator === 'TestBed.configureTestingModule') {
            applyTestDependencies(tree, filePath);
          }
        }
      });
    }
  });
}

function applyTestDependencies(tree: Tree, filePath: string): void {
  applyChangesToFile(
    tree,
    filePath,
    addSymbolToClassMetadata(
      parseSourceFile(tree, filePath),
      'TestBed.configureTestingModule',
      filePath,
      'providers',
      'provideNoopAnimations()',
      '@angular/platform-browser/animations',
    ),
  );
}

function attrNameIsOneOf(attrName: string, checkAttrName: string[]): boolean {
  return checkAttrName.map((name) => name.toLowerCase()).includes(attrName);
}

function bestEffortMessage(
  msg: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
): void {
  if (options.bestEffortMode) {
    logOnce(
      context,
      'warn',
      `${msg} Please review the code to ensure it still works as expected.`,
    );
  } else {
    throw new Error(
      `${msg} The 'bestEffortMode' option is required to continue.`,
    );
  }
}

function buildOpeningTag(
  node: ElementWithLocation,
  content: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
  followupTasks: FollowupTasks,
): string {
  const eol = getEOL(content);
  let previousAttrLine = node.sourceCodeLocation.startLine;
  let value = `<sky-lookup`;
  const { customPicker, pickerHeading, eitherShowMoreConfig } =
    findShowMoreConfigAttributes(node);
  let before = '';
  if (
    node.attrs.some(
      (attr) =>
        '[selectMode]'.toLowerCase() === attr.name ||
        ('selectMode'.toLowerCase() === attr.name && attr.value !== 'multiple'),
    )
  ) {
    bestEffortMessage(
      `The <sky-select-field> component would return a single item when using single select mode, but the <sky-lookup> component returns an array value regardless of the "selectMode" attribute. The form model and validation may need to be updated.`,
      context,
      options,
    );
  }
  for (const attr of node.attrs) {
    before = getIndentation(previousAttrLine, node, attr, eol);
    const attrName = normalizeAttrName(attr);
    if (attrNameIsOneOf(attrName, unsupportedAttributes)) {
      logOnce(
        context,
        'warn',
        `The "${attrName}" attribute is not supported on the <sky-lookup> component and will be removed.`,
      );
    } else {
      if (attrNameIsOneOf(attrName, unsupportedEvents)) {
        handleUnsupportedAttribute(
          attrName,
          context,
          options,
          attr,
          followupTasks,
        );
      } else if (attr.name === '[data]') {
        bestEffortMessage(
          `The "${attrName}" attribute on <sky-lookup> uses an array rather than an observable, and adding the "async" pipe is required to migrate the existing code.`,
          context,
          options,
        );
        value += `${before}[data]="(${attr.value} | async) ?? []"`;
      } else if (attrNameIsOneOf(attrName, Object.keys(attrSwap))) {
        const newAttrName = attrSwap[attrName];
        value += defineAttribute(before, attr, newAttrName);
      } else if (eitherShowMoreConfig === attr) {
        value += buildShowMoreConfig(
          before,
          pickerHeading,
          customPicker,
          context,
          options,
          followupTasks,
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
  // Enable the "showMore" feature by default.
  value += `${before}enableShowMore`;
  // Set the idProperty to "id" -- select-field did not have an input to override this.
  value += `${before}idProperty="id"`;

  if (!node.sourceCodeLocation.endTag) {
    value += ' />';
  } else {
    value += '>';
  }
  return value;
}

function buildShowMoreConfig(
  before: string,
  pickerHeading: parse5.Token.Attribute | undefined,
  customPicker: parse5.Token.Attribute | undefined,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
  followupTasks: FollowupTasks,
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
      showMoreConfig += `title: '${pickerHeadingValue.replace(/'/g, "\\'")}'`;
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
    if (options.insertTodos && customPickerValue.match(/^[a-zA-Z_]+$/)) {
      const customPickerName = customPicker.value.trim();
      followupTasks.addCommentsToProperties[customPickerName] =
        `update this to use SkyLookupShowMoreCustomPicker; more info at https://developer.blackbaud.com/skyux/components/lookup?docs-active-tab=development#interface_sky-lookup-show-more-custom-picker`;
    }
  }
  showMoreConfig += ` }"`;
  return showMoreConfig;
}

function defineAttribute(
  before: string,
  attr: parse5.Token.Attribute,
  newAttrName: string,
): string {
  // Normalize the attribute name to remove any brackets or parentheses.
  let attrName = String(newAttrName).replace(/^[[(]|[\])]$/g, '');
  if (attr.name.startsWith('[') && attr.name.endsWith(']')) {
    attrName = `[${attrName}]`;
  } else if (attr.name.startsWith('(') && attr.name.endsWith(')')) {
    attrName = `(${attrName})`;
  }
  return `${before}${attrName}="${attr.value}"`;
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

function handleUnsupportedAttribute(
  attrName: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
  attr: parse5.Token.Attribute,
  followupTasks: FollowupTasks,
): void {
  bestEffortMessage(
    `The "${attrName}" event is not supported on the <sky-lookup> component.`,
    context,
    options,
  );
  if (options.insertTodos && attr.value.trim().match(/^[a-zA-Z_]+\(/)) {
    const functionName = attr.value.trim().replace(/\(.*$/, '');
    followupTasks.addCommentsToFunctions[functionName] =
      `check whether this is still needed; previously used for the ${attrName} event on <sky-select-field>`;
  }
}

function normalizeAttrName(attr: parse5.Token.Attribute): string {
  return attr.name.replace('attr.', '').replace(/^[[(]|[\])]$/g, '');
}

function selectFieldTagSwap(
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
  followupTasks: FollowupTasks,
): SwapTagCallback<'sky-select-field'> {
  return (position, _oldTag, node, content) => {
    if (position === 'open') {
      return buildOpeningTag(node, content, context, options, followupTasks);
    } else {
      return `</sky-lookup>`;
    }
  };
}

function convertTemplate(
  recorder: UpdateRecorder,
  filePath: string,
  content: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
  offset = 0,
): FollowupTasks {
  const fragment = parseTemplate(content);
  const selectFields = getElementsByTagName('sky-select-field', fragment);
  const followupTasks: FollowupTasks = {
    templateUsesSelectField: false,
    addCommentsToFunctions: {},
    addCommentsToProperties: {},
  };
  function getLabelTextAttribute(labelText: string): string {
    if (labelText.includes('"')) {
      if (labelText.includes("'")) {
        if (labelText.includes('`')) {
          return '';
        }
        return `"${labelText.replace(/"/g, '`')}"`;
      }
      return `'${labelText}'`;
    }
    return `"${labelText}"`;
  }

  for (const selectField of selectFields) {
    followupTasks.templateUsesSelectField = true;
    const siblingElements = selectField.parentNode?.childNodes.filter(
      (el) => 'tagName' in el,
    );
    if (
      siblingElements?.length === 2 &&
      siblingElements[0].tagName === 'label' &&
      siblingElements[1] === selectField
    ) {
      const labelNode = siblingElements[0] as ElementWithLocation;
      const labelText = getText(labelNode.childNodes);
      const labelTextAttribute = getLabelTextAttribute(labelText);
      const replaceParent =
        !!selectField.parentNode &&
        'tagName' in selectField.parentNode &&
        !!labelTextAttribute &&
        ['sky-input-box', 'p', 'div'].includes(selectField.parentNode.tagName);
      if (replaceParent) {
        const parentNode = selectField.parentNode as ElementWithLocation;
        recorder.remove(
          parentNode.sourceCodeLocation.startTag.startOffset + offset,
          labelNode.sourceCodeLocation.endTag.endOffset -
            parentNode.sourceCodeLocation.startTag.startOffset,
        );
        recorder.remove(
          parentNode.sourceCodeLocation.endTag.startOffset + offset,
          parentNode.sourceCodeLocation.endTag.endOffset -
            parentNode.sourceCodeLocation.endTag.startOffset,
        );
        recorder.insertRight(
          parentNode.sourceCodeLocation.startTag.startOffset + offset,
          `<sky-input-box labelText=${labelTextAttribute}>`,
        );
        recorder.insertRight(
          parentNode.sourceCodeLocation.endTag.endOffset + offset,
          '</sky-input-box>',
        );
      } else if (labelTextAttribute) {
        recorder.remove(
          labelNode.sourceCodeLocation.startTag.startOffset + offset,
          labelNode.sourceCodeLocation.endTag.endOffset -
            labelNode.sourceCodeLocation.startTag.startOffset,
        );
        recorder.insertRight(
          labelNode.sourceCodeLocation.startOffset + offset,
          `<sky-input-box labelText=${labelTextAttribute}>`,
        );
        recorder.insertRight(
          selectField.sourceCodeLocation.endOffset + offset,
          '</sky-input-box>',
        );
      }
    }
    swapTags(
      content,
      recorder,
      offset,
      ['sky-select-field'],
      selectFieldTagSwap(context, options, followupTasks),
      selectField,
    );
  }
  return followupTasks;
}

function convertHtmlFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
): FollowupTasks | undefined {
  const content = tree.readText(filePath);
  if (content.includes('<sky-select-field')) {
    const recorder = tree.beginUpdate(filePath);
    const followupTasks = convertTemplate(
      recorder,
      filePath,
      content,
      context,
      options,
    );
    tree.commitUpdate(recorder);
    return followupTasks;
  }
  return undefined;
}

function convertTypescriptFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
  projectPath: string,
): void {
  let source = parseSourceFile(tree, filePath);
  const eol = getEOL(tree.readText(filePath));
  let followupTasks: FollowupTasks | undefined = undefined;
  if (isImported(source, 'SkySelectFieldModule', '@skyux/select-field')) {
    applyModuleDependencies(source, tree, filePath, context);
    const recorder = tree.beginUpdate(filePath);
    swapImportedClass(recorder, filePath, parseSourceFile(tree, filePath), [
      {
        classNames: { SkySelectFieldModule: 'SkyLookupModule' },
        moduleName: { old: '@skyux/select-field', new: '@skyux/lookup' },
      },
    ]);
    tree.commitUpdate(recorder);
    source = parseSourceFile(tree, filePath);
  }

  if (isImported(source, 'Component', '@angular/core')) {
    const templateUrl = getTemplateUrls(source)[0];
    if (templateUrl) {
      const htmlFilePath = normalize(join(dirname(filePath), templateUrl));
      followupTasks = convertHtmlFile(tree, htmlFilePath, context, options);
    } else {
      const template = getInlineTemplates(source)[0];
      if (template) {
        const content = tree.readText(filePath);
        const templateContent = content.slice(template.start, template.end);
        const recorder = tree.beginUpdate(filePath);
        followupTasks = convertTemplate(
          recorder,
          filePath,
          templateContent,
          context,
          options,
          template.start,
        );
        tree.commitUpdate(recorder);
      }
    }

    if (followupTasks?.templateUsesSelectField) {
      applyChangesToFile(
        tree,
        filePath,
        addFollowupComments(
          filePath,
          parseSourceFile(tree, filePath),
          followupTasks,
          eol,
        ),
      );
      const testFilePath = filePath.replace('.ts', '.spec.ts');
      if (tree.exists(testFilePath)) {
        applyTestDependencies(tree, testFilePath);
      }
    }
  }
}

export function convertSelectFieldToLookup(
  options: ConvertSelectFieldToLookupOptions,
): Rule {
  return chain([
    (tree, context): void => {
      visitProjectFiles(tree, options.projectPath, (filePath) => {
        if (filePath.endsWith('.ts')) {
          convertTypescriptFile(
            tree,
            filePath,
            context,
            options,
            options.projectPath,
          );
        }
      });
    },
    addDependency('@skyux/forms', `0.0.0-PLACEHOLDER`, {
      existing: ExistingBehavior.Skip,
    }),
    addDependency('@skyux/lookup', `0.0.0-PLACEHOLDER`, {
      existing: ExistingBehavior.Skip,
    }),
  ]);
}
