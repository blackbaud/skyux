import { Rule, Tree, chain } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { ensurePeersInstalled } from '../../../rules/ensure-peers-installed';

const OLD_PACKAGE = '@circlon/angular-tree-component';
const NEW_PACKAGE = '@blackbaud/angular-tree-component';

function renameTypeScriptImportPaths(): Rule {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);

    for (const [, projectDefinition] of workspace.projects.entries()) {
      tree.getDir(projectDefinition.root).visit((filePath) => {
        if (filePath.match(/\.ts$/)) {
          const source = ts.createSourceFile(
            filePath,
            tree.readText(filePath),
            ts.ScriptTarget.Latest,
            true
          );
          const oldImports = findNodes<ts.ImportDeclaration>(
            source,
            (node): node is ts.ImportDeclaration =>
              ts.isImportDeclaration(node) &&
              ts.isStringLiteral(node.moduleSpecifier) &&
              node.moduleSpecifier.text.startsWith(OLD_PACKAGE)
          );
          if (oldImports.length > 0) {
            const recorder = tree.beginUpdate(filePath);
            oldImports.forEach((node) => {
              const moduleSpecifier = node.moduleSpecifier as ts.StringLiteral;
              recorder.remove(
                moduleSpecifier.getStart() + 1,
                OLD_PACKAGE.length
              );
              recorder.insertLeft(moduleSpecifier.getStart() + 1, NEW_PACKAGE);
            });
            tree.commitUpdate(recorder);
          }
        } else if (filePath.match(/\.s?css$/)) {
          const content = tree.readText(filePath);
          let pos = content.indexOf(OLD_PACKAGE);
          if (pos > -1) {
            const recorder = tree.beginUpdate(filePath);
            do {
              recorder.remove(pos, OLD_PACKAGE.length);
              recorder.insertLeft(pos, NEW_PACKAGE);
              pos = content.indexOf(OLD_PACKAGE, pos + 1);
            } while (pos > -1);
            tree.commitUpdate(recorder);
          }
        }
      });
    }
  };
}

export default function (): Rule {
  return chain([
    renameTypeScriptImportPaths(),
    ensurePeersInstalled(
      '@skyux/angular-tree-component',
      [
        {
          name: '@blackbaud/angular-tree-component',
          version: '1.0.0-alpha.0',
          type: NodeDependencyType.Default,
        },
      ],
      [
        {
          name: '@circlon/angular-tree-component',
        },
      ]
    ),
  ]);
}
