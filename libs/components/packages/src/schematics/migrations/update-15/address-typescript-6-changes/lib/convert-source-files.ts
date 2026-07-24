import {
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { posix } from 'node:path';
import ts from 'typescript';

import { parseSourceFile } from '../../../../utility/typescript/ng-ast';
import { visitProjectFiles } from '../../../../utility/visit-project-files';

import { findModuleSpecifiers, matchesPathsPattern } from './module-specifiers';
import { GoverningBaseUrl, TsconfigModel } from './tsconfig-model';

const MODULE_KEYWORD_RE = /\bmodule\s+[A-Za-z_$]/;

export function convertSourceFiles(
  tree: Tree,
  model: TsconfigModel,
  context: SchematicContext,
): void {
  const warnedConflictDirs = new Set<string>();

  visitProjectFiles(tree, '/', (filePath) => {
    if (!filePath.endsWith('.ts')) {
      return;
    }

    const content = tree.readText(filePath);
    const governing = model.getGoverningBaseUrl(filePath);

    if (!governing && !MODULE_KEYWORD_RE.test(content)) {
      return;
    }

    if (governing?.conflictingConfigPaths) {
      warnConflict(
        context,
        warnedConflictDirs,
        filePath,
        governing.conflictingConfigPaths,
      );
    }

    const sourceFile = parseSourceFile(tree, filePath);
    const recorder = tree.beginUpdate(filePath);

    if (governing) {
      convertImports(tree, filePath, sourceFile, governing, recorder);
    }
    convertNamespaces(sourceFile, recorder);

    tree.commitUpdate(recorder);
  });
}

function warnConflict(
  context: SchematicContext,
  warnedConflictDirs: Set<string>,
  filePath: string,
  conflictingConfigPaths: string[],
): void {
  const dir = posix.dirname(filePath);
  if (warnedConflictDirs.has(dir)) {
    return;
  }
  warnedConflictDirs.add(dir);

  context.logger.warn(
    `Multiple tsconfig files govern "${dir}" with different effective "baseUrl" values ` +
      `(${conflictingConfigPaths.join(', ')}). Imports here were converted ` +
      'using only one of them; verify the result.',
  );
}

function convertImports(
  tree: Tree,
  filePath: string,
  sourceFile: ts.SourceFile,
  governing: GoverningBaseUrl,
  recorder: UpdateRecorder,
): void {
  const fileDir = posix.dirname(filePath);

  for (const specifier of findModuleSpecifiers(sourceFile)) {
    const text = specifier.text;

    if (text.startsWith('.') || text.startsWith('/')) {
      continue;
    }
    if (matchesPathsPattern(text, governing.pathsPatterns)) {
      continue;
    }
    if (!existsViaBaseUrl(tree, governing.baseUrlAbs, text)) {
      continue;
    }

    let newSpecifier = posix.relative(
      fileDir,
      posix.join(governing.baseUrlAbs, text),
    );
    if (!newSpecifier.startsWith('.')) {
      newSpecifier = `./${newSpecifier}`;
    }

    const innerStart = specifier.getStart(sourceFile) + 1;
    const innerLength = specifier.getEnd() - innerStart - 1;
    recorder.remove(innerStart, innerLength);
    recorder.insertLeft(innerStart, newSpecifier);
  }
}

function existsViaBaseUrl(
  tree: Tree,
  baseUrlAbs: string,
  specifierText: string,
): boolean {
  const target = posix.join(baseUrlAbs, specifierText);

  return (
    tree.exists(`${target}.ts`) ||
    tree.exists(`${target}.d.ts`) ||
    tree.exists(`${target}/index.ts`) ||
    tree.exists(`${target}/index.d.ts`)
  );
}

function convertNamespaces(
  sourceFile: ts.SourceFile,
  recorder: UpdateRecorder,
): void {
  const declarations = findNodes(
    sourceFile,
    (node): node is ts.ModuleDeclaration =>
      ts.isModuleDeclaration(node) && ts.isIdentifier(node.name),
    Infinity,
    true,
  );

  for (const declaration of declarations) {
    const keyword = declaration
      .getChildren(sourceFile)
      .find((child) => child.kind === ts.SyntaxKind.ModuleKeyword);

    if (!keyword) {
      continue;
    }

    recorder.remove(keyword.getStart(sourceFile), keyword.getWidth(sourceFile));
    recorder.insertLeft(keyword.getStart(sourceFile), 'namespace');
  }
}
