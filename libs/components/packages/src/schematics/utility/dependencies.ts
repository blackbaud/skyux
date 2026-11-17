import { join, normalize } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
import { ProjectDefinition, addDependency } from '@schematics/angular/utility';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import {
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import ts from 'typescript';

import { JsonFile } from './json-file';
import { parseSourceFile } from './typescript/ng-ast';
import { visitProjectFiles } from './visit-project-files';

export async function isPackageUsed(
  tree: Tree,
  packageName: string,
): Promise<boolean> {
  const workspace = await getWorkspace(tree);

  for (const project of workspace.projects.values()) {
    if (isPackageFoundInFiles(tree, packageName, project.root)) {
      return true;
    }
  }

  return false;
}

export async function getProjectsUsingPackage(
  tree: Tree,
  packageName: string,
): Promise<ProjectDefinition[]> {
  const workspace = await getWorkspace(tree);
  const projects: ProjectDefinition[] = [];

  for (const project of workspace.projects.values()) {
    if (isPackageFoundInFiles(tree, packageName, project.root)) {
      projects.push(project);
    }
  }

  return projects;
}

/**
 * True if any TypeScript file under `projectRoot` references `packageName`.
 * The whole project root is scanned because files outside `sourceRoot` (e.g.
 * a library's `testing/` entry point) still need the package installed.
 */
function isPackageFoundInFiles(
  tree: Tree,
  packageName: string,
  projectRoot: string,
): boolean {
  let found = false;

  visitProjectFiles(tree, projectRoot, (filePath) => {
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
  // A re-export (`export ... from 'package'`) needs the package installed too.
  const declarations = [
    ...findNodes(sourceFile, ts.SyntaxKind.ImportDeclaration),
    ...findNodes(sourceFile, ts.SyntaxKind.ExportDeclaration),
  ] as (ts.ImportDeclaration | ts.ExportDeclaration)[];

  for (const declaration of declarations) {
    if (
      declaration.moduleSpecifier &&
      ts.isStringLiteral(declaration.moduleSpecifier)
    ) {
      const moduleSpecifier = declaration.moduleSpecifier.text;

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

export function isPackageMatch(
  moduleSpecifier: string,
  packageName: string,
): boolean {
  return (
    moduleSpecifier === packageName ||
    moduleSpecifier.startsWith(`${packageName}/`)
  );
}

/**
 * The library's own `@skyux/core` version, preferring `section`, so a new
 * SKY UX package gets the same range or exact version the library already
 * uses for SKY UX. Falls back to the placeholder the root update uses.
 */
function getSkyuxCoreVersion(packageJson: JsonFile, section: string): string {
  return (
    [section, 'peerDependencies', 'dependencies', 'devDependencies']
      .map((name) => packageJson.get([name, '@skyux/core']))
      .find((version) => version !== undefined) ?? '0.0.0-PLACEHOLDER'
  );
}

/**
 * The project's own `package.json`, which lists a library's dependencies that
 * the workspace root update doesn't reach, or `undefined` if it has none.
 */
function getLibraryPackageJson(
  tree: Tree,
  projectPath: string,
): JsonFile | undefined {
  const packageJsonPath = join(normalize(projectPath), 'package.json');

  return projectPath && tree.exists(packageJsonPath)
    ? new JsonFile(tree, packageJsonPath)
    : undefined;
}

const LIBRARY_DEPENDENCY_SECTIONS = ['peerDependencies', 'dependencies'];

/**
 * Removes `packageName` from the workspace `package.json` when nothing in the
 * workspace imports it any more, and from the project's own `package.json`
 * when nothing in the project does.
 */
export async function removeUnusedPackageDependency(
  tree: Tree,
  projectPath: string,
  packageName: string,
): Promise<void> {
  if (!(await isPackageUsed(tree, packageName))) {
    removePackageJsonDependency(tree, packageName);
  }

  const packageJson = getLibraryPackageJson(tree, projectPath);
  const sections = LIBRARY_DEPENDENCY_SECTIONS.filter(
    (section) => packageJson?.get([section, packageName]) !== undefined,
  );

  if (!packageJson || sections.length === 0) {
    return;
  }

  const projectsUsingPackage = await getProjectsUsingPackage(tree, packageName);

  if (projectsUsingPackage.some((project) => project.root === projectPath)) {
    return;
  }

  for (const section of sections) {
    packageJson.remove([section, packageName]);
  }
}

/**
 * After a project's code moves from `oldPackage` to the SKY UX `newPackage`,
 * adds `newPackage` to the workspace and to each section of the project's own
 * `package.json` that lists `oldPackage` (so a peer dependency stays a peer
 * dependency), then removes `oldPackage` where it's no longer used.
 */
export async function swapPackageDependency(
  tree: Tree,
  projectPath: string,
  oldPackage: string,
  newPackage: string,
): Promise<Rule | void> {
  const packageJson = getLibraryPackageJson(tree, projectPath);

  for (const section of LIBRARY_DEPENDENCY_SECTIONS) {
    if (
      packageJson?.get([section, oldPackage]) !== undefined &&
      packageJson.get([section, newPackage]) === undefined
    ) {
      packageJson.modify(
        [section, newPackage],
        getSkyuxCoreVersion(packageJson, section),
      );
    }
  }

  await removeUnusedPackageDependency(tree, projectPath, oldPackage);

  // `addDependency` only checks `dependencies`, so it would add a second
  // entry for a package already listed under `devDependencies`.
  if (!getPackageJsonDependency(tree, newPackage)) {
    return addDependency(newPackage, '0.0.0-PLACEHOLDER');
  }
}
