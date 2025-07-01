import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { isImported, parse5, parseSourceFile } from '@angular/cdk/schematics';
import { getEOL } from '@schematics/angular/utility/eol';

import {
  ElementWithLocation,
  SwapTagCallback,
  getElementsByTagName,
  isParentNode,
  parseTemplate,
  swapTags,
} from '../../utility/template';
import { getInlineTemplates } from '../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

/**
 * Description list does not use a heading element.
 * Create a new `<h3>` element with the heading text.
 */
function moveHeading(
  definitionList: ElementWithLocation,
  recorder: UpdateRecorder,
  offset: number,
  eol: string,
): void {
  const heading = getElementsByTagName(
    'sky-definition-list-heading',
    definitionList,
  )[0];
  if (isParentNode(heading)) {
    const headingText = parse5.serialize(heading);
    const indent = ' '.repeat(
      definitionList.sourceCodeLocation.startTag.startCol - 1,
    );
    recorder.insertLeft(
      offset + definitionList.sourceCodeLocation.startTag.startOffset,
      `<h3>${headingText}</h3>${eol}${indent}`,
    );
    recorder.remove(
      offset + heading.sourceCodeLocation.startOffset,
      heading.sourceCodeLocation.endOffset -
        heading.sourceCodeLocation.startOffset,
    );
  }
}

const tags = {
  'sky-definition-list': 'sky-description-list',
  'sky-definition-list-content': 'sky-description-list-content',
  'sky-definition-list-label': 'sky-description-list-term',
  'sky-definition-list-value': 'sky-description-list-description',
} as const;
const definitionListTagSwap: SwapTagCallback<keyof typeof tags> = (
  position,
  oldTag,
  node,
) => {
  if (position === 'open') {
    if (oldTag === 'sky-definition-list') {
      const defaultValueAttr = node.attrs.find(
        // eslint-disable-next-line @cspell/spellchecker
        (attr) => attr.name === 'defaultvalue',
      )?.value;
      const defaultValueBound = node.attrs.find(
        // eslint-disable-next-line @cspell/spellchecker
        (attr) => attr.name === '[defaultvalue]',
      )?.value;
      let value = `<${tags[oldTag]} mode="longDescription"`;
      if (defaultValueAttr) {
        value += ` defaultDescription="${defaultValueAttr}"`;
      } else if (defaultValueBound) {
        value += ` [defaultDescription]="${defaultValueBound}"`;
      }
      value += '>';
      return value;
    }
    return `<${tags[oldTag]}>`;
  }
  return `</${tags[oldTag]}>`;
};

function convertTemplate(
  recorder: UpdateRecorder,
  content: string,
  offset = 0,
): void {
  const eol = getEOL(content);
  const fragment = parseTemplate(content);
  const definitionLists = getElementsByTagName('sky-definition-list', fragment);
  for (const definitionList of definitionLists) {
    moveHeading(definitionList, recorder, offset, eol);
    swapTags(
      recorder,
      offset,
      Object.keys(tags) as (keyof typeof tags)[],
      definitionListTagSwap,
      definitionList,
    );
  }
}

function convertHtmlFile(tree: Tree, filePath: string): void {
  const content = tree.readText(filePath);
  if (content.includes('<sky-definition-list')) {
    const recorder = tree.beginUpdate(filePath);
    convertTemplate(recorder, content);
    tree.commitUpdate(recorder);
  }
}

function convertTypescriptFile(tree: Tree, filePath: string): void {
  const source = parseSourceFile(tree, filePath);
  const templates = getInlineTemplates(source);
  const recorder = tree.beginUpdate(filePath);
  if (templates.length > 0) {
    const content = tree.readText(filePath);
    for (const template of templates) {
      convertTemplate(
        recorder,
        content.slice(template.start, template.end),
        template.start,
      );
    }
  }
  if (isImported(source, 'SkyDefinitionListModule', '@skyux/layout')) {
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
  return (tree) => {
    visitProjectFiles(tree, projectPath, (filePath) => {
      if (filePath.endsWith('.html')) {
        convertHtmlFile(tree, filePath);
      } else if (filePath.endsWith('.ts')) {
        convertTypescriptFile(tree, filePath);
      }
    });
  };
}
