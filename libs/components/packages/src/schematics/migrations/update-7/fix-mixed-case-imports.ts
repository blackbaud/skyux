import { Path, dirname, join, split } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import * as path from 'path';

import { getWorkspace } from '../../utility/workspace';

function updateTypescriptImports(
  filePath: string,
  tree: Tree
): void {
  const fileContent = tree.read(filePath)?.toString();
  if (!fileContent) {
    return;
  }
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
  const transformers: ts.TransformerFactory<ts.SourceFile>[] = [];
  localImportDeclarations.forEach((importDeclaration) => {
    const importPath = importDeclaration.moduleSpecifier.getText(source);
    const importPathWithoutQuotes = importPath.substring(
      1,
      importPath.length - 1
    );
    const absoluteImportPath = path.join(path.dirname(filePath), `${importPathWithoutQuotes}.ts`.replace(/\\/g, '/'));
    const fileEntry = tree.get(absoluteImportPath);
    if (fileEntry && fileEntry.path === absoluteImportPath && !importPathWithoutQuotes.includes('\\')) {
      // File exists. Do nothing.
      return;
    }
    const pathFragments = split(<Path>absoluteImportPath).slice(1);
    const newPath: string[] = [];
    let dir = tree.root;
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
      dirname(<Path>filePath),
      newImportPathAbsolute
    );
    if (!newImportPathRelative.startsWith('.')) {
      newImportPathRelative = `./${newImportPathRelative}`;
    }
    if (newImportPathRelative !== importPathWithoutQuotes) {
      transformers.push((transformationContext) => (file) => {
        const visitor = (node: ts.Node): ts.Node => {
          if (ts.isImportDeclaration(node) && node === importDeclaration) {
            return transformationContext.factory.updateImportDeclaration(
              node as ts.ImportDeclaration,
              node.decorators,
              node.modifiers,
              node.importClause,
              transformationContext.factory.createStringLiteral(newImportPathRelative, true),
              node.assertClause
            );
          }
          return ts.visitEachChild(node, visitor, transformationContext);
        };
        return ts.visitNode(file, visitor);
      });
    }
  });
  if (transformers.length > 0) {
    const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
    const result = ts.transform([source], transformers);
    const newContent = printer.printNode(ts.EmitHint.Unspecified, result.transformed[0], undefined as any);
    tree.overwrite(filePath, newContent);
  }
}

async function visitTypescriptFiles(
  tree: Tree
): Promise<void> {
  const {workspace} = await getWorkspace(tree);
  workspace.projects.forEach((project) => {
    tree.getDir(project.root).visit((filePath) => {
      if (filePath.endsWith('.ts')) {
        updateTypescriptImports(filePath, tree);
      }
    });
  });
}

export default function (): Rule {
  return async (tree: Tree) => {
    await visitTypescriptFiles(tree);
  };
}
