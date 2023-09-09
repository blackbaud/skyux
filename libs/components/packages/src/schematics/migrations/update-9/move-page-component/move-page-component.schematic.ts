import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { getImports } from '../../../utility/typescript/imports';
import { getWorkspace } from '../../../utility/workspace';

export default function movePageComponent(): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const { workspace } = await getWorkspace(tree);
    let addDependency = false;
    workspace.projects.forEach((project) => {
      const source = project.sourceRoot || `${project.root}/src`;

      // Visit all TypeScript files in each project.
      tree.getDir(source).visit((path) => {
        if (path.endsWith('.ts') && !path.includes('node_modules')) {
          // Parse the TypeScript file.
          const source = ts.createSourceFile(
            path,
            tree.readText(path),
            ts.ScriptTarget.Latest,
            true
          );

          // Find all imports of SkyPageComponent from @skyux/layout.
          const componentImports = getImports(
            source,
            new Map([['@skyux/layout', ['SkyPageComponent']]])
          );

          // Found one.
          if (componentImports.length > 0) {
            // We'll need to add the dependency to @skyux/pages.
            addDependency = true;

            // Angular uses a change recorder and the magic string library.
            const insertRecorder = tree.beginUpdate(path);

            // Add the new import.
            const change = insertImport(
              source,
              path,
              'SkyPageComponent',
              '@skyux/pages'
            ) as InsertChange;
            insertRecorder.insertRight(change.pos, change.toAdd);

            // Commit the update.
            tree.commitUpdate(insertRecorder);

            const removeRecorder = tree.beginUpdate(path);
            componentImports.forEach((componentImport: ts.ImportSpecifier) => {
              // Is anything else imported from @skyux/layout?
              if (componentImport.parent.elements.length > 1) {
                // Yes. Remove only the SkyPageComponent import.
                const index = componentImport.parent.elements.findIndex(
                  (element) => element.name.getText() === 'SkyPageComponent'
                );

                // Find the start and end of the SkyPageComponent import.
                let importStart: number;
                let importEnd: number;
                if (index > 0) {
                  // Not the first import.
                  // Remove text from the end of the previous import to the end of the SkyPageComponent import.
                  importStart = (
                    componentImport.parent.elements.at(
                      index - 1
                    ) as ts.ImportSpecifier
                  ).getEnd();
                  importEnd = (
                    componentImport.parent.elements.at(
                      index
                    ) as ts.ImportSpecifier
                  ).getEnd();
                } else {
                  // First import.
                  // Remove text from the start of the SkyPageComponent import to the start of the next import.
                  importStart = (
                    componentImport.parent.elements.at(
                      index
                    ) as ts.ImportSpecifier
                  ).getStart();
                  importEnd = (
                    componentImport.parent.elements.at(
                      index + 1
                    ) as ts.ImportSpecifier
                  ).getStart();
                }

                // Remove the SkyPageComponent import.
                removeRecorder.remove(importStart, importEnd - importStart);
              } else {
                // No. Remove the whole import declaration.
                const importDeclaration = componentImport.parent.parent.parent;
                removeRecorder.remove(
                  importDeclaration.getFullStart(),
                  importDeclaration.getFullWidth()
                );
              }
            });

            // Commit the update.
            tree.commitUpdate(removeRecorder);
          }
        } else if (
          path.endsWith('.component.html') &&
          !path.includes('node_modules')
        ) {
          // Update <sky-page layout="auto"> to remove the layout attribute.
          const content = tree.readText(path);
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
