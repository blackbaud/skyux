import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { parseSourceFile } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';

import { visitProjectFiles } from '../../../utility/visit-project-files.js';

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

function updateDeepImports(
  sourceFile: ts.SourceFile,
  recorder: UpdateRecorder,
): void {
  const importSpecifiers = findNodes(
    sourceFile,
    (node): node is ts.StringLiteral =>
      ts.isStringLiteral(node) &&
      ts.isImportDeclaration(node.parent) &&
      node.text in knownDeepImportUpdates,
  );
  importSpecifiers.forEach((importSpecifier) => {
    const shallowImportPath = knownDeepImportUpdates[importSpecifier.text];
    recorder.remove(
      importSpecifier.getStart(sourceFile) + 1,
      importSpecifier.text.length,
    );
    recorder.insertLeft(
      importSpecifier.getStart(sourceFile) + 1,
      shallowImportPath,
    );
  });
}

function updateLayoutPageModuleImport(
  filePath: string,
  sourceFile: ts.SourceFile,
  recorder: UpdateRecorder,
): void {
  const layoutPageModuleImport = findNodes(
    sourceFile,
    (node): node is ts.ImportDeclaration =>
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text === '@skyux/layout' &&
      !!node.importClause?.namedBindings &&
      ts.isNamedImports(node.importClause.namedBindings) &&
      node.importClause.namedBindings.elements.some(
        (element) => element.name.text === 'SkyPageModule',
      ),
  ).shift();
  if (layoutPageModuleImport) {
    const namedImports = layoutPageModuleImport.importClause
      ?.namedBindings as ts.NamedImports;
    if (namedImports.elements.length === 1) {
      // Only `SkyPageModule` is imported, so switch to '@skyux/pages'.
      recorder.remove(
        layoutPageModuleImport.moduleSpecifier.end - 'layout"'.length,
        'layout'.length,
      );
      recorder.insertLeft(
        layoutPageModuleImport.moduleSpecifier.end - 'layout"'.length,
        'pages',
      );
    } else {
      // Remove only `SkyPageModule` from the named imports.
      const pageModuleImportSpecifier = namedImports.elements.find(
        (element) => element.name.text === 'SkyPageModule',
      ) as ts.ImportSpecifier;

      let removeStart = pageModuleImportSpecifier.getStart(sourceFile);
      let removeEnd = pageModuleImportSpecifier.getEnd();
      const index = namedImports.elements.findIndex(
        (element) => element.name.text === 'SkyPageModule',
      );
      if (index > 0) {
        // Include the preceding comma and collapse any whitespace.
        removeStart = namedImports.elements[index - 1].getEnd();
      } else {
        // Include the following comma and collapse any whitespace.
        removeEnd = namedImports.elements[1].getStart(sourceFile);
      }
      recorder.remove(removeStart, removeEnd - removeStart);
      applyToUpdateRecorder(recorder, [
        insertImport(sourceFile, filePath, 'SkyPageModule', '@skyux/pages'),
      ]);
    }
  }
}

export default function fixImports(): Rule {
  return (tree: Tree) => {
    visitProjectFiles(tree, '', (filePath) => {
      if (filePath.endsWith('.ts')) {
        const fileContent = tree.readText(filePath);
        if (
          (fileContent.includes('SkyPageModule') &&
            fileContent.includes('@skyux/layout')) ||
          Object.keys(knownDeepImportUpdates).some((u) =>
            fileContent.includes(u),
          )
        ) {
          const sourceFile = parseSourceFile(tree, filePath);
          const recorder = tree.beginUpdate(filePath);
          updateDeepImports(sourceFile, recorder);
          updateLayoutPageModuleImport(filePath, sourceFile, recorder);
          tree.commitUpdate(recorder);
        }
      }
    });
  };
}
