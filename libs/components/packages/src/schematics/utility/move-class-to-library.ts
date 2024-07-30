import { Tree } from '@angular-devkit/schematics';
import { findNodes } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export interface MoveClassToLibraryOptions {
  classNames: string[];
  previousLibrary: string;
  newLibrary: string;
}

export function moveClassToLibrary(
  tree: Tree,
  projectPath: string,
  sourceFile: ts.SourceFile,
  content: string,
  options: MoveClassToLibraryOptions,
): void {
  const recorder = tree.beginUpdate(projectPath);

  const indicatorsImports = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).filter(
    (node): node is ts.ImportDeclaration =>
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier.getText() === `'${options.previousLibrary}'`,
  )[0];

  if (indicatorsImports) {
    const replacedImports: { [key: string]: ts.ImportSpecifier } = {};

    const indicatorsImportStart = indicatorsImports.getStart(sourceFile);
    const indicatorsImportWidth = indicatorsImports.getWidth(sourceFile);

    options.classNames.forEach((importName) => {
      const namedImportSpecifier = findNodes(
        sourceFile,
        ts.SyntaxKind.ImportSpecifier,
      ).filter(
        (node): node is ts.ImportSpecifier =>
          ts.isImportSpecifier(node) && node.name.text === importName,
      )[0];

      if (namedImportSpecifier) {
        replacedImports[importName] = namedImportSpecifier;
      }
    });

    if (Object.keys(replacedImports).length > 0) {
      if (
        indicatorsImports.importClause?.namedBindings &&
        ts.isNamedImports(indicatorsImports.importClause.namedBindings) &&
        indicatorsImports.importClause.namedBindings.elements.length >
          Object.keys(replacedImports).length
      ) {
        Object.keys(replacedImports).forEach((importName) => {
          const namedImportStart =
            replacedImports[importName].getStart(sourceFile);
          const namedImportWidth =
            replacedImports[importName].getWidth(sourceFile);

          recorder.remove(namedImportStart, namedImportWidth);

          if (content.charAt(namedImportStart + namedImportWidth) === ',') {
            recorder.remove(namedImportStart + namedImportWidth, 1);
          }
        });
      } else {
        recorder.remove(indicatorsImportStart, indicatorsImportWidth);
      }

      recorder.insertLeft(
        indicatorsImportStart,
        `import { ${Object.keys(replacedImports).join(', ')} } from '${options.newLibrary}';\n`,
      );
    }

    tree.commitUpdate(recorder);
  }
}
