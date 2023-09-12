import { Rule, Tree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { getWorkspace } from '@schematics/angular/utility/workspace';

export default function (): Rule {
  return async (tree: Tree) => {
    const oldImportPath = 'rxjs/internal/operators';
    const newImportPath = 'rxjs/operators';
    const workspace = await getWorkspace(tree);
    workspace.projects.forEach((project) => {
      tree.getDir(project.root).visit((path) => {
        if (path.endsWith('.ts')) {
          const source = ts.createSourceFile(
            path,
            tree.readText(path),
            ts.ScriptTarget.Latest,
            true
          );
          const imports = findNodes<ts.ImportDeclaration>(
            source,
            (node): node is ts.ImportDeclaration =>
              ts.isImportDeclaration(node) &&
              ts.isStringLiteral(node.moduleSpecifier) &&
              node.moduleSpecifier.text.startsWith(oldImportPath)
          );
          const recorder = tree.beginUpdate(path);
          imports.forEach((node) => {
            const moduleSpecifier = node.moduleSpecifier;
            recorder.remove(
              moduleSpecifier.getStart() + 1,
              moduleSpecifier.getWidth() - 2
            );
            recorder.insertLeft(moduleSpecifier.getStart() + 1, newImportPath);
          });
          tree.commitUpdate(recorder);
        }
      });
    });
  };
}
