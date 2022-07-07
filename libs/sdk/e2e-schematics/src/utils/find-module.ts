import { Tree, visitNotIgnoredFiles } from '@nrwl/devkit';

import { relative } from 'path';
import * as ts from 'typescript';

import {
  DecoratedClass,
  findComponentClass,
  findImport,
  findNgModuleClass,
  getNamedImport,
  readSourceFile,
} from './ast-utils';
import { dirname } from './utils';

export function findModulePaths(
  tree: Tree,
  path: string,
  predicate: (path: string) => boolean,
  endsWith = '.module.ts'
): string[] {
  let modulePaths: string[] = [];
  visitNotIgnoredFiles(tree, path, (filePath) => {
    if (filePath.endsWith(endsWith)) {
      if (predicate(filePath)) {
        modulePaths.push(filePath);
      }
    }
  });
  return modulePaths;
}

export function findDeclaringModule(
  tree: Tree,
  path: string,
  componentPath: string
): { filepath: string; module: DecoratedClass } | null {
  let result: { filepath: string; module: DecoratedClass } | null = null;
  const componentSource = readSourceFile(tree, componentPath);
  const componentClass = findComponentClass(componentSource);
  if (componentClass) {
    findModulePaths(
      tree,
      path,
      (filepath) => {
        const filepathDirectory = filepath.substring(
          0,
          filepath.lastIndexOf('/')
        );
        let relativePath = relative(filepathDirectory, componentPath);
        if (!relativePath.startsWith('.')) {
          relativePath = `./${relativePath}`;
        }
        try {
          const sourceFile = readSourceFile(tree, filepath);
          const componentFileImport = findImport(sourceFile, relativePath);
          if (!componentFileImport) {
            return false;
          }
          const componentNamedImport = getNamedImport(
            componentFileImport,
            componentClass.classDeclaration.name.text
          );
          const module = findNgModuleClass(sourceFile);
          if (module) {
            if (
              module.properties.declarations &&
              ts.isArrayLiteralExpression(module.properties.declarations)
            ) {
              const declarations = module.properties.declarations.elements;
              for (const declaration of declarations) {
                if (
                  ts.isIdentifier(declaration) &&
                  declaration.text === componentNamedImport.name.text
                ) {
                  result = { filepath, module };
                  return true;
                }
              }
            }
          }
        } catch (e) {}
        return false;
      },
      '.module.ts'
    );
  }
  return result;
}

export function isRoutingModule(
  module: DecoratedClass,
  sourceFile: ts.SourceFile
) {
  // Is one of the imports a static call to a method on RouterModule?
  if (
    module.properties.imports &&
    ts.isArrayLiteralExpression(module.properties.imports)
  ) {
    if (
      (module.properties.imports as ts.ArrayLiteralExpression).elements.some(
        (im) => {
          if (
            ts.isCallExpression(im) &&
            ts.isPropertyAccessExpression(im.getChildren(sourceFile)[0])
          ) {
            const propertyAccessExpression = im.getChildren(
              sourceFile
            )[0] as ts.PropertyAccessExpression;
            if (
              ts.isIdentifier(
                (propertyAccessExpression as ts.PropertyAccessExpression)
                  .expression
              )
            ) {
              return (
                (propertyAccessExpression.expression as ts.Identifier).text ===
                'RouterModule'
              );
            }
          }
          return false;
        }
      )
    ) {
      return true;
    }
  }
  return false;
}

export function findClosestModule(
  modulePaths: string[],
  projectDirectory: string,
  closestToDirectory: string
): string | undefined {
  modulePaths.sort((a, b) => {
    const aDir = dirname(a);
    const bDir = dirname(b);
    if (aDir.length === bDir.length) {
      return a > b ? 1 : -1;
    }
    return aDir.length < bDir.length ? 1 : -1;
  });
  let directory = `${projectDirectory}/${closestToDirectory}`;
  while (
    directory &&
    directory !== projectDirectory &&
    !modulePaths.some((m) => dirname(m) === directory)
  ) {
    directory = dirname(directory);
  }
  if (directory === projectDirectory) {
    return undefined;
  }
  // Return the basename of the module.
  return modulePaths
    .find((m) => dirname(m) === directory)
    .split('/')
    .pop()
    .replace(/\.module\.ts$/, '');
}
