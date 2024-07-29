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
        !isImported(sourceFile, 'SkyHelpInlineModule', '@skyux/indicators')
      ) {
        return;
      }

      const recorder = tree.beginUpdate(path);

      const helpInlineImportSpecifier = findNodes(
        sourceFile,
        ts.SyntaxKind.ImportSpecifier,
      ).filter(
        (node): node is ts.ImportSpecifier =>
          ts.isImportSpecifier(node) &&
          node.name.text === 'SkyHelpInlineModule',
      )[0];

      const indicatorsImports = findNodes(
        sourceFile,
        ts.SyntaxKind.ImportDeclaration,
      ).filter(
        (node): node is ts.ImportDeclaration =>
          ts.isImportDeclaration(node) &&
          !!node.importClause?.namedBindings &&
          ts.isNamedImports(node.importClause?.namedBindings) &&
          !!node.importClause.namedBindings.elements.find(
            (specifier) => specifier.getText() === 'SkyHelpInlineModule',
          ),
      )[0];

      if (
        indicatorsImports.importClause?.namedBindings &&
        ts.isNamedImports(indicatorsImports.importClause.namedBindings) &&
        indicatorsImports.importClause.namedBindings.elements.length > 1
      ) {
        recorder.remove(
          helpInlineImportSpecifier.getStart(sourceFile),
          helpInlineImportSpecifier.getWidth(sourceFile),
        );

        if (
          content.substring(
            helpInlineImportSpecifier.getStart(sourceFile) +
              helpInlineImportSpecifier.getWidth(sourceFile),
            helpInlineImportSpecifier.getStart(sourceFile) +
              helpInlineImportSpecifier.getWidth(sourceFile) +
              2,
          ) === ', '
        ) {
          recorder.remove(
            helpInlineImportSpecifier.getStart(sourceFile) +
              helpInlineImportSpecifier.getWidth(sourceFile),
            2,
          );
        }
      } else {
        recorder.remove(
          indicatorsImports.getStart(sourceFile),
          indicatorsImports.getWidth(sourceFile),
        );
      }

      if (
        !isImported(sourceFile, 'SkyHelpInlineModule', '@skyux/help-inline')
      ) {
        recorder.insertLeft(
          indicatorsImports.getStart(sourceFile),
          "import { SkyHelpInlineModule } from '@skyux/help-inline';\n",
        );
      }

      tree.commitUpdate(recorder);
    });
  };
}
