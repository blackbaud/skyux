import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { DefaultTreeAdapterTypes } from 'parse5';

import {
  ElementWithLocation,
  getElementsByTagName,
  isElement,
  parseTemplate,
} from '../../utility/template';
import {
  getInlineTemplates,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

/*
 * region: Migrates sky-grid-column components used in sky-list-view-grid
 * to add the "legacy" CSS class to each column.
 */

function convertColumn(
  recorder: UpdateRecorder,
  offset: number,
  content: string,
  child: ElementWithLocation,
): void {
  const classAttributes = child.attrs.find((attr) => attr.name === 'class');
  let endOfClass = child.sourceCodeLocation?.attrs?.['class']?.endOffset;
  if (endOfClass) {
    endOfClass--;
    if (!classAttributes?.value.match(/\blegacy\b/) && endOfClass) {
      recorder.insertLeft(offset + endOfClass, ' legacy');
    }
  } else {
    let endOfTag = child.sourceCodeLocation.startTag.endOffset - 1;
    if (content.charAt(endOfTag - 1) === '/') {
      endOfTag--;
    }
    recorder.insertLeft(offset + endOfTag, ' class="legacy"');
  }
  // parse5 does not handle self-closing tags, so we need to check for "nested" columns.
  child.childNodes
    .filter(filterGridColumns)
    .forEach((child) => convertColumn(recorder, offset, content, child));
}

const filterGridColumns = (
  node: DefaultTreeAdapterTypes.ChildNode | DefaultTreeAdapterTypes.Element,
): node is ElementWithLocation =>
  isElement(node) &&
  node.nodeName === 'sky-grid-column' &&
  !!node.sourceCodeLocation?.startTag?.endOffset;

function convertTemplate(
  recorder: UpdateRecorder,
  content: string,
  offset = 0,
): void {
  const fragment = parseTemplate(content);
  const listViewGrids = getElementsByTagName('sky-list-view-grid', fragment);
  for (const listViewGrid of listViewGrids) {
    listViewGrid.childNodes
      .filter(filterGridColumns)
      .forEach((child) => convertColumn(recorder, offset, content, child));
  }
}

function convertHtmlFile(tree: Tree, filePath: string): void {
  const content = tree.readText(filePath);
  if (content.includes('<sky-list-view-grid')) {
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
  updateImportStatements(recorder, filePath, source);
  tree.commitUpdate(recorder);
}

/*
 * endregion
 */

/**
 * Migrate imports from `@skyux/grids` to `@skyux/list-builder-view-grids` and
 * use `Legacy` class names.
 */
function updateImportStatements(
  recorder: UpdateRecorder,
  filePath: string,
  source: ts.SourceFile,
): void {
  swapImportedClass(recorder, filePath, source, [
    {
      classNames: {
        SkyGridColumnAlignment: 'SkyGridLegacyColumnAlignment',
        SkyGridColumnModel: 'SkyGridLegacyColumnModel',
        SkyGridColumnWidthModelChange: 'SkyGridLegacyColumnWidthModelChange',
        SkyGridMessage: 'SkyGridLegacyMessage',
        SkyGridMessageType: 'SkyGridLegacyMessageType',
        SkyGridSelectedRowsModelChange: 'SkyGridLegacySelectedRowsModelChange',
        SkyGridUIConfig: 'SkyGridLegacyUIConfig',
      },
      moduleName: {
        old: '@skyux/grids',
        new: '@skyux/list-builder-view-grids',
      },
    },
  ]);
}

export function listBuilderViewGridColumnMigration(projectPath: string): Rule {
  return (tree, context) => {
    visitProjectFiles(tree, projectPath, (filePath) => {
      if (filePath.endsWith('.html')) {
        convertHtmlFile(tree, filePath);
      } else if (filePath.endsWith('.ts')) {
        convertTypescriptFile(tree, filePath);
      }
    });
    context.addTask(
      new RunSchematicTask('@angular/core', 'cleanup-unused-imports', {}),
    );
  };
}
