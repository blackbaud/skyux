import { Tree } from '@angular-devkit/schematics';
import { isImported } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';

export interface SwapImportedClassOptions {
  classNames: Record<string, string>;
  moduleName: string;
}

function findReferences(
  sourceFile: ts.SourceFile,
  className: string,
): ts.Identifier[] {
  return findNodes(sourceFile, ts.SyntaxKind.Identifier).filter(
    (node): node is ts.Identifier =>
      ts.isIdentifier(node) && node.text === className,
  );
}

export function swapImportedClass(
  tree: Tree,
  projectPath: string,
  sourceFile: ts.SourceFile,
  options: SwapImportedClassOptions[],
): void {
  const applicableOptions = options.filter((option) =>
    Object.keys(option.classNames).some((className) =>
      isImported(sourceFile, className, option.moduleName),
    ),
  );
  if (applicableOptions.length === 0) {
    return;
  }

  const applicableImportRanges = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  )
    .filter(
      (node): node is ts.ImportDeclaration =>
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        applicableOptions.some(
          (option) =>
            (node.moduleSpecifier as ts.StringLiteral).text ===
            option.moduleName,
        ),
    )
    .map((node) => ({
      start: node.getStart(sourceFile),
      width: node.getWidth(sourceFile),
    }));

  const classNameSwaps: [string, string][] = applicableOptions
    .map((option) => Object.entries(option.classNames))
    .flat();
  const recorder = tree.beginUpdate(projectPath);
  classNameSwaps.forEach(([oldClassName, newClassName]) => {
    const references = findReferences(sourceFile, oldClassName);
    const alreadyImported = isImported(
      sourceFile,
      newClassName,
      applicableOptions[0].moduleName,
    );
    references.forEach((reference) => {
      const start = reference.getStart();
      const width = reference.getWidth();
      recorder.remove(start, width);
      if (
        alreadyImported &&
        applicableImportRanges.find(
          (range) => range.start < start && range.start + range.width > start,
        )
      ) {
        recorder.remove(start + width, 1);
      } else {
        recorder.insertRight(start, newClassName);
      }
    });
  });
  tree.commitUpdate(recorder);
}
