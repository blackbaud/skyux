import { Path, dirname, join, split } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import * as path from 'path';

import { getWorkspace } from '../../utility/workspace';

function updateTypescriptImports(
  filePath: string,
  tree: Tree,
  context: SchematicContext
): void {
  const fileContent = tree.read(filePath)?.toString();
  if (!fileContent) {
    return;
  }
  context.logger.debug(`Checking imports in ${filePath}...`);
  const source = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );
  // Get all import declarations
  const importDeclarations = source.statements.filter(
    (statement) => statement.kind === ts.SyntaxKind.ImportDeclaration
  ) as ts.ImportDeclaration[];
  // Just local import targets
  const localImportDeclarations = importDeclarations.filter(
    (importDeclaration) => {
      const importPath = importDeclaration.moduleSpecifier.getText(source);
      const importPathWithoutQuotes = importPath.substring(
        1,
        importPath.length - 1
      );
      return importPathWithoutQuotes.startsWith('.');
    }
  );
  const transformers: { find: string; replace: string }[] = [];
  localImportDeclarations.forEach((importDeclaration) => {
    const importPath = importDeclaration.moduleSpecifier.getText(source);
    const importPathWithoutQuotes = importPath.substring(
      1,
      importPath.length - 1
    );
    const absoluteImportPath = path.join(
      path.dirname(filePath),
      `${importPathWithoutQuotes}.ts`.replace(/\\/g, '/')
    );
    const pathFragments = split(absoluteImportPath as Path).slice(1);
    const newPath: string[] = [];
    let dir = tree.root;
    // Walk the path fragments and check if the case is correct. This approach works on both case-sensitive and case-insensitive file systems.
    for (const pathFragment of pathFragments) {
      if (pathFragment.endsWith('.ts')) {
        if (dir.subfiles.includes(pathFragment)) {
          // File exists. We're done.
          newPath.push(pathFragment.replace(/\.ts$/, ''));
          break;
        }
        // File does not exist. Try to find a file with the same name but different casing.
        const matchingFile = dir.subfiles.find((subFile) =>
          subFile.toLowerCase().includes(pathFragment.toLowerCase())
        );
        if (matchingFile) {
          // Found a matching file. Use it.
          newPath.push(matchingFile.replace(/\.ts$/, ''));
          break;
        }
      } else {
        if (dir.subdirs.includes(pathFragment)) {
          // Sub dir exists. Continue.
          dir = dir.dir(pathFragment);
          newPath.push(pathFragment);
          continue;
        }
        // Dir does not exist. Try to find a dir with the same name but different casing.
        const matchingDir = dir.subdirs.find((subdir) =>
          subdir.toLowerCase().includes(pathFragment.toLowerCase())
        );
        if (matchingDir) {
          // Found a matching dir. Use it.
          dir = dir.dir(matchingDir);
          newPath.push(matchingDir);
          continue;
        }
      }
      // Nothing found. Can't fix this.
      return;
    }
    const newImportPathAbsolute = join(tree.root.path, ...newPath);
    let newImportPathRelative = path.relative(
      dirname(filePath as Path),
      newImportPathAbsolute
    );
    if (!newImportPathRelative.startsWith('.')) {
      newImportPathRelative = `./${newImportPathRelative}`;
    }
    if (newImportPathRelative !== importPathWithoutQuotes) {
      context.logger.debug(
        `Updating ${filePath} :: ${importPathWithoutQuotes} -> ${newImportPathRelative}`
      );
      transformers.push({
        find: importPathWithoutQuotes,
        replace: newImportPathRelative,
      });
    }
  });
  if (transformers.length > 0) {
    let newContent = fileContent;
    transformers.forEach((transformer) => {
      newContent = newContent.replace(transformer.find, transformer.replace);
    });
    tree.overwrite(filePath, newContent);
  }
}

async function visitTypescriptFiles(
  tree: Tree,
  context: SchematicContext
): Promise<void> {
  const { workspace } = await getWorkspace(tree);
  workspace.projects.forEach((project, projectName) => {
    context.logger.debug(
      `Looking for typescript files in project ${projectName}...`
    );
    tree.getDir(project.root).visit((filePath) => {
      if (filePath.endsWith('.ts')) {
        updateTypescriptImports(filePath, tree, context);
      }
    });
  });
}

export default function (): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    await visitTypescriptFiles(tree, context);
  };
}
