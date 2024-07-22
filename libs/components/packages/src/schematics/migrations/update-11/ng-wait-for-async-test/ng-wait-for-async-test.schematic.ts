import { Tree } from '@angular-devkit/schematics';
import { isImported, parseSourceFile } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';

export default function () {
  return (tree: Tree) => {
    tree.visit((path, entry) => {
      if (
        !path.endsWith('.ts') ||
        path.includes('__skyux') ||
        path.includes('node_modules')
      ) {
        return;
      }
      const content = entry?.content.toString();
      if (!content) {
        return;
      }

      const sourceFile = parseSourceFile(tree, path);
      if (
        !sourceFile ||
        !isImported(sourceFile, 'async', '@angular/core/testing')
      ) {
        return;
      }

      const recorder = tree.beginUpdate(path);

      const importSpecifier = findNodes(
        sourceFile,
        ts.SyntaxKind.ImportSpecifier,
      ).filter(
        (node): node is ts.ImportSpecifier =>
          ts.isImportSpecifier(node) && node.name.text === 'async',
      )[0];
      recorder.remove(
        importSpecifier.getStart(sourceFile),
        importSpecifier.getWidth(sourceFile),
      );
      if (!isImported(sourceFile, 'waitForAsync', '@angular/core/testing')) {
        recorder.insertLeft(
          importSpecifier.getStart(sourceFile),
          'waitForAsync',
        );
      } else if (
        content.charAt(
          importSpecifier.getStart(sourceFile) +
            importSpecifier.getWidth(sourceFile),
        ) === ','
      ) {
        recorder.remove(
          importSpecifier.getStart(sourceFile) +
            importSpecifier.getWidth(sourceFile),
          1,
        );
      }

      const asyncCalls = findNodes(
        sourceFile,
        ts.SyntaxKind.CallExpression,
        undefined,
        true,
      ).filter(
        (node): node is ts.CallExpression =>
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          (node.expression as ts.Identifier).text === 'async',
      );
      asyncCalls.forEach((call) => {
        recorder.remove(
          call.expression.getStart(sourceFile),
          call.expression.getWidth(sourceFile),
        );
        recorder.insertLeft(
          call.expression.getStart(sourceFile),
          'waitForAsync',
        );
      });

      tree.commitUpdate(recorder);
    });
  };
}
