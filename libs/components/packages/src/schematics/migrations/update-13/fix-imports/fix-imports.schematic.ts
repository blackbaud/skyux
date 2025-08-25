import { Rule, Tree } from '@angular-devkit/schematics';
import { parseSourceFile } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';

import { visitProjectFiles } from '../../../utility/visit-project-files';

const knownDeepImportUpdates = [
  '@skyux/ag-grid/lib/modules/ag-grid/types/cell-editor-lookup-params',
  '@skyux/core/lib/modules/breakpoint-observer/breakpoint',
  '@skyux/lookup/testing/modules/lookup/lookup-show-more-picker-harness',
  '@skyux/modals/lib/modules/modal/modal.interface',
  '@skyux/pages/lib/modules/action-hub/types/action-hub-needs-attention-input',
];

export default function fixImports(): Rule {
  return (tree: Tree) => {
    visitProjectFiles(tree, '', (filePath) => {
      if (filePath.endsWith('.ts')) {
        const fileContent = tree.readText(filePath);
        if (knownDeepImportUpdates.some((u) => fileContent.includes(u))) {
          const sourceFile = parseSourceFile(tree, filePath);
          const importSpecifiers = findNodes(
            sourceFile,
            (node): node is ts.StringLiteral =>
              ts.isStringLiteral(node) &&
              ts.isImportDeclaration(node.parent) &&
              knownDeepImportUpdates.includes(node.text),
          );
          const recorder = tree.beginUpdate(filePath);
          importSpecifiers.forEach((importSpecifier) => {
            let end = importSpecifier.text.indexOf(
              '/',
              importSpecifier.text.indexOf('/') + 1,
            );
            if (importSpecifier.text.substring(end).startsWith('/testing/')) {
              end += '/testing'.length;
            }
            const shallowImportPath = importSpecifier.text.substring(0, end);
            recorder.remove(
              importSpecifier.getStart(sourceFile) + 1,
              importSpecifier.text.length,
            );
            recorder.insertLeft(
              importSpecifier.getStart(sourceFile) + 1,
              shallowImportPath,
            );
          });
          tree.commitUpdate(recorder);
        }
      }
    });
  };
}
