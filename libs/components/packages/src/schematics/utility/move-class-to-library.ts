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

  const moduleImports = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).filter(
    (node): node is ts.ImportDeclaration =>
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text === options.previousLibrary,
  );

  if (moduleImports.length === 0) {
    return;
  }

  const replacedImports: { [key: string]: ts.ImportSpecifier } = {};

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

  moduleImports.forEach((moduleImport) => {
    const moduleImportStart = moduleImport.getStart(sourceFile);
    const moduleImportWidth = moduleImport.getWidth(sourceFile);
    const moduleReplacements = Object.keys(replacedImports).filter(
      (importName) => {
        const namedImportStart =
          replacedImports[importName].getStart(sourceFile);
        return (
          namedImportStart >= moduleImportStart &&
          namedImportStart <= moduleImportStart + moduleImportWidth
        );
      },
    );

    if (moduleReplacements.length > 0) {
      if (
        moduleImport.importClause?.namedBindings &&
        ts.isNamedImports(moduleImport.importClause.namedBindings) &&
        moduleImport.importClause.namedBindings.elements.length >
          moduleReplacements.length
      ) {
        moduleReplacements.forEach((importName) => {
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
        recorder.remove(moduleImportStart, moduleImportWidth);
      }
    }
  });

  if (Object.keys(replacedImports).length > 0) {
    recorder.insertLeft(
      moduleImports[0].getStart(sourceFile),
      `import { ${Object.keys(replacedImports).join(', ')} } from '${options.newLibrary}';\n`,
    );
  }
  tree.commitUpdate(recorder);
}
