import { Rule, Tree } from '@angular-devkit/schematics';
import { parseSourceFile } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';

import { visitProjectFiles } from '../../../utility/visit-project-files';

const knownDeepImportUpdates: Record<string, string> = {
  '@skyux/ag-grid/lib/modules/ag-grid/types/cell-editor-lookup-params':
    '@skyux/ag-grid',
  '@skyux/core/lib/modules/breakpoint-observer/breakpoint': '@skyux/core',
  '@skyux/lookup/testing/modules/lookup/lookup-show-more-picker-harness':
    '@skyux/lookup/testing',
  '@skyux/modals/lib/modules/modal/modal.interface': '@skyux/modals',
  '@skyux/pages/lib/modules/action-hub/types/action-hub-needs-attention-input':
    '@skyux/pages',
};

export default function fixImports(): Rule {
  return (tree: Tree) => {
    visitProjectFiles(tree, '', (filePath) => {
      if (filePath.endsWith('.ts')) {
        const fileContent = tree.readText(filePath);
        if (
          Object.keys(knownDeepImportUpdates).some((u) =>
            fileContent.includes(u),
          )
        ) {
          const sourceFile = parseSourceFile(tree, filePath);
          const importSpecifiers = findNodes(
            sourceFile,
            (node): node is ts.StringLiteral =>
              ts.isStringLiteral(node) &&
              ts.isImportDeclaration(node.parent) &&
              node.text in knownDeepImportUpdates,
          );
          const recorder = tree.beginUpdate(filePath);
          importSpecifiers.forEach((importSpecifier) => {
            const shallowImportPath =
              knownDeepImportUpdates[importSpecifier.text];
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
