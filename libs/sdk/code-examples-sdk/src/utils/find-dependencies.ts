import { Tree } from '@nx/devkit';

import * as ts from 'typescript';

import { readSourceFile } from './ast-utils';

function sortDependencies(dependencies: string[]) {
  const uniqueDependencies = [...new Set(dependencies)];
  uniqueDependencies.sort((a, b) => {
    if (a.startsWith('@') && !b.startsWith('@')) {
      return -1;
    } else if (!a.startsWith('@') && b.startsWith('@')) {
      return 1;
    } else {
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    }
  });
  return uniqueDependencies;
}

export function findDependenciesFromCode(tree: Tree, codePath: string) {
  // Find imports in .ts files within the example module
  const tsFiles = tree
    .children(codePath)
    .filter((child) => child.endsWith('.ts'));
  const tsFilesSources = tsFiles.map((file) =>
    readSourceFile(tree, `${codePath}/${file}`)
  );
  const tsFilesImports = tsFilesSources
    .map((source) => source.statements)
    .reduce((acc, statements) => acc.concat(statements), [] as ts.Statement[])
    .filter((statement) => ts.isImportDeclaration(statement))
    .map((importDeclaration) => {
      const importDeclarationNode = importDeclaration as ts.ImportDeclaration;
      const importDeclarationModuleSpecifier =
        importDeclarationNode.moduleSpecifier.getText();
      const importDeclarationModuleSpecifierWithoutQuotes =
        importDeclarationModuleSpecifier.substring(
          1,
          importDeclarationModuleSpecifier.length - 1
        );
      return importDeclarationModuleSpecifierWithoutQuotes.replace('.ts', '');
    })
    .filter(
      (importDeclarationModuleSpecifier) =>
        importDeclarationModuleSpecifier.startsWith('@') ||
        importDeclarationModuleSpecifier.match(/^[a-z]/)
    );
  const dependencies = tsFilesImports.map((packageName) => {
    if (packageName.startsWith('@')) {
      return packageName.split('/').slice(0, 2).join('/');
    } else {
      return packageName.split('/')[0];
    }
  });
  tree
    .children(codePath)
    .filter((child) => !tree.isFile(`${codePath}/${child}`))
    .forEach((child) => {
      dependencies.push(
        ...findDependenciesFromCode(tree, `${codePath}/${child}`)
      );
    });
  return sortDependencies(dependencies);
}

export function findPeerDependencies(tree: Tree, dependencies: string[]) {
  const checkedPackages: string[] = [];
  const allDependencies: string[] = [...dependencies];
  const findDependencies = (dependency: string) => {
    if (checkedPackages.includes(dependency)) {
      return;
    }
    checkedPackages.push(dependency);
    const packageJsonContent = tree.read(
      `node_modules/${dependency}/package.json`,
      'utf-8'
    );
    const packageJson = JSON.parse(packageJsonContent || '{}');
    const newDependencies = Object.keys(packageJson.dependencies || {}).concat(
      Object.keys(packageJson.peerDependencies || {})
    );
    if (newDependencies.length > 0) {
      newDependencies.forEach((peerDependency) => {
        if (!allDependencies.includes(peerDependency)) {
          allDependencies.push(peerDependency);
        }
        findDependencies(peerDependency);
      });
    }
  };
  dependencies.forEach((dependency) => {
    findDependencies(dependency);
  });
  return sortDependencies(allDependencies);
}
