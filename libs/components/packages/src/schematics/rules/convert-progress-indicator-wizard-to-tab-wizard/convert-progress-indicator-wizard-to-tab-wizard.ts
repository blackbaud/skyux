import { Rule, Tree, UpdateRecorder, chain } from '@angular-devkit/schematics';
import {
  getDecoratorMetadata,
  getMetadataField,
  isImported,
  parseSourceFile,
} from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { ExistingBehavior, addDependency } from '@schematics/angular/utility';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';
import { applyChangesToFile } from '@schematics/angular/utility/standalone/util';

import { dirname, join, normalize } from 'node:path';

import {
  ElementWithLocation,
  SwapTagCallback,
  getAttributeValueText,
  getElementsByTagName,
  isParentNode,
  parseTemplate,
  swapAttributes,
  swapTags,
} from '../../utility/template';
import {
  addSymbolToClassMetadata,
  getInlineTemplates,
  getTestingModuleMetadata,
  isStandaloneComponent,
  isSymbolInClassMetadataFieldArray,
} from '../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class.js';
import { visitProjectFiles } from '../../utility/visit-project-files.js';

import { ConvertProgressIndicatorWizardToTabWizardOptions } from './options.js';

/**
 * Tabs do not use a heading element.
 * Create a new `<h3>` element with the heading text.
 */
function moveHeading(
  progressIndicator: ElementWithLocation,
  recorder: UpdateRecorder,
  content: string,
  offset: number,
  eol: string,
): void {
  const heading = getElementsByTagName(
    'sky-progress-indicator-title',
    progressIndicator,
  )[0];
  if (isParentNode(heading)) {
    const headingText = content.slice(
      heading.sourceCodeLocation.startTag.endOffset,
      heading.sourceCodeLocation.endTag.startOffset,
    );
    const indent = ' '.repeat(
      progressIndicator.sourceCodeLocation.startTag.startCol - 1,
    );
    recorder.insertLeft(
      offset + progressIndicator.sourceCodeLocation.startTag.startOffset,
      `<h3 class="sky-margin-stacked-sm">${headingText}</h3>${eol}${indent}`,
    );
    recorder.remove(
      offset + heading.sourceCodeLocation.startOffset,
      heading.sourceCodeLocation.endOffset -
        heading.sourceCodeLocation.startOffset,
    );
  }
}

const tags = {
  'sky-progress-indicator': 'sky-tabset',
  'sky-progress-indicator-item': 'sky-tab',
  'sky-progress-indicator-nav-button': 'sky-tabset-nav-button',
} as const;

function progressIndicatorTagSwap(
  filePath: string,
): SwapTagCallback<keyof typeof tags> {
  return (position, oldTag, node, content) => {
    if (position === 'open') {
      if (oldTag === 'sky-progress-indicator') {
        const attributeSwaps = {
          '[startingIndex]': '[active]',
          '(progressChanges)': '(activeChange)',
          '[messageStream]': '(unsupported)',
          isPassive: '',
          '[isPassive]': '',
          displayMode: '',
          '[displayMode]': '',
        };
        const attributeCallback = (
          oldAttr: keyof typeof attributeSwaps,
          newAttr: string,
          _node: ElementWithLocation,
          _content: string,
        ): string => {
          if (oldAttr === '(progressChanges)') {
            const newValue = getAttributeValueText(
              content,
              node,
              oldAttr,
            ).replace('$event', '{ activeIndex: $event }');
            return `${newAttr}${newValue}`;
          } else if (oldAttr === '[messageStream]') {
            throw new Error(
              `The <sky-progress-indicator> element in ${filePath} uses '[messageStream]', which is not supported on the <sky-tabset> component. Please evaluate if '[messageStream]' is still needed.`,
            );
          }
          return `${newAttr}${getAttributeValueText(content, node, oldAttr)}`;
        };
        return `<${tags[oldTag]} tabStyle="wizard"${swapAttributes(node, attributeSwaps, content, attributeCallback)}>`;
      } else if (oldTag === 'sky-progress-indicator-item') {
        return `<${tags[oldTag]}${swapAttributes(node, { title: 'tabHeading', '[title]': '[tabHeading]' }, content)}>`;
      }
    }
    return `</${tags[oldTag]}>`;
  };
}

function progressIndicatorNavButtonTagSwap(
  filePath: string,
): SwapTagCallback<keyof typeof tags> {
  return (position, oldTag, node, content) => {
    if (position === 'open') {
      if (
        node.attrs.some((attr) => attr.name === '(actionClick)'.toLowerCase())
      ) {
        throw new Error(
          `The <sky-progress-indicator-nav-button> element in ${filePath} uses '(actionClick)', which is not supported on the <sky-tabset-nav-button> component. Please evaluate if '(actionClick)' is still needed.`,
        );
      }
      if (
        node.attrs.some(
          (attr) =>
            attr.name === 'buttonType'.toLowerCase() && attr.value === 'reset',
        )
      ) {
        throw new Error(
          `The <sky-progress-indicator-nav-button> element in ${filePath} uses 'buttonType="reset"', which is not supported on the <sky-tabset-nav-button> component. Please evaluate if a reset button is still needed.`,
        );
      }
      const close = node.sourceCodeLocation.endTag?.startOffset ? '>' : ' />';
      return `<${tags[oldTag]}${swapAttributes(node, { progressIndicator: 'tabset', '[progressIndicator]': '[tabset]' }, content)}${close}`;
    }
    return `</${tags[oldTag]}>`;
  };
}

