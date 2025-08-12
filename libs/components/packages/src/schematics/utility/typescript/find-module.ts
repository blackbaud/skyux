import { Tree } from '@angular-devkit/schematics';
import {
  getDecoratorMetadata,
  getMetadataField,
  isImported,
  parseSourceFile,
} from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { buildRelativePath } from '@schematics/angular/utility/find-module';

import { visitProjectFiles } from '../visit-project-files';

function findModuleInPath(
  tree: Tree,
  path: string,
  filter: (sourceFile: ts.SourceFile) => boolean,
): {
  filepath: string;
  module: { className: string; metadata: ts.ObjectLiteralElement };
} | null {
  let found: {
    filepath: string;
    module: { className: string; metadata: ts.ObjectLiteralElement };
  } | null = null;
  visitProjectFiles(tree, path, (filePath) => {
    if (found) {
      return; // Stop searching if we already found a module
    }
    if (filePath.endsWith('.ts')) {
      const sourceFile = parseSourceFile(tree, filePath);
      if (
        isImported(sourceFile, 'NgModule', '@angular/core') &&
        filter(sourceFile)
      ) {
        const metadata = getDecoratorMetadata(
          sourceFile,
          'NgModule',
          '@angular/core',
        )[0] as ts.ObjectLiteralElement;
        const className =
          findClassDeclarationParent(metadata)?.name?.text || '';
        found = {
          filepath: buildRelativePath('/', `/${filePath}`),
          module: {
            className,
            metadata,
          },
        };
      }
    }
  });
  return found;
}

function findClassDeclarationParent(
  node: ts.Node | undefined,
): ts.ClassDeclaration | undefined {
  if (node && ts.isClassDeclaration(node)) {
    return node;
  }
  if (node?.parent) {
    return findClassDeclarationParent(node.parent);
  }
  return undefined;
}

export function isStandaloneComponent(
  metadata: ts.ObjectLiteralExpression,
): boolean {
  const standalone = getMetadataField(metadata, 'standalone');
  return (
    !standalone[0] ||
    (ts.isPropertyAssignment(standalone[0]) &&
      standalone[0].initializer.kind === ts.SyntaxKind.TrueKeyword)
  );
}

export function findDeclaringModule(
  tree: Tree,
  path: string,
  componentPath: string,
): {
  filepath: string;
  module: { className: string; metadata: ts.ObjectLiteralElement };
} | null {
  const source = parseSourceFile(tree, componentPath);
  const metadata = getDecoratorMetadata(
    source,
    'Component',
    '@angular/core',
  )[0] as ts.ObjectLiteralElement | undefined;
  const componentClass = findClassDeclarationParent(metadata);

  const componentClassName = componentClass?.name?.text;
  if (
    componentClassName &&
    metadata &&
    ts.isObjectLiteralExpression(metadata)
  ) {
    if (isStandaloneComponent(metadata)) {
      return {
        filepath: buildRelativePath('/', `/${componentPath}`),
        module: {
          className: componentClass.name.text,
          metadata: metadata,
        },
      };
    }

    return findModuleInPath(tree, path, (sourceFile) => {
      const moduleMetadata = getDecoratorMetadata(
        sourceFile,
        'NgModule',
        '@angular/core',
      )[0] as ts.ObjectLiteralExpression | undefined;
      if (!moduleMetadata) {
        return false;
      }
      const declarations = getMetadataField(moduleMetadata, 'declarations');
      return (
        declarations &&
        declarations.some(
          (declaration) =>
            ts.isPropertyAssignment(declaration) &&
            ts.isArrayLiteralExpression(declaration.initializer) &&
            declaration.initializer.elements.some(
              (item) => item.getText(sourceFile) === componentClassName,
            ),
        )
      );
    });
  }

  return null;
}
