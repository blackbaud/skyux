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

  const classNameSwaps: [string, string][] = applicableOptions
    .map((option) => Object.entries(option.classNames))
    .flat();
  const recorder = tree.beginUpdate(projectPath);
  classNameSwaps.forEach(([oldClassName, newClassName]) => {
    const references = findReferences(sourceFile, oldClassName);
    references.forEach((reference) => {
      recorder.remove(reference.getStart(), reference.getWidth());
      recorder.insertRight(reference.getStart(), newClassName);
    });
  });
  tree.commitUpdate(recorder);
}