interface FollowupTasks {
  swapModuleImports: boolean;
  keepProgressIndicator: boolean;
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
    isImported(
      source,
      'SkyProgressIndicatorModule',
      '@skyux/progress-indicator',
    ) &&
    !isImported(source, 'SkyTabsModule', '@skyux/tabs')
  ) {
    if (followupTasks.keepProgressIndicator) {
      applyModuleDependencies(source, tree, filePath);
    } else {
      swapModuleDependencies(tree, filePath);
    }
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

function applyModuleDependencies(
  originalSource: ts.SourceFile,
  tree: Tree,
  filePath: string,
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
                'SkyProgressIndicatorModule',
              ),
          )
        ) {
          applyChangesToFile(
            tree,
            filePath,
            addSymbolToClassMetadata(
              parseSourceFile(tree, filePath),
              decorator,
              filePath,
              metadataField,
              'SkyTabsModule',
              '@skyux/tabs',
            ),
          );
        }
      });
    }
  });
}

function swapModuleDependencies(tree: Tree, filePath: string): void {
  const recorder = tree.beginUpdate(filePath);
  swapImportedClass(recorder, filePath, parseSourceFile(tree, filePath), [
    {
      classNames: { SkyProgressIndicatorModule: 'SkyTabsModule' },
      moduleName: {
        old: '@skyux/progress-indicator',
        new: '@skyux/tabs',
      },
    },
  ]);
  tree.commitUpdate(recorder);
}

function isThisAWizard(
  progressIndicator: ElementWithLocation,
  componentSource: ts.SourceFile,
  filePath: string,
  followupTasks: FollowupTasks,
): boolean {
  const displayModeBoundAttribute = progressIndicator.attrs.find(
    (attr) => '[displayMode]'.toLowerCase() === attr.name,
  );
  const displayModeAttribute = progressIndicator.attrs.find(
    (attr) => 'displayMode'.toLowerCase() === attr.name,
  );
  if (displayModeAttribute) {
    return ['horizontal', '1'].includes(displayModeAttribute.value);
  } else if (displayModeBoundAttribute) {
    const displayModeExpression = displayModeBoundAttribute.value.trim();
    if (
      displayModeExpression.match(/^([`"'])horizontal\1$/) ||
      displayModeExpression === '1'
    ) {
      // You're a wizard!
      return true;
    } else if (!displayModeExpression.match(/^\w+$/)) {
      // If the expression is not a simple identifier, we can't determine the value.
      throw new Error(
        `Unable to determine the 'displayMode' attribute on <sky-progress-indicator> in ${filePath}.`,
      );
    } else {
      // Find the value in componentSource
      const displayModeProperty = findNodes(
        componentSource,
        (node): node is ts.PropertyDeclaration =>
          ts.isPropertyDeclaration(node) &&
          ts.isIdentifier(node.name) &&
          node.name.text === displayModeExpression,
      )[0];
      const value = displayModeProperty?.initializer?.getText().trim();
      if (!value) {
        throw new Error(
          `Unable to determine the value for the 'displayMode' attribute on <sky-progress-indicator> in ${filePath}.`,
        );
      }
      if (
        !!value.match(/^([`"'])horizontal\1$/) ||
        ['SkyProgressIndicatorDisplayMode.Horizontal', '1'].includes(value)
      ) {
        // You're a wizard!
        followupTasks.addCommentsToProperties[
          displayModeProperty.name.getText()
        ] =
          `Remove. The ${displayModeProperty.name.getText()} property was previously used to determine if the progress indicator should be displayed as a wizard. It is no longer needed.`;
        return true;
      }
    }
  }
  return false;
}

function convertTemplate(
  recorder: UpdateRecorder,
  filePath: string,
  content: string,
  componentSource: ts.SourceFile,
  offset = 0,
): FollowupTasks {
  const eol = getEOL(content);
  const fragment = parseTemplate(content);
  const progressIndicators = getElementsByTagName(
    'sky-progress-indicator',
    fragment,
  );
  const followupTasks: FollowupTasks = {
    swapModuleImports: false,
    keepProgressIndicator: false,
    addCommentsToProperties: {},
  };
  for (const progressIndicator of progressIndicators) {
    const isWizard = isThisAWizard(
      progressIndicator,
      componentSource,
      filePath,
      followupTasks,
    );
    if (!isWizard) {
      followupTasks.keepProgressIndicator = true;
      continue;
    }
    followupTasks.swapModuleImports = true;
    moveHeading(progressIndicator, recorder, content, offset, eol);
    swapTags(
      content,
      recorder,
      offset,
      ['sky-progress-indicator', 'sky-progress-indicator-item'],
      progressIndicatorTagSwap(filePath),
      progressIndicator,
    );
  }
  const navButtons = getElementsByTagName(
    'sky-progress-indicator-nav-button',
    fragment,
  );
  for (const navButton of navButtons) {
    swapTags(
      content,
      recorder,
      offset,
      ['sky-progress-indicator-nav-button'],
      progressIndicatorNavButtonTagSwap(filePath),
      navButton,
    );
  }
  return followupTasks;
}

function convertHtmlFile(
  tree: Tree,
  filePath: string,
  componentSource: ts.SourceFile,
): FollowupTasks | undefined {
  const content = tree.readText(filePath);
  if (content.includes('<sky-progress-indicator')) {
    const recorder = tree.beginUpdate(filePath);
    const followupTasks = convertTemplate(
      recorder,
      filePath,
      content,
      componentSource,
    );
    tree.commitUpdate(recorder);
    return followupTasks;
  }
  return undefined;
}

function convertTypescriptFile(
  tree: Tree,
  filePath: string,
  componentsThatNeedModules: string[],
  componentsThatKeepProgressIndicator: string[],
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
      followupTasks = convertHtmlFile(tree, htmlFilePath, source);
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
          source,
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
        const componentClassName = findNodes<ts.ClassDeclaration>(
          source,
          ts.isClassDeclaration,
        )[0]?.name?.text as string;
        componentsThatNeedModules.push(componentClassName);
        if (followupTasks?.keepProgressIndicator) {
          componentsThatKeepProgressIndicator.push(componentClassName);
        }
      }
    }
  }
}

