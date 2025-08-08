import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { visitProjectFiles } from '../../utility/visit-project-files';

function replaceCustomPropertyInFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
  oldCustomProperty: string,
  newCustomProperty: string,
): void {
  const content = tree.readText(filePath);

  // Check if the old custom property exists in the file
  if (content.includes(oldCustomProperty)) {
    const recorder = tree.beginUpdate(filePath);

    // Replace all occurrences of the old custom property with the new one
    const updatedContent = content.replace(
      new RegExp(
        oldCustomProperty.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
        'g',
      ),
      newCustomProperty,
    );

    // Only update if there were actual changes
    if (updatedContent !== content) {
      recorder.remove(0, content.length);
      recorder.insertLeft(0, updatedContent);
      tree.commitUpdate(recorder);

      context.logger.info(
        `Replaced ${oldCustomProperty} with ${newCustomProperty} in ${filePath}`,
      );
    }
  }
}

export function replaceCustomProperty(
  oldCustomProperty: string,
  newCustomProperty: string,
): Rule {
  return async (tree, context) => {
    context.logger.info(
      `Replacing ${oldCustomProperty} with ${newCustomProperty} in all workspace files...`,
    );

    const workspace = await getWorkspace(tree);

    workspace.projects.forEach((project) => {
      visitProjectFiles(
        tree,
        project.sourceRoot || project.root,
        (filePath) => {
          // Process TypeScript and SCSS files
          if (filePath.endsWith('.ts') || filePath.endsWith('.scss')) {
            replaceCustomPropertyInFile(
              tree,
              filePath,
              context,
              oldCustomProperty,
              newCustomProperty,
            );
          }
        },
      );
    });

    context.logger.info(
      `Finished replacing ${oldCustomProperty} with ${newCustomProperty}`,
    );
  };
}
