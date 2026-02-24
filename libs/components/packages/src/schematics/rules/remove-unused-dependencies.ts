import { Rule, Tree, chain } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { removeDependency } from '@schematics/angular/utility/dependency';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { parseSourceFile } from '../utility/typescript/ng-ast';
import { visitProjectFiles } from '../utility/visit-project-files';
import { getSourceRoot } from '../utility/workspace';

/**
 * Removes one or more dependencies if they are not being used by TypeScript source files in any project.
 * Accepts either a single package name or an array of package names for efficiency when checking multiple packages.
 */
export function removeUnusedDependencies(
  packageNames: string | string[],
): Rule {
  return async (tree) => {
    const workspace = await getWorkspace(tree);

    const packages = Array.isArray(packageNames)
      ? packageNames
      : [packageNames];

    const usedPackages = new Set<string>();

    // Scan all projects once to find which packages are actually used
    workspace.projects.forEach((project) => {
      const sourceRoot = getSourceRoot(project);
      const projectUsedPackages = findUsedPackages(tree, packages, sourceRoot);

      projectUsedPackages.forEach((pkg) => usedPackages.add(pkg));
    });

    const packagesToRemove = packages.filter((pkg) => !usedPackages.has(pkg));

    if (packagesToRemove.length === 0) {
      return tree;
    }

    return chain(packagesToRemove.map((pkg) => removeDependency(pkg)));
  };
}

/**
 * Checks if a package name matches an import module specifier.
 * This supports both exact matches and subpath imports.
 */
function isPackageMatch(moduleSpecifier: string, packageName: string): boolean {
  return (
    moduleSpecifier === packageName ||
    moduleSpecifier.startsWith(`${packageName}/`)
  );
}

/**
 * Checks if any import declarations use any of the specified packages.
 * Returns an array of package names that are used.
 */
function getUsedPackagesFromImports(
  sourceFile: ts.SourceFile,
  packageNames: string[],
): string[] {
  const importDeclarations = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ) as ts.ImportDeclaration[];

  const usedPackages: string[] = [];

  for (const importDecl of importDeclarations) {
    if (
      importDecl.moduleSpecifier &&
      ts.isStringLiteral(importDecl.moduleSpecifier)
    ) {
      const moduleSpecifier = importDecl.moduleSpecifier.text;

      for (const packageName of packageNames) {
        if (isPackageMatch(moduleSpecifier, packageName)) {
          usedPackages.push(packageName);
        }
      }
    }
  }

  return usedPackages;
}

/**
 * Checks if the call expression is a dynamic import or require for the package.
 */
function isCallExpressionMatch(
  callExpr: ts.CallExpression,
  packageName: string,
): boolean {
  // Check for dynamic import()
  if (callExpr.expression.kind === ts.SyntaxKind.ImportKeyword) {
    if (
      callExpr.arguments.length > 0 &&
      ts.isStringLiteral(callExpr.arguments[0])
    ) {
      return isPackageMatch(callExpr.arguments[0].text, packageName);
    }
  }

  // Check for require('package-name')
  if (
    ts.isIdentifier(callExpr.expression) &&
    callExpr.expression.text === 'require'
  ) {
    if (
      callExpr.arguments.length > 0 &&
      ts.isStringLiteral(callExpr.arguments[0])
    ) {
      return isPackageMatch(callExpr.arguments[0].text, packageName);
    }
  }

  return false;
}

/**
 * Checks if any call expressions (dynamic imports or requires) use any of the specified packages.
 * Returns an array of package names that are used.
 */
function getUsedPackagesFromCalls(
  sourceFile: ts.SourceFile,
  packageNames: string[],
): string[] {
  const callExpressions = findNodes(
    sourceFile,
    ts.SyntaxKind.CallExpression,
  ) as ts.CallExpression[];

  const usedPackages: string[] = [];

  for (const callExpr of callExpressions) {
    for (const packageName of packageNames) {
      if (isCallExpressionMatch(callExpr, packageName)) {
        usedPackages.push(packageName);
      }
    }
  }

  return usedPackages;
}

/**
 * Finds which packages are imported in any TypeScript files within the specified source root.
 * Returns a Set of package names that are used.
 */
function findUsedPackages(
  tree: Tree,
  packageNames: string[],
  sourceRoot: string,
): Set<string> {
  const usedPackages = new Set<string>();

  visitProjectFiles(tree, sourceRoot, (filePath) => {
    if (!filePath.endsWith('.ts')) {
      return;
    }

    try {
      const sourceFile = parseSourceFile(tree, filePath);

      // Check standard import declarations
      const importsUsed = getUsedPackagesFromImports(sourceFile, packageNames);
      importsUsed.forEach((pkg) => usedPackages.add(pkg));

      // Check dynamic imports/requires
      const callsUsed = getUsedPackagesFromCalls(sourceFile, packageNames);
      callsUsed.forEach((pkg) => usedPackages.add(pkg));

      /* v8 ignore next 4 -- @preserve */
    } catch {
      // If we can't parse the file, skip it
      // This can happen with invalid TypeScript or non-UTF8 files
    }
  });

  return usedPackages;
}