function hasSymbolReference(
  source: ts.SourceFile,
  symbolNames: string[],
): boolean {
  return (
    findNodes(
      source,
      (node): node is ts.Identifier =>
        ts.isIdentifier(node) && symbolNames.includes(node.text),
    ).length > 0
  );
}

function isModuleExportingProgressIndicatorModule(
  source: ts.SourceFile,
): boolean {
  if (isImported(source, 'NgModule', '@angular/core')) {
    const decoratorMetadata = getDecoratorMetadata(
      source,
      'NgModule',
      '@angular/core',
    )[0];
    return (
      ts.isObjectLiteralExpression(decoratorMetadata) &&
      isSymbolInClassMetadataFieldArray(
        decoratorMetadata,
        'exports',
        'SkyProgressIndicatorModule',
      )
    );
  }
  return false;
}

/**
 * If this is a test file and references a component that was converted,
 * we need to ensure that the SkyTabsModule is imported in the TestBed configuration.
 */
function updateModuleOrTestFile(
  tree: Tree,
  filePath: string,
  componentsThatNeedModules: string[],
  componentsThatKeepProgressIndicator: string[],
): void {
  const source = parseSourceFile(tree, filePath);
  if (
    (isImported(source, 'TestBed', '@angular/core/testing') &&
      hasSymbolReference(source, componentsThatNeedModules)) ||
    (isImported(source, 'NgModule', '@angular/core') &&
      isImported(
        source,
        'SkyProgressIndicatorModule',
        '@skyux/progress-indicator',
      ))
  ) {
    if (
      (componentsThatKeepProgressIndicator.length > 0 &&
        isModuleExportingProgressIndicatorModule(source)) ||
      hasSymbolReference(source, componentsThatKeepProgressIndicator)
    ) {
      applyModuleDependencies(source, tree, filePath);
    } else {
      swapModuleDependencies(tree, filePath);
    }
  }
}

export function convertProgressIndicatorWizardToTabWizard(
  options: ConvertProgressIndicatorWizardToTabWizardOptions,
): Rule {
  return chain([
    (tree, context): void => {
      // This is used to track if we need to add the SkyTabsModule to the module imports.
      const componentsThatNeedModules: string[] = [];
      const componentsThatKeepProgressIndicator: string[] = [];
      visitProjectFiles(tree, options.projectPath, (filePath) => {
        if (filePath.endsWith('.ts')) {
          convertTypescriptFile(
            tree,
            filePath,
            componentsThatNeedModules,
            componentsThatKeepProgressIndicator,
          );
        }
      });
      if (componentsThatNeedModules.length > 0) {
        visitProjectFiles(tree, options.projectPath, (filePath) => {
          if (filePath.endsWith('.ts')) {
            updateModuleOrTestFile(
              tree,
              filePath,
              componentsThatNeedModules,
              componentsThatKeepProgressIndicator,
            );
          }
        });
      }
    },
    addDependency('@skyux/tabs', `0.0.0-PLACEHOLDER`, {
      existing: ExistingBehavior.Skip,
    }),
  ]);
}
