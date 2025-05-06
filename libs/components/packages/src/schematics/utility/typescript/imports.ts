/**
 * The contents of this file are heavily inspired by Angular's source code.
 * @see https://github.com/angular/angular/blob/14.3.x/packages/core/schematics/utils/typescript/imports.ts
 */
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export interface ImportUsage {
  node: ts.Node;
  importName: string;
}

export function getImports(
  sourceFile: ts.SourceFile,
  packages: Map<string, string[]>,
): ts.ImportSpecifier[] {
  const importSpecifiers: ts.ImportSpecifier[] = [];

  for (const [packageName, classes] of packages.entries()) {
    for (const cc of classes) {
      const specifiers = getImportSpecifiers(sourceFile, packageName, cc);

      if (specifiers) {
        importSpecifiers.push(...specifiers);
      }
    }
  }

  return importSpecifiers;
}

export function getUsages(
  sourceFile: ts.SourceFile,
  importSpecifier: ts.ImportSpecifier,
): ImportUsage[] {
  const usages: ImportUsage[] = [];

  const visitNode = (node: ts.Node): void => {
    // Skip this node and all of its children; imports are a special case.
    if (ts.isImportSpecifier(node)) {
      return;
    }

    const importName = importSpecifier.getText(sourceFile);

    if (ts.isIdentifier(node) && node.escapedText === importName) {
      usages.push({ node, importName });
    }

    ts.forEachChild(node, visitNode);
  };

  ts.forEachChild(sourceFile, visitNode);

  return usages;
}

/**
 * Gets top-level import specifiers with a specific name that is imported from a particular module.
 * E.g. given a file that looks like:
 *
 * ```
 * import { Component, Directive } from '@angular/core';
 * import { Foo } from './foo';
 * ```
 *
 * Calling `getImportSpecifiers(sourceFile, '@angular/core', 'Directive')` will yield the nodes
 * referring to `Directive` in the top import.
 *
 * @param sourceFile File in which to look for imports.
 * @param moduleName Name of the import's module.
 * @param specifierName Original name of the specifier to look for. Aliases will be resolved to
 *    their original name.
 */
function getImportSpecifiers(
  sourceFile: ts.SourceFile,
  moduleName: string,
  specifierName: string,
): ts.ImportSpecifier[] {
  const importSpecifiers: ts.ImportSpecifier[] = [];

  for (const node of sourceFile.statements) {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text === moduleName
    ) {
      const namedBindings =
        node.importClause && node.importClause.namedBindings;

      if (namedBindings && ts.isNamedImports(namedBindings)) {
        const match = findImportSpecifier(
          namedBindings.elements,
          specifierName,
        );

        if (match) {
          importSpecifiers.push(match);
        }
      }
    }
  }

  return importSpecifiers;
}

/**
 * Finds an import specifier with a particular name.
 */
function findImportSpecifier(
  nodes: ts.NodeArray<ts.ImportSpecifier>,
  specifierName: string,
): ts.ImportSpecifier | undefined {
  return nodes.find((element) => {
    const { name, propertyName } = element;

    return propertyName?.text === specifierName || name.text === specifierName;
  });
}
