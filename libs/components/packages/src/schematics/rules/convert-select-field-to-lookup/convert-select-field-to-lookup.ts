import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import {
  findNodes,
  getDecoratorMetadata,
  getMetadataField,
  isImported,
  parse5,
  parseSourceFile,
} from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { ProjectDefinition } from '@schematics/angular/utility';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';
import { applyChangesToFile } from '@schematics/angular/utility/standalone/util';

import { dirname, join, normalize } from 'node:path';

import {
  ElementWithLocation,
  SwapTagCallback,
  getElementsByTagName,
  parseTemplate,
  swapTags,
} from '../../utility/template';
import {
  findDeclaringModule,
  isStandaloneComponent,
} from '../../utility/typescript/find-module';
import {
  addSymbolToClassMetadata,
  getInlineTemplates,
} from '../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';
import { getRequiredProject } from '../../utility/workspace';

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
  importAsyncPipe: boolean;
  swapModuleImports: boolean;
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

function applyFollowupTasksToComponent(
  source: ts.SourceFile,
  tree: Tree,
  filePath: string,
  followupTasks: FollowupTasks,
  isStandalone: boolean,
  eol: string,
): void {
  if (
    isStandalone &&
    isImported(source, 'SkySelectFieldModule', '@skyux/select-field')
  ) {
    const recorder = tree.beginUpdate(filePath);
    swapImportedClass(recorder, filePath, parseSourceFile(tree, filePath), [
      {
        classNames: { SkySelectFieldModule: 'SkyLookupModule' },
        moduleName: {
          old: '@skyux/select-field',
          new: '@skyux/lookup',
        },
      },
    ]);
    tree.commitUpdate(recorder);
  }

  if (
    isStandalone &&
    followupTasks?.importAsyncPipe &&
    !isImported(source, 'AsyncPipe', '@angular/common') &&
    !isImported(source, 'CommonModule', '@angular/common')
  ) {
    applyChangesToFile(
      tree,
      filePath,
      addSymbolToClassMetadata(
        parseSourceFile(tree, filePath),
        'Component',
        filePath,
        'imports',
        'AsyncPipe',
        '@angular/common',
      ),
    );
  }

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
}

