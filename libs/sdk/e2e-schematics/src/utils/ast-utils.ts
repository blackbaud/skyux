import { getSourceNodes } from '@angular/cdk/schematics';
import { Tree } from '@nrwl/devkit';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export type DecoratedClass = {
  classDeclaration: ts.ClassDeclaration;
  propertiesObjectLiteral: ts.ObjectLiteralExpression;
  properties: { [key: string]: ts.Expression };
};

/**
 * Apply a set of transformations to typescript source files.
 */
export function applyTransformers(
  sourceFiles: ts.SourceFile[],
  transformers: ts.TransformerFactory<ts.SourceFile>[]
): ts.SourceFile[] {
  const transformation = ts.transform(sourceFiles, transformers);
  return transformation.transformed;
}

/**
 * Apply a set of transformations to a typescript source file in a @nrwl/devkit tree.
 */
export function applyTransformersToPath(
  tree: Tree,
  sourceFile: string,
  transformers: ts.TransformerFactory<ts.SourceFile>[]
): void {
  const sourceFiles = readSourceFile(tree, sourceFile);
  const [result] = applyTransformers([sourceFiles], transformers);
  writeSourceFile(tree, sourceFile, result);
}

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
  if (!ts.isNamedImports(coreImport.importClause.namedBindings)) {
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
  const classDeclaration = classDeclarations.find(
    (declaration) =>
      declaration.decorators &&
      declaration.decorators.some(
        (decorator) =>
          ts.isCallExpression(decorator.expression) &&
          ts.isIdentifier(decorator.expression.expression) &&
          decorator.expression.expression.escapedText === ngModuleName
      )
  );
  if (classDeclaration) {
    const decorator = classDeclaration.decorators.find(
      (decorator) =>
        ts.isCallExpression(decorator.expression) &&
        ts.isIdentifier(decorator.expression.expression) &&
        decorator.expression.expression.escapedText === ngModuleName
    );
    const properties: { [key: string]: ts.Expression } = {};
    const callExpression = decorator.expression as ts.CallExpression;
    let propertiesObjectLiteral: ts.ObjectLiteralExpression;

    if (callExpression.arguments.length > 0) {
      if (!ts.isObjectLiteralExpression(callExpression.arguments[0])) {
        throw new Error(
          `The ${ngModuleName} options for ${classDeclaration.name.escapedText} are not an object literal`
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
 * Transform a parsed typescript source file into a string.
 */
export function getSourceAsString(sourceFile: ts.Node): string {
  return ts
    .createPrinter({
      newLine: ts.NewLineKind.LineFeed,
    })
    .printNode(ts.EmitHint.Unspecified, sourceFile, undefined);
}

/**
 * Read the value of a string literal from a typescript source file.
 */
export function getStringLiteral(
  sourceFile: ts.SourceFile,
  name: string
): string {
  const nodes = getSourceNodes(sourceFile);
  const identifierNode = nodes.find(
    (node) => ts.isIdentifier(node) && (node as ts.Identifier).text === name
  );
  if (
    identifierNode &&
    identifierNode.parent &&
    [
      ts.SyntaxKind.VariableDeclaration,
      ts.SyntaxKind.PropertyAssignment,
    ].includes(identifierNode.parent.kind)
  ) {
    const value = identifierNode.parent.getLastToken();
    if (ts.isStringLiteral(value)) {
      return (value as ts.StringLiteral).text;
    }
  }
  throw new Error(`Unable to find ${name}`);
}

/**
 * Create a transformer to add an export statement to a typescript source file.
 */
export function getInsertExportTransformer(
  insertPath: string,
  afterPath: string
): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    return (sourceFile: ts.SourceFile) => {
      const visitor = (rootNode: ts.Node) => {
        const node = ts.visitEachChild(rootNode, visitor, context);
        if (ts.isExportDeclaration(node)) {
          const exportPath = (
            (node as ts.ExportDeclaration).moduleSpecifier as ts.StringLiteral
          ).text;
          if (exportPath === afterPath) {
            return context.factory.createNodeArray([
              node,
              context.factory.createExportDeclaration(
                undefined,
                undefined,
                false,
                undefined,
                context.factory.createStringLiteral(insertPath, true)
              ),
            ]);
          }
        }
        return node;
      };
      return ts.visitNode(sourceFile, visitor);
    };
  };
}

export function getInsertImportTransformer(
  symbol: string,
  path: string
): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    return (sourceFile: ts.SourceFile) => {
      const importStatement = findImport(sourceFile, path);
      if (importStatement && getNamedImport(importStatement, symbol)) {
        // Already imported
        return sourceFile;
      }
      // Add import statement tp the top of the file. Prettier will sort this out.
      return context.factory.updateSourceFile(sourceFile, [
        context.factory.createImportDeclaration(
          [],
          [],
          context.factory.createImportClause(
            false,
            undefined,
            context.factory.createNamedImports([
              context.factory.createImportSpecifier(
                false,
                undefined,
                context.factory.createIdentifier(symbol)
              ),
            ])
          ),
          context.factory.createStringLiteral(path, true)
        ),
        ...sourceFile.statements,
      ]);
    };
  };
}

/**
 * Create a transformer to add an identifier to an array in a typescript source file.
 */
export function getInsertIdentifierToArrayTransformer(
  propertyName: string,
  identifier: string
): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    return (sourceNode: ts.SourceFile) => {
      const visitor = (rootNode: ts.Node) => {
        const node = ts.visitEachChild(rootNode, visitor, context);
        if (
          ts.isPropertyAssignment(node) &&
          (node as ts.PropertyAssignment).name.getText() === propertyName &&
          ts.isArrayLiteralExpression(
            (node as ts.PropertyAssignment).initializer
          )
        ) {
          return context.factory.createPropertyAssignment(
            propertyName,
            context.factory.createArrayLiteralExpression([
              ...(
                (node as ts.PropertyAssignment)
                  .initializer as ts.ArrayLiteralExpression
              ).elements,
              context.factory.createIdentifier(identifier),
            ])
          );
        }
        return node;
      };
      return ts.visitNode(sourceNode, visitor);
    };
  };
}

