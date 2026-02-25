import { Tree } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { parseSourceFile } from './typescript/ng-ast';
import { visitProjectFiles } from './visit-project-files';
import { getSourceRoot } from './workspace';

export async function isPackageUsed(
  tree: Tree,
  packageName: string,
): Promise<boolean> {
  const workspace = await getWorkspace(tree);

  for (const project of workspace.projects.values()) {
    const sourceRoot = getSourceRoot(project);
    const found = isPackageFoundInFiles(tree, packageName, sourceRoot);

    if (found) {
      return true;
    }
  }

  return false;
}

/**
 * Finds which packages are imported in any TypeScript files within the specified source root.
 * Returns a Set of package names that are used.
 */
function isPackageFoundInFiles(
  tree: Tree,
  packageName: string,
  sourceRoot: string,
): boolean {
  let found = false;

  visitProjectFiles(tree, sourceRoot, (filePath) => {
    if (!filePath.endsWith('.ts') || found) {
      return;
    }

    const sourceFile = parseSourceFile(tree, filePath);

    found =
      hasImportStatement(sourceFile, packageName) ||
      hasCallExpression(sourceFile, packageName);
  });

  return found;
}

function hasImportStatement(
  sourceFile: ts.SourceFile,
  packageName: string,
): boolean {
  const importDeclarations = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ) as ts.ImportDeclaration[];

  for (const importDecl of importDeclarations) {
    if (
      importDecl.moduleSpecifier &&
      ts.isStringLiteral(importDecl.moduleSpecifier)
    ) {
      const moduleSpecifier = importDecl.moduleSpecifier.text;

      if (isPackageMatch(moduleSpecifier, packageName)) {
        return true;
      }
    }
  }

  return false;
}

function hasCallExpression(
  sourceFile: ts.SourceFile,
  packageName: string,
): boolean {
  const callExpressions = findNodes(
    sourceFile,
    ts.SyntaxKind.CallExpression,
  ) as ts.CallExpression[];

  for (const callExpr of callExpressions) {
    if (isCallExpressionMatch(callExpr, packageName)) {
      return true;
    }
  }

  return false;
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

function isPackageMatch(moduleSpecifier: string, packageName: string): boolean {
  return (
    moduleSpecifier === packageName ||
    moduleSpecifier.startsWith(`${packageName}/`)
  );
}
