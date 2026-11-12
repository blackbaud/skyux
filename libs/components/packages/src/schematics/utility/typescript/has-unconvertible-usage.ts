import { findNodes } from '@schematics/angular/utility/ast-utils';
import ts from 'typescript';

import { isPackageMatch } from '../dependencies';

import { getLocalImportName } from './ng-ast';

function isPackageSpecifier(
  specifier: ts.Expression | undefined,
  packageName: string,
): boolean {
  return (
    !!specifier &&
    ts.isStringLiteral(specifier) &&
    isPackageMatch(specifier.text, packageName)
  );
}

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

  return source.statements.some((statement) => {
    if (ts.isExportDeclaration(statement)) {
      const exportClause = statement.exportClause;

      return (
        isPackageSpecifier(statement.moduleSpecifier, packageName) &&
        (!exportClause ||
          !ts.isNamedExports(exportClause) ||
          exportClause.elements.some((element) =>
            classNames.includes((element.propertyName ?? element.name).text),
          ))
      );
    }

    if (
      !ts.isImportDeclaration(statement) ||
      !isPackageSpecifier(statement.moduleSpecifier, packageName)
    ) {
      return false;
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