/**
 * Create a transformer to add an identifier to an NgModule decorator property in a typescript source file.
 */
function getTransformerToAddSymbolToDecoratedClassMetadata(
  importPath: string,
  importName: string,
  metadataField: string,
  expression: string
): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    return (sourceFile: ts.SourceFile) => {
      const coreImport = findImport(sourceFile, importPath);
      if (!coreImport) {
        return sourceFile;
      }
      const ngModuleClass = getNamedImport(coreImport, importName);
      if (!ngModuleClass) {
        return sourceFile;
      }
      const decoratedClass = findDecoratedClass(
        sourceFile,
        ngModuleClass.name.escapedText
      );
      if (!decoratedClass) {
        return sourceFile;
      }
      if (metadataField in decoratedClass.properties) {
        if (
          !ts.isArrayLiteralExpression(decoratedClass.properties[metadataField])
        ) {
          // Unexpected metadata field type
          return sourceFile;
        }
        const existingExpressions = (
          decoratedClass.properties[metadataField] as ts.ArrayLiteralExpression
        ).elements.map((element) =>
          getSourceAsString(element).trim().replace(/;$/, '')
        );
        if (existingExpressions.includes(expression)) {
          // Already added
          return sourceFile;
        }
        const newExpression = context.factory.createIdentifier(expression);
        const appendValueVisitor = (rootNode: ts.Node) => {
          if (
            ts.isArrayLiteralExpression(rootNode) &&
            rootNode === decoratedClass.properties[metadataField]
          ) {
            return context.factory.updateArrayLiteralExpression(rootNode, [
              ...rootNode.elements,
              newExpression,
            ]);
          }
          return ts.visitEachChild(rootNode, appendValueVisitor, context);
        };
        return ts.visitNode(sourceFile, appendValueVisitor);
      } else {
        const newExpression = context.factory.createPropertyAssignment(
          metadataField,
          context.factory.createArrayLiteralExpression([
            context.factory.createIdentifier(expression),
          ])
        );
        const newPropertyVisitor = (rootNode: ts.Node) => {
          if (
            ts.isObjectLiteralExpression(rootNode) &&
            rootNode === decoratedClass.propertiesObjectLiteral
          ) {
            return context.factory.updateObjectLiteralExpression(rootNode, [
              ...rootNode.properties,
              newExpression,
            ]);
          }
          return ts.visitEachChild(rootNode, newPropertyVisitor, context);
        };
        return ts.visitNode(sourceFile, newPropertyVisitor);
      }
    };
  };
}

