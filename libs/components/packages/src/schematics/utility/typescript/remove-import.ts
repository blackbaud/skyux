import { UpdateRecorder } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';

export interface RemoveImportOptions {
  classNames: string[];
  moduleName: string;
}

export function removeImport(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  options: RemoveImportOptions,
): void {
  const importDeclarations = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).filter(
    (node): node is ts.ImportDeclaration =>
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text === options.moduleName,
  );

  if (importDeclarations) {
    for (const importDeclaration of importDeclarations) {
      const importSpecifiers = findNodes<ts.ImportSpecifier>(
        importDeclaration,
        (node) => ts.isImportSpecifier(node),
      );
      const classMatches = importSpecifiers.filter((importSpecifier) =>
        options.classNames.includes(importSpecifier.name.text),
      );
      const otherMatches = importSpecifiers.filter(
        (importSpecifier) =>
          !options.classNames.includes(importSpecifier.getText()),
      );
      if (classMatches.length > 0) {
        if (otherMatches.length > 0) {
          classMatches.forEach((importSpecifier) => {
            const importStart = importSpecifier.getStart(sourceFile);
            const importWidth = importSpecifier.getWidth(sourceFile);
            recorder.remove(importStart, importWidth + 1);
          });
        } else {
          const importStart = importDeclaration.getStart(sourceFile);
          const importWidth = importDeclaration.getWidth(sourceFile);
          recorder.remove(importStart, importWidth);
        }
      }
    }
  }
}
