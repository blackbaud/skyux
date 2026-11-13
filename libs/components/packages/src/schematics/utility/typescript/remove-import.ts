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
          !options.classNames.includes(importSpecifier.name.text),
      );
      if (classMatches.length > 0) {
        if (otherMatches.length > 0) {
          const lastOtherMatch = otherMatches[otherMatches.length - 1];
          classMatches.forEach((importSpecifier) => {
            const index = importSpecifiers.indexOf(importSpecifier);
            // Take the comma after the specifier while a retained specifier
            // follows it, otherwise the comma before it, so the remaining list
            // stays well-formed and the removed ranges never overlap.
            const [start, end] =
              importSpecifier.pos < lastOtherMatch.pos
                ? [
                    importSpecifier.getStart(sourceFile),
                    importSpecifiers[index + 1].getStart(sourceFile),
                  ]
                : [
                    importSpecifiers[index - 1].getEnd(),
                    importSpecifier.getEnd(),
                  ];
            recorder.remove(start, end - start);
          });
        } else {
          const importStart = importDeclaration.getStart(sourceFile);
          const importEnd = importDeclaration.getEnd();
          // Also remove the rest of the line so no blank line is left behind.
          const rest = sourceFile.text.substring(importEnd);
          const trailingLength =
            rest.length - rest.replace(/^[^\S\n]*\n?/, '').length;
          recorder.remove(
            importStart,
            importEnd - importStart + trailingLength,
          );
        }
      }
    }
  }
}
