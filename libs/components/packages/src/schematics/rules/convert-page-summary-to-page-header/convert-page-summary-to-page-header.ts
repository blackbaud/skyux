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
 * The page header component uses a `pageTitle` attribute for its title.
 * Extracts the title from the `<sky-page-summary-title>` element and returns it
 * as a string.
 * If the title is anything more than a simple text node, an error is thrown.
 */
function getPageTitle(pageSummary: ElementWithLocation): string {
  const heading = getElementsByTagName(
    'sky-page-summary-title',
    pageSummary,
  )[0];
  if (
    isParentNode(heading) &&
    heading.childNodes.length === 1 &&
    heading.childNodes[0].nodeName === '#text'
  ) {
    return (
      heading.childNodes[0] as parse5.DefaultTreeAdapterTypes.TextNode
    ).value.trim();
  } else if (!heading) {
    return '';
  } else {
    // If the heading contains something other than a single text node,
    // throw an error to indicate that the title cannot be converted.
    throw new Error(
      `The '<sky-page-summary-title>' element contains additional markup that is not supported as a 'pageTitle' for the <sky-page-header> component.`,
    );
  }
}

/**
 * Moves detail elements (subtitle, status, content, key info) from the
 * <sky-page-summary> element to a <sky-page-header-details> element.
 */
function moveDetails(
  pageSummary: ElementWithLocation,
  recorder: UpdateRecorder,
  content: string,
  offset: number,
): void {
  const detailsContents = [
    'sky-page-summary-subtitle',
    'sky-page-summary-status',
    'sky-page-summary-content',
    'sky-page-summary-key-info',
  ]
    .flatMap((tag) => {
      const elements = getElementsByTagName(tag, pageSummary);
      return elements.map((element) =>
        content
          .substring(
            element.sourceCodeLocation.startTag.endOffset,
            element.sourceCodeLocation.endTag.startOffset,
          )
          .trim(),
      );
    })
    .filter(Boolean);
  const indent = ' '.repeat(pageSummary.sourceCodeLocation.endTag.startCol);
  const eol = getEOL(content);
  if (detailsContents.length === 1) {
    recorder.insertLeft(
      pageSummary.sourceCodeLocation.endTag.startOffset + offset,
      [
        `  <sky-page-header-details>`,
        `${indent}  ${detailsContents[0].trim()}`,
        `${indent}  </sky-page-header-details>`,
        `${indent}`,
      ].join(eol),
    );
  } else if (detailsContents.length > 1) {
    recorder.insertLeft(
      pageSummary.sourceCodeLocation.endTag.startOffset + offset,
      [
        `  <sky-page-header-details>`,
        detailsContents
          .map((detailsContent) =>
            [
              `${indent}  <div class="sky-margin-stacked-md">`,
              `${indent}    ${detailsContent.trim()}`,
              `${indent}  </div>`,
            ].join(eol),
          )
          .join(eol),
        `${indent}  </sky-page-header-details>`,
        `${indent}`,
      ].join(eol),
    );
  }
}

/**
 * Removes title and detail elements from the page summary, including
 * <sky-page-summary-title>, <sky-page-summary-subtitle>, <sky-page-summary-status>,
 * <sky-page-summary-content>, and <sky-page-summary-key-info>.
 */
function removeTitleAndDetailElements(
  pageSummary: ElementWithLocation,
  recorder: UpdateRecorder,
  content: string,
  offset: number,
): void {
  const tagsToRemove = [
    'sky-page-summary-title',
    'sky-page-summary-subtitle',
    'sky-page-summary-status',
    'sky-page-summary-content',
    'sky-page-summary-key-info',
  ];
  const eol = getEOL(content);
  for (const tag of tagsToRemove) {
    const elements = getElementsByTagName(tag, pageSummary);
    elements.forEach((element) => {
      const trailingLineBreak =
        content.indexOf(eol, offset + element.sourceCodeLocation.endOffset) ===
        offset + element.sourceCodeLocation.endOffset;
      recorder.remove(
        offset + element.sourceCodeLocation.startOffset,
        element.sourceCodeLocation.endOffset -
          element.sourceCodeLocation.startOffset +
          (trailingLineBreak ? eol.length : 0),
      );
    });
  }
}

const tags = {
  'sky-page-summary': 'sky-page-header',
  'sky-page-summary-alert': 'sky-page-header-alerts',
  'sky-page-summary-image': 'sky-page-header-avatar',
} as const;

function pageSummaryTagSwap(): SwapTagCallback<keyof typeof tags> {
  return (position, oldTag, node, content) => {
    if (position === 'open') {
      if (oldTag === Object.keys(tags)[0]) {
        return `<${tags[oldTag]} pageTitle="${getPageTitle(node)}">`;
      }
      return `<${tags[oldTag]}>`;
    }
    return `</${tags[oldTag]}>`;
  };
}

function convertTemplate(
  recorder: UpdateRecorder,
  content: string,
  offset = 0,
): void {
  const fragment = parseTemplate(content);
  const pageSummaries = getElementsByTagName('sky-page-summary', fragment);
  for (const pageSummary of pageSummaries) {
    removeTitleAndDetailElements(pageSummary, recorder, content, offset);
    moveDetails(pageSummary, recorder, content, offset);
    swapTags(
      content,
      recorder,
      offset,
      Object.keys(tags) as (keyof typeof tags)[],
      pageSummaryTagSwap(),
      pageSummary,
    );
  }
}

function convertHtmlFile(tree: Tree, filePath: string): void {
  const content = tree.readText(filePath);
  if (content.includes('<sky-page-summary')) {
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
  if (isImported(source, 'SkyPageSummaryModule', '@skyux/layout')) {
    swapImportedClass(recorder, filePath, source, [
      {
        classNames: {
          SkyPageSummaryModule: 'SkyPageModule',
        },
        moduleName: {
          old: '@skyux/layout',
          new: '@skyux/pages',
        },
      },
    ]);
  }
  tree.commitUpdate(recorder);
}

export function convertPageSummaryToPageHeader(projectPath: string): Rule {
  return (tree) => {
    visitProjectFiles(tree, projectPath, (filePath) => {
      try {
        if (filePath.endsWith('.html')) {
          convertHtmlFile(tree, filePath);
        } else if (filePath.endsWith('.ts')) {
          convertTypescriptFile(tree, filePath);
        }
      } catch (error) {
        /* istanbul ignore next */
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(`Error converting '${filePath}': ${msg}`);
      }
    });
  };
}
