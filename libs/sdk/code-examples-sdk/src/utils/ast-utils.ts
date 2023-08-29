import { Tree } from '@nx/devkit';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export type DecoratedClass = {
  classDeclaration: ts.ClassDeclaration;
  properties: { [key: string]: ts.Expression };
  propertiesObjectLiteral?: ts.ObjectLiteralExpression;
};

// From https://github.com/nrwl/nx/blob/master/packages/angular/src/generators/utils/insert-ngmodule-import.ts
export function findImport(
  sourceFile: ts.SourceFile,
  importPath: string
): ts.ImportDeclaration | undefined {
  const importStatements = sourceFile.statements.filter(ts.isImportDeclaration);
  return importStatements.find(
    (statement) =>
      statement.moduleSpecifier
        .getText(sourceFile)
        .replace(/['"`]/g, '')
        .trim() === importPath.replace(/\.ts$/, '')
  );
}

// From https://github.com/nrwl/nx/blob/master/packages/angular/src/generators/utils/insert-ngmodule-import.ts
export function getNamedImport(
  coreImport: ts.ImportDeclaration,
  importName: string
): ts.ImportSpecifier | undefined {
  if (!coreImport.importClause) {
    throw new Error(`Could not find an import.`);
  }

  if (
    !(
      !!coreImport.importClause.namedBindings &&
      ts.isNamedImports(coreImport.importClause.namedBindings)
    )
  ) {
    throw new Error(
      `The import from ${
        (coreImport.moduleSpecifier as ts.StringLiteral).text
      } does not have named imports.`
    );
  }

  return coreImport.importClause.namedBindings.elements.find((namedImport) =>
    namedImport.propertyName
      ? ts.isIdentifier(namedImport.propertyName) &&
        namedImport.propertyName.escapedText === importName
      : ts.isIdentifier(namedImport.name) &&
        namedImport.name.escapedText === importName
  );
}

// From https://github.com/nrwl/nx/blob/master/packages/angular/src/generators/utils/insert-ngmodule-import.ts
function findDecoratedClass(
  sourceFile: ts.SourceFile,
  ngModuleName: ts.__String
): DecoratedClass | undefined {
  const classDeclarations = sourceFile.statements.filter(ts.isClassDeclaration);
  const classDeclaration = classDeclarations.find((declaration) => {
    const decorators = ts.getDecorators(declaration);
    return decorators
      ? decorators.some(
          (decorator) =>
            ts.isCallExpression(decorator.expression) &&
            ts.isIdentifier(decorator.expression.expression) &&
            decorator.expression.expression.escapedText === ngModuleName
        )
      : undefined;
  });
  if (classDeclaration) {
    const decorators = ts.getDecorators(classDeclaration);

    const decorator = decorators?.find(
      (decorator) =>
        ts.isCallExpression(decorator.expression) &&
        ts.isIdentifier(decorator.expression.expression) &&
        decorator.expression.expression.escapedText === ngModuleName
    );

    const properties: { [key: string]: ts.Expression } = {};

    const callExpression = decorator?.expression as ts.CallExpression;

    let propertiesObjectLiteral: ts.ObjectLiteralExpression | undefined;

    if (callExpression.arguments.length > 0) {
      if (!ts.isObjectLiteralExpression(callExpression.arguments[0])) {
        throw new Error(
          `The ${ngModuleName} options for ${classDeclaration.name?.escapedText} are not an object literal`
        );
      }

      propertiesObjectLiteral = callExpression
        .arguments[0] as ts.ObjectLiteralExpression;
      propertiesObjectLiteral.properties.forEach((property) => {
        if (
          ts.isPropertyAssignment(property) &&
          ts.isIdentifier(property.name)
        ) {
          properties[property.name.text] = property.initializer;
        }
      });
    }
    return { classDeclaration, propertiesObjectLiteral, properties };
  }
  return undefined;
}

export function findNgModuleClass(
  sourceFile: ts.SourceFile
): DecoratedClass | undefined {
  const coreImport = findImport(sourceFile, '@angular/core');
  if (!coreImport) {
    throw new Error('Could not find @angular/core import.');
  }
  const ngModuleClass = getNamedImport(coreImport, 'NgModule');
  if (!ngModuleClass) {
    throw new Error('Could not find NgModule import.');
  }
  return findDecoratedClass(sourceFile, ngModuleClass.name.escapedText);
}

export function findComponentClass(
  sourceFile: ts.SourceFile
): DecoratedClass | undefined {
  const coreImport = findImport(sourceFile, '@angular/core');
  if (!coreImport) {
    return undefined;
  }
  const componentClass = getNamedImport(coreImport, 'Component');
  if (!componentClass) {
    return undefined;
  }
  return findDecoratedClass(sourceFile, componentClass.name.escapedText);
}

/**
 * Read a typescript source file from a @nx/devkit tree.
 */
export function readSourceFile(
  tree: Tree,
  path: string,
  preprocess: (source: string) => string = (source) => source
): ts.SourceFile {
  const sourceText = tree.read(path, 'utf-8') ?? '';
  return ts.createSourceFile(
    path,
    preprocess(sourceText),
    ts.ScriptTarget.Latest,
    true
  );
}
