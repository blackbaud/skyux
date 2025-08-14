import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { visitProjectFiles } from '../../../utility/visit-project-files';

function replaceDisabledClassInFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
): void {
  const content = tree.readText(filePath);

  // Check if the file contains sky-btn-disabled class usage
  if (content.includes('sky-btn-disabled')) {
    const recorder = tree.beginUpdate(filePath);
    let updatedContent = content;
    let hasChanges = false;

    // Pattern 1: Replace class="sky-btn-disabled" with [disabled]="true"
    // Also handles multiple classes like class="sky-btn sky-btn-disabled"
    const classPattern =
      /([^>]*)class="([^"]*\s?)sky-btn-disabled(\s[^"]*)?"([^>]*>)/g;
    updatedContent = updatedContent.replace(
      classPattern,
      (match, beforeClass, beforeDisabled, afterDisabled, afterQuote) => {
        hasChanges = true;
        const cleanedClasses = (
          beforeDisabled.trim() + (afterDisabled || '')
        ).trim();
        const classAttr = (
          cleanedClasses ? ` class="${cleanedClasses}"` : ''
        ).trim();

        // Check if [disabled] attribute already exists before or after class
        const hasDisabledAttribute =
          beforeClass.includes('[disabled]') ||
          beforeClass.includes('disabled=') ||
          afterQuote.includes('[disabled]') ||
          afterQuote.includes('disabled=');

        if (hasDisabledAttribute) {
          // If disabled attribute already exists, just remove the sky-btn-disabled class
          return `${beforeClass}${classAttr}${afterQuote}`.trim();
        } else {
          // Add the disabled attribute
          return (
            beforeClass +
            (classAttr ? classAttr + ' ' : '') +
            `[disabled]="true"${afterQuote}`
          );
        }
      },
    );

    // Pattern 2: Replace [class.sky-btn-disabled]="condition" with [disabled]="condition"
    const classBindingPattern = /\[class\.sky-btn-disabled\]="([^"]+)"/g;
    updatedContent = updatedContent.replace(
      classBindingPattern,
      (match, condition) => {
        hasChanges = true;
        return `[disabled]="${condition}"`;
      },
    );

    // Pattern 3: Replace ngClass with sky-btn-disabled
    const ngClassPattern =
      /([^>]*)\[ngClass\]="(\{[^}]*'sky-btn-disabled':\s*([^,}]+)[^}]*\})"([^>]*>)/g;
    updatedContent = updatedContent.replace(
      ngClassPattern,
      (match, beforeNgClass, objectExpression, condition, afterNgClass) => {
        hasChanges = true;

        // Remove the sky-btn-disabled property from the object
        const cleanedObject = objectExpression
          .replace(/\s*'sky-btn-disabled':\s*[^,}]+,?/g, '')
          .replace(/,\s*}/g, '}')
          .trim();

        // Check if [disabled] attribute already exists before or after ngClass
        const hasDisabledAttribute =
          beforeNgClass.includes('[disabled]') ||
          beforeNgClass.includes('disabled=') ||
          afterNgClass.includes('[disabled]') ||
          afterNgClass.includes('disabled=');

        // If the object is now empty or only has whitespace
        if (cleanedObject === '{}' || cleanedObject.match(/^\{\s*\}$/)) {
          if (hasDisabledAttribute) {
            // Just remove the ngClass entirely since disabled already exists
            return beforeNgClass + afterNgClass;
          } else {
            // Replace ngClass with disabled attribute
            return `${beforeNgClass}[disabled]="${condition.trim()}"${afterNgClass}`;
          }
        } else {
          // Object still has other properties
          if (hasDisabledAttribute) {
            // Keep the cleaned ngClass but don't add disabled
            return `${beforeNgClass}[ngClass]="${cleanedObject}"${afterNgClass}`;
          } else {
            // Add both the disabled attribute and the cleaned ngClass
            return `${beforeNgClass}[disabled]="${condition.trim()}" [ngClass]="${cleanedObject}"${afterNgClass}`;
          }
        }
      },
    );

    // Only update if there were actual changes
    if (hasChanges && updatedContent !== content) {
      recorder.remove(0, content.length);
      recorder.insertLeft(0, updatedContent);
      tree.commitUpdate(recorder);

      context.logger.info(
        `Replaced sky-btn-disabled class with [disabled] attribute in ${filePath}`,
      );
    }
  }
}

export default function (): Rule {
  return async (tree, context) => {
    context.logger.info(
      'Replacing sky-btn-disabled class with [disabled] attribute in all HTML templates...',
    );

    const workspace = await getWorkspace(tree);

    workspace.projects.forEach((project) => {
      visitProjectFiles(
        tree,
        project.sourceRoot || project.root,
        (filePath) => {
          // Process HTML template files
          if (filePath.endsWith('.html')) {
            replaceDisabledClassInFile(tree, filePath, context);
          }
        },
      );
    });

    context.logger.info(
      'Finished replacing sky-btn-disabled class with [disabled] attribute',
    );
  };
}
