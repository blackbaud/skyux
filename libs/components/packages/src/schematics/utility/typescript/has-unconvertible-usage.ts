import { findNodes } from '@schematics/angular/utility/ast-utils';
import ts from 'typescript';

import { isPackageMatch } from '../dependencies';

import { getLocalImportName } from './ng-ast';

/**
 * True if the file reaches any of `classNames` from `packageName` through an
 * aliased import, a namespace import (`ns.ClassName`) or a re-export.
 * `swapImportedClass` only rewrites plain named imports, so a migration
 * should leave such a file to be converted by hand.
 */
export function hasUnconvertibleUsage(
  source: ts.SourceFile,
  packageName: string,
  classNames: string[],
): boolean {
  const isAliased = classNames.some((className) => {
    const localName = getLocalImportName(source, className, packageName);

    return localName !== undefined && localName !== className;
  });

  if (isAliased) {
    return true;
  }

  const declarationsFromPackage = source.statements.filter(
    (statement): statement is ts.ImportDeclaration | ts.ExportDeclaration =>
      (ts.isImportDeclaration(statement) ||
        ts.isExportDeclaration(statement)) &&
      !!statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      isPackageMatch(statement.moduleSpecifier.text, packageName),
  );

  return declarationsFromPackage.some((statement) => {
    if (ts.isExportDeclaration(statement)) {
      const exportClause = statement.exportClause;

      return (
        !exportClause ||
        !ts.isNamedExports(exportClause) ||
        exportClause.elements.some((element) =>
          classNames.includes((element.propertyName ?? element.name).text),
        )
      );
    }

    const namedBindings = statement.importClause?.namedBindings;

    if (!namedBindings || !ts.isNamespaceImport(namedBindings)) {
      return false;
    }

    return findNodes(source, ts.isPropertyAccessExpression).some(
      (node) =>
        node.expression.getText() === namedBindings.name.text &&
        classNames.includes(node.name.text),
    );
  });
}
