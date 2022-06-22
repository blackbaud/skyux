import { getSourceNodes } from '@angular/cdk/schematics';
import { Tree } from '@nrwl/devkit';

import * as ts from 'typescript';

export function applyTransformers(
  sourceFiles: ts.SourceFile[],
  transformers: ts.TransformerFactory<ts.SourceFile>[]
): ts.SourceFile[] {
  const transformation = ts.transform(sourceFiles, transformers);
  return transformation.transformed;
}

export function getSourceAsString(sourceFile: ts.SourceFile): string {
  return ts
    .createPrinter()
    .printNode(ts.EmitHint.Unspecified, sourceFile, undefined);
}

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

export function readSourceFile(tree: Tree, path: string): ts.SourceFile {
  return ts.createSourceFile(
    path,
    tree.read(path, 'utf-8'),
    ts.ScriptTarget.Latest,
    true
  );
}

export function writeSourceFile(
  tree: Tree,
  path: string,
  sourceFile: ts.SourceFile
): void {
  tree.write(path, getSourceAsString(sourceFile));
}
