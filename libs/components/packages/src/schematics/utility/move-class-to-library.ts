import { Tree } from '@angular-devkit/schematics';
import { findNodes, parseSourceFile } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export interface MoveClassToLibraryOptions {
  classNames: string[];
  previousLibrary: string;
  newLibrary: string;
}

export function moveClassToLibrary(
  tree: Tree,
  filePath: string,
  options: MoveClassToLibraryOptions,
): void {
  const sourceFile = parseSourceFile(tree, filePath);
  const content = tree.readText(filePath);
  const recorder = tree.beginUpdate(filePath);

  const replacedImports: {
    className: string;
    moduleImport: ts.ImportDeclaration;
    namedImportSpecifier: ts.ImportSpecifier;
  }[] = [];

  const moduleImports = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).filter(
    (node): node is ts.ImportDeclaration =>
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text === options.previousLibrary,
  );

  moduleImports.forEach((moduleImport) => {
    options.classNames.forEach((className) => {
      const namedImportSpecifier = findNodes(
        moduleImport,
        ts.SyntaxKind.ImportSpecifier,
      ).filter(
        (node): node is ts.ImportSpecifier =>
          ts.isImportSpecifier(node) && node.name.text === className,
      )[0];

      if (namedImportSpecifier) {
        replacedImports.push({ className, moduleImport, namedImportSpecifier });
      }
    });
  });

  replacedImports.forEach(({ moduleImport }, index, list) => {
    if (
      list.findIndex((item) => item.moduleImport === moduleImport) === index
    ) {
      const matchedImports = list.filter(
        (item) => item.moduleImport === moduleImport,
      );
      if (
        moduleImport.importClause?.namedBindings &&
        ts.isNamedImports(moduleImport.importClause.namedBindings) &&
        moduleImport.importClause.namedBindings.elements.length >
          matchedImports.length
      ) {
        // The import contains other named imports that are not being removed.
        matchedImports.forEach(({ namedImportSpecifier }) => {
          const namedImportStart = namedImportSpecifier.getStart();
          const namedImportWidth = namedImportSpecifier.getWidth();

          recorder.remove(namedImportStart, namedImportWidth);

          if (content.charAt(namedImportStart + namedImportWidth) === ',') {
            recorder.remove(namedImportStart + namedImportWidth, 1);
          }
        });
      } else {
        // The import only contains the named imports that are being removed.
        recorder.remove(moduleImport.getStart(), moduleImport.getWidth());
      }
    }
  });

  if (replacedImports.length > 0) {
    recorder.insertLeft(
      replacedImports[0].moduleImport.getStart(),
      `import { ${replacedImports.map(({ className }) => className).join(', ')} } from '${options.newLibrary}';\n`,
    );
  }

  tree.commitUpdate(recorder);
}
