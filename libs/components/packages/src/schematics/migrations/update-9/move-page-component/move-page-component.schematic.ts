import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

function getImportNames(importDeclaration: ts.ImportDeclaration): string[] {
  return (
    importDeclaration.importClause?.namedBindings as ts.NamedImports
  ).elements
    .map((element) => element.name.getText())
    .sort();
}

export default function movePageComponent(): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const { workspace } = await getWorkspace(tree);
    let addDependency = false;
    workspace.projects.forEach((project) => {
      const source = project.sourceRoot || `${project.root}/src`;

      // Visit all TypeScript files in each project.
      visitProjectFiles(tree, source, (path) => {
        if (path.endsWith('.ts')) {
          // Parse the TypeScript file.
          const source = ts.createSourceFile(
            path,
            tree.readText(path),
            ts.ScriptTarget.Latest,
            true,
          );

          // Find all imports of SkyPageLayoutType and SkyPageModule from @skyux/layout.
          const importsToMove = ['SkyPageLayoutType', 'SkyPageModule'];
          const pageImports = findNodes<ts.ImportDeclaration>(
            source,
            (node): node is ts.ImportDeclaration => {
              return (
                ts.isImportDeclaration(node) &&
                ts.isStringLiteral(node.moduleSpecifier) &&
                node.moduleSpecifier.text.startsWith('@skyux/layout') &&
                !!node.importClause?.namedBindings &&
                ts.isNamedImports(node.importClause.namedBindings) &&
                node.importClause.namedBindings.elements.some((element) =>
                  importsToMove.includes(element.name.getText()),
                )
              );
            },
          );

          // Found one.
          if (pageImports.length > 0) {
            // We'll need to add the dependency to @skyux/pages.
            addDependency = true;

            // Angular uses a change recorder and the magic string library.
            const updateRecorder = tree.beginUpdate(path);
            const importsToAdd = pageImports
              .map((pageImport) =>
                getImportNames(pageImport).filter((importName) =>
                  importsToMove.includes(importName),
                ),
              )
              .flat();

            pageImports.forEach((importToUpdate: ts.ImportDeclaration) => {
              const otherImports = getImportNames(importToUpdate).filter(
                (importName) => !importsToMove.includes(importName),
              );
              // Is anything else imported from @skyux/layout?
              if (
                otherImports.length > 0 &&
                importToUpdate.importClause?.namedBindings
              ) {
                // Yes. Update the import.
                updateRecorder.remove(
                  importToUpdate.importClause.namedBindings.getStart(),
                  importToUpdate.importClause.namedBindings.getWidth(),
                );
                updateRecorder.insertLeft(
                  importToUpdate.importClause.namedBindings.getStart(),
                  `{ ${otherImports.join(', ')} }`,
                );
              } else {
                // No. Remove the whole import declaration.
                updateRecorder.remove(
                  importToUpdate.getFullStart(),
                  importToUpdate.getFullWidth(),
                );
              }
            });

            // Commit the update and parse the file again.
            tree.commitUpdate(updateRecorder);

            // Add the new import.
            const updatedSource = ts.createSourceFile(
              path,
              tree.readText(path),
              ts.ScriptTarget.Latest,
              true,
            );
            const recorder = tree.beginUpdate(path);
            const change = insertImport(
              updatedSource,
              path,
              importsToAdd.join(', '),
              '@skyux/pages',
            ) as InsertChange;
            recorder.insertLeft(change.pos, change.toAdd);
            tree.commitUpdate(recorder);
          }
        } else if (path.endsWith('.component.html')) {
          // Update <sky-page layout="auto"> to remove the layout attribute.
          const content = tree.readText(path);
          // Based on code search, any use of `layout="auto"` matches this pattern.
          const search = '<sky-page layout="auto"';
          const skyPageIndex = content.indexOf(search);
          if (skyPageIndex > -1) {
            const recorder = tree.beginUpdate(path);
            // Remove ' layout="auto"'.
            recorder.remove(skyPageIndex + 9, 14);
            tree.commitUpdate(recorder);
          }
        }
      });
    });

    // Add the dependency to @skyux/pages.
    if (addDependency) {
      const pages = getPackageJsonDependency(tree, '@skyux/pages');
      if (!pages) {
        const layout = getPackageJsonDependency(tree, '@skyux/layout');
        if (layout) {
          addPackageJsonDependency(tree, {
            type: NodeDependencyType.Default,
            name: '@skyux/pages',
            version: layout.version,
          });
          context.addTask(new NodePackageInstallTask());
        }
      }
    }
  };
}