function applyFollowupTasksToModule(
  tree: Tree,
  filePath: string,
  followupTasks: FollowupTasks,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
  project: ProjectDefinition,
): void {
  /* istanbul ignore next */
  const projectPath = project.sourceRoot ?? project.root;
  const module = findDeclaringModule(tree, projectPath, filePath);
  if (module) {
    contextLogOnce(
      'info',
      `Found the declaring module for the component in ${module.filepath}.`,
      context,
    );
    let moduleSource = parseSourceFile(tree, module.filepath);

    if (
      isImported(moduleSource, 'SkySelectFieldModule', '@skyux/select-field')
    ) {
      const recorder = tree.beginUpdate(module.filepath);
      swapImportedClass(recorder, filePath, moduleSource, [
        {
          classNames: { SkySelectFieldModule: 'SkyLookupModule' },
          moduleName: { old: '@skyux/select-field', new: '@skyux/lookup' },
        },
      ]);
      tree.commitUpdate(recorder);
      moduleSource = parseSourceFile(tree, module.filepath);
    }

    if (
      followupTasks.importAsyncPipe &&
      !isImported(moduleSource, 'AsyncPipe', '@angular/common') &&
      !isImported(moduleSource, 'CommonModule', '@angular/common')
    ) {
      applyChangesToFile(
        tree,
        module.filepath,
        addSymbolToClassMetadata(
          moduleSource,
          'NgModule',
          module.filepath,
          'imports',
          'AsyncPipe',
          '@angular/common',
        ),
      );
    }
  } else {
    bestEffortMessage(
      `Could not find the declaring module for the component in ${filePath}.`,
      context,
      options,
    );
  }
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
    contextLogOnce(
      'warn',
      `${msg} Please review the code to ensure it still works as expected.`,
      context,
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
  for (const attr of node.attrs) {
    before = getIndentation(previousAttrLine, node, attr, eol);
    const attrName = normalizeAttrName(attr);
    if (attrNameIsOneOf(attrName, unsupportedAttributes)) {
      contextLogOnce(
        'warn',
        `The "${attrName}" attribute is not supported on the <sky-lookup> component and will be removed.`,
        context,
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
        value += `${before}[data]="${attr.value} | async"`;
        followupTasks.importAsyncPipe = true;
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
    if (options.insertTodos && customPickerValue.match(/^[a-zA-Z_]+$/)) {
      const customPickerName = customPicker.value.trim();
      followupTasks.addCommentsToProperties[customPickerName] =
        `update this to use SkyLookupShowMoreCustomPicker; more info at https://developer.blackbaud.com/skyux/components/lookup?docs-active-tab=development#interface_sky-lookup-show-more-custom-picker`;
    }
  }
  showMoreConfig += ` }"`;
  return showMoreConfig;
}

const loggedMessages: Set<string> = new Set();
function contextLogOnce(
  level: 'info' | 'warn',
  message: string,
  context: SchematicContext,
): void {
  if (!loggedMessages.has(message)) {
    context.logger[level](message);
    loggedMessages.add(message);
  }
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
  content: string,
  context: SchematicContext,
  options: ConvertSelectFieldToLookupOptions,
  offset = 0,
): FollowupTasks {
  const fragment = parseTemplate(content);
  const selectFields = getElementsByTagName('sky-select-field', fragment);
  const followupTasks: FollowupTasks = {
    importAsyncPipe: false,
    swapModuleImports: false,
    addCommentsToFunctions: {},
    addCommentsToProperties: {},
  };
  for (const selectField of selectFields) {
    followupTasks.swapModuleImports = true;
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
    const followupTasks = convertTemplate(recorder, content, context, options);
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
  project: ProjectDefinition,
): void {
  const source = parseSourceFile(tree, filePath);
  const eol = getEOL(tree.readText(filePath));
  let followupTasks: FollowupTasks | undefined = undefined;
  if (isImported(source, 'Component', '@angular/core')) {
    const metadata = getDecoratorMetadata(
      source,
      'Component',
      '@angular/core',
    )[0] as ts.ObjectLiteralExpression;
    const templateUrl = getMetadataField(metadata, 'templateUrl')[0] as
      | ts.PropertyAssignment
      | undefined;
    if (templateUrl && ts.isStringLiteralLike(templateUrl.initializer)) {
      const htmlFilePath = normalize(
        join(dirname(filePath), templateUrl.initializer.text),
      );
      followupTasks = convertHtmlFile(tree, htmlFilePath, context, options);
    } else {
      const template = getInlineTemplates(source)[0];
      if (template) {
        const content = tree.readText(filePath);
        const templateContent = content.slice(template.start, template.end);
        const recorder = tree.beginUpdate(filePath);
        followupTasks = convertTemplate(
          recorder,
          templateContent,
          context,
          options,
          template.start,
        );
        tree.commitUpdate(recorder);
      }
    }

    if (followupTasks?.swapModuleImports) {
      const isStandalone = isStandaloneComponent(metadata);
      applyFollowupTasksToComponent(
        source,
        tree,
        filePath,
        followupTasks,
        isStandalone,
        eol,
      );
      if (!isStandalone) {
        applyFollowupTasksToModule(
          tree,
          filePath,
          followupTasks,
          context,
          options,
          project,
        );
      }
    }
  }
}

export function convertSelectFieldToLookup(
  options: ConvertSelectFieldToLookupOptions,
): Rule {
  return async (tree, context) => {
    const { project } = await getRequiredProject(tree, options.project);
    visitProjectFiles(tree, options.projectPath, (filePath) => {
      if (filePath.endsWith('.ts')) {
        convertTypescriptFile(tree, filePath, context, options, project);
      }
    });
  };
}
