import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { Rule, Tree, chain } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../../utility/tree';
import { getWorkspace, updateWorkspace } from '../../../utility/workspace';

const COMPAT_CSS_FILE_NAME = 'skyux8-compat.css';

const compatStyles = {
  libraries: [
    {
      name: '@skyux/forms',
      components: [
        {
          name: 'selection box',
          styles: [
            {
              css: `
:root {
  --sky-compat-selection-box-grid-margin-bottom: 0;
}
`,
              instructions: `
The bottom margin for the \`sky-selection-box-grid\` has been changed to compensate for the spacing applied to its child \`sky-selection-box\` components. To address this, remove this block of CSS and address any spacing issues by adding the appropriate margin class to the selection box grid. See https://developer.blackbaud.com/skyux/design/styles/spacing for a list of supported spacing classes.`,
            },
          ],
        },
      ],
    },
    {
      name: '@skyux/layout',
      components: [
        {
          name: 'action button',
          styles: [
            {
              css: `
:root {
  --sky-compat-action-button-flex-margin: 0;
  --sky-compat-action-button-flex-sm-padding: 10px;
}
`,
              instructions: `
The top and bottom margins have been removed from the \`sky-action-button-container\` component. To address this, remove this block of CSS and address any spacing issues by adding the appropriate margin class to the action button container. See https://developer.blackbaud.com/skyux/design/styles/spacing for a list of supported spacing classes.`,
            },
          ],
        },
        {
          name: 'text expand repeater',
          styles: [
            {
              css: `
:root {
  --sky-compat-text-expand-repeater-margin-top: unset;
}
`,
              instructions: `
The top margin has been removed from the \`sky-text-expand-repeater\` component. To address this, remove this block of CSS and address any spacing issues by adding the appropriate margin class to the element above each text expand repeater or padding class to each text expand repeater's parent element. See https://developer.blackbaud.com/skyux/design/styles/spacing for a list of supported spacing classes.`,
            },
          ],
        },
      ],
    },
  ],
};

function getProjectSourcePath(projectDefinition: ProjectDefinition): string {
  /*istanbul ignore else*/
  if (projectDefinition.sourceRoot) {
    return `${projectDefinition.sourceRoot}/app`;
  } else {
    return `${projectDefinition.root}/src/app`;
  }
}

function buildCommentBlock(message: string): string {
  return `/${'*'.repeat(79)}
 * ${message.replace(/(?![^\n]{1,75}$)([^\n]{1,75})\s/g, '$1\n * ')}
 ${'*'.repeat(79)}/`;
}

function buildComponentCss(component: {
  name: string;
  styles: { css: string; instructions: string }[];
}): string {
  let contents = buildCommentBlock(
    `COMPONENT: ${component.name.toUpperCase()}`
  );

  for (const style of component.styles) {
    contents += `

${buildCommentBlock(style.instructions.trim())}

${style.css.trim()}
`;
  }

  return contents;
}

function writeStylesheet(sourceRoot: string, contents: string): Rule {
  const filePath = `${sourceRoot}/${COMPAT_CSS_FILE_NAME}`;

  return (tree) => {
    if (tree.exists(filePath)) {
      tree.overwrite(filePath, contents);
    } else {
      tree.create(filePath, contents);
    }
  };
}

function addStylesheetToWorkspace(): Rule {
  return () =>
    updateWorkspace((workspace) => {
      for (const project of workspace.projects.values()) {
        for (const targetName of ['build', 'test']) {
          if (project.extensions.projectType === 'application') {
            const target = project.targets.get(targetName);
            const sourceRoot = getProjectSourcePath(project);
            const filePath = `${sourceRoot}/${COMPAT_CSS_FILE_NAME}`;

            /* istanbul ignore else */
            if (target && target.options) {
              const styles = (target.options.styles = (target.options.styles ||
                []) as string[]);

              if (!styles.includes(filePath)) {
                styles.push(filePath);
              }
            }
          }
        }
      }
    });
}

function getCompatStyles(tree: Tree): string | undefined {
  let contents = '';

  const packageJson: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  } = JSON.parse(readRequiredFile(tree, '/package.json'));

  for (const library of compatStyles.libraries) {
    if (
      packageJson.dependencies?.[library.name] ||
      packageJson.devDependencies?.[library.name]
    ) {
      for (const component of library.components) {
        contents += `
${buildComponentCss(component)}`;
      }
    }
  }

  return contents
    ? `${buildCommentBlock(
        `TODO: The following component libraries introduced visual breaking changes in SKY UX 8. Each block of CSS reintroduces the styles that were changed or removed for backwards compatibility. You will need to do the following before migrating to the next major version of SKY UX:
- Address each of the changes by following the instructions
  in each block of CSS, then remove the block.
- Delete this file after all blocks have been addressed.
- Remove each occurrence of this file in your project's
  angular.json file.`
      )}
${contents}`
    : undefined;
}

export default function (): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);
    const styles = getCompatStyles(tree);
    const rules: Rule[] = [];

    for (const [, projectDefinition] of workspace.projects.entries()) {
      if (projectDefinition.extensions.projectType === 'application') {
        if (styles) {
          const sourcePath = getProjectSourcePath(projectDefinition);
          rules.push(writeStylesheet(sourcePath, styles));
        }
      }
    }

    if (styles) {
      rules.push(addStylesheetToWorkspace());
    }

    return chain(rules);
  };
}
