import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import { getEOL } from '@schematics/angular/utility/eol';

import { serialize } from 'parse5';

import { logOnce } from '../../utility/log-once';
import {
  ElementWithLocation,
  SwapTagCallback,
  getElementsByTagName,
  isParentNode,
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

/**
 * Description list does not use a heading element.
 * Create a new `<h3>` element with the heading text.
 */
function moveHeading(
  definitionList: ElementWithLocation,
  recorder: UpdateRecorder,
  content: string,
  offset: number,
  eol: string,
): void {
  const heading = getElementsByTagName(
    'sky-definition-list-heading',
    definitionList,
  )[0];
  if (isParentNode(heading)) {
    const headingText = serialize(heading);
    const indent = ' '.repeat(
      definitionList.sourceCodeLocation.startTag.startCol - 1,
    );
    recorder.insertLeft(
      offset + definitionList.sourceCodeLocation.startTag.startOffset,
      `<h3 class="sky-margin-stacked-sm">${headingText}</h3>${eol}${indent}`,
    );
    recorder.remove(
      offset + heading.sourceCodeLocation.startOffset,
      heading.sourceCodeLocation.endOffset -
        heading.sourceCodeLocation.startOffset,
    );
  }
}

const regexpEscape = (str: string): string =>
  str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

const tags = {
  'sky-definition-list': 'sky-description-list',
  'sky-definition-list-content': 'sky-description-list-content',
  'sky-definition-list-label': 'sky-description-list-term',
  'sky-definition-list-value': 'sky-description-list-description',
} as const;
function definitionListTagSwap(
  context: SchematicContext,
): SwapTagCallback<keyof typeof tags> {
  return (position, oldTag, node, content) => {
    if (position === 'open') {
      const attributesString = content.substring(
        node.sourceCodeLocation.startOffset + oldTag.length + 1,
        node.sourceCodeLocation.startTag.endOffset,
      );
      if (oldTag === 'sky-definition-list') {
        let value = `<${tags[oldTag]} mode="horizontal"`;
        // Copy over any other attributes that are not in the new tag.
        for (const attr of node.attrs) {
          // eslint-disable-next-line @cspell/spellchecker
          if (['labelwidth', '[labelwidth]'].includes(attr.name)) {
            context.logger.warn(
              `The "labelWidth" attribute is not supported on the <${tags[oldTag]}> component. Please review the code to ensure it still works as expected.`,
            );
          } else if (attr.name === 'defaultValue'.toLowerCase()) {
            value += ` defaultDescription="${attr.value}"`;
          } else if (attr.name === '[defaultValue]'.toLowerCase()) {
            value += ` [defaultDescription]="${attr.value}"`;
          } else if (
            !['defaultvalue', '[defaultvalue]', 'mode'].includes(attr.name)
          ) {
            const attributeText = new RegExp(
              `(?<=\\s)${regexpEscape(attr.name)}(="[^"]*")?`,
              'di',
            )
              .exec(attributesString)
              ?.shift();
            if (attributeText) {
              value += ` ${attributeText}`;
            }
          }
        }
        value += '>';
        return value;
      }
      return `<${tags[oldTag]}${attributesString}`;
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
  const eol = getEOL(content);
  const fragment = parseTemplate(content);
  const definitionLists = getElementsByTagName('sky-definition-list', fragment);
  for (const definitionList of definitionLists) {
    moveHeading(definitionList, recorder, content, offset, eol);
    swapTags(
      content,
      recorder,
      offset,
      Object.keys(tags) as (keyof typeof tags)[],
      definitionListTagSwap(context),
      definitionList,
    );
  }
  if (definitionLists.length > 0) {
    logOnce(
      context,
      'info',
      `Converted ${definitionLists.length} <sky-definition-list> component(s) to <sky-description-list> component(s). Next steps: https://developer.blackbaud.com/skyux/learn/develop/deprecation/definition-list`,
    );
  }
}

function convertHtmlFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
): void {
  const content = tree.readText(filePath);
  if (content.includes('<sky-definition-list')) {
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
  if (
    isImportedFromPackage(source, 'SkyDefinitionListModule', '@skyux/layout')
  ) {
    swapImportedClass(recorder, filePath, source, [
      {
        classNames: {
          SkyDefinitionListModule: 'SkyDescriptionListModule',
        },
        moduleName: '@skyux/layout',
      },
    ]);
  }
  tree.commitUpdate(recorder);
}

export function convertDefinitionListToDescriptionList(
  projectPath: string,
): Rule {
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