/**
 * Create a transformer to add a component to an NgModule export.
 */
export function getTransformerToAddExportToNgModule(
  identifier: string
): ts.TransformerFactory<ts.SourceFile> {
  return getTransformerToAddSymbolToDecoratedClassMetadata(
    '@angular/core',
    'NgModule',
    'exports',
    identifier
  );
}

/**
 * Create a transformer to add a string literal value to an object literal in a typescript source file.
 */
export function getInsertStringPropertyTransformer(
  beforeProperty: string,
  name: string,
  value: string
): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    return (sourceFile: ts.SourceFile) => {
      const visitor = (rootNode: ts.Node) => {
        const node = ts.visitEachChild(rootNode, visitor, context);
        if (ts.isObjectLiteralExpression(node)) {
          const beforeChild = (
            node as ts.ObjectLiteralExpression
          ).properties.findIndex(
            (property) =>
              ts.isPropertyAssignment(property) &&
              ts.isIdentifier(property.name) &&
              property.name.text === beforeProperty
          );
          if (beforeChild > -1) {
            const properties = Array.from(
              (node as ts.ObjectLiteralExpression).properties.values()
            );
            properties.splice(
              beforeChild,
              0,
              context.factory.createPropertyAssignment(
                name,
                context.factory.createStringLiteral(value)
              )
            );
            return context.factory.updateObjectLiteralExpression(
              node as ts.ObjectLiteralExpression,
              properties
            );
          }
        }
        return node;
      };
      return ts.visitNode(sourceFile, visitor);
    };
  };
}

/**
 * Create a transformer to update the value of string literals in a typescript source file.
 */
export function getStringLiteralsSetterTransformer(strings: {
  [_: string]: string;
}): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    return (sourceFile: ts.SourceFile) => {
      const visitor = (rootNode: ts.Node) => {
        const node = ts.visitEachChild(rootNode, visitor, context);
        if (
          node.parent &&
          ts.isStringLiteral(node) &&
          ts.isIdentifier(node.parent.getChildAt(0)) &&
          (node.parent.getChildAt(0) as ts.Identifier).text
        ) {
          const identifierName = (
            node.parent.getChildAt(0) as ts.Identifier
          ).getText(sourceFile);
          if (identifierName in strings) {
            return context.factory.createStringLiteral(strings[identifierName]);
          }
        }
        return node;
      };
      return ts.visitNode(sourceFile, visitor);
    };
  };
}

/**
 * Create a transformer to rename variables in a typescript source file.
 */
export function getRenameVariablesTransformer(renameMap: {
  [_: string]: string;
}): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    return (sourceFile: ts.SourceFile) => {
      const visitor = (rootNode: ts.Node) => {
        const node = ts.visitEachChild(rootNode, visitor, context);
        if (ts.isIdentifier(node) && (node as ts.Identifier).text) {
          const identifierName = (node as ts.Identifier).getText(sourceFile);
          if (identifierName in renameMap) {
            return context.factory.createIdentifier(renameMap[identifierName]);
          }
        }
        return node;
      };
      return ts.visitNode(sourceFile, visitor);
    };
  };
}

/**
 * Read a typescript source file from a @nrwl/devkit tree.
 */
export function readSourceFile(tree: Tree, path: string): ts.SourceFile {
  return ts.createSourceFile(
    path,
    tree.read(path, 'utf-8'),
    ts.ScriptTarget.Latest,
    true
  );
}

/**
 * Write a typescript source file to a @nrwl/devkit tree.
 */
export function writeSourceFile(
  tree: Tree,
  path: string,
  sourceFile: ts.SourceFile
): void {
  tree.write(path, getSourceAsString(sourceFile));
}
