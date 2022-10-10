import { Rule, chain } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';
import { updateWorkspace } from '../../utility/workspace';

const SKYUX7_COMPAT_CSS_PATH = '/src/app/skyux7-compat.css';

const compatStyles = {
  libraries: [
    {
      name: '@skyux/indicators',
      components: [
        {
          name: 'alert',
          styles: [
            {
              css: `
.sky-alert {
  margin-bottom: 20px;
}`,
              instructions: `
The preset bottom margin has been removed from alert components. To implement the newly-recommended spacing, add the \`sky-margin-stacked-lg\` CSS class to each \`sky-alert\` component in your application, then remove this block.`,
            },
          ],
        },
      ],
    },
  ],
};

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

function writeStylesheet(contents: string): Rule {
  return (tree) => {
    if (tree.exists(SKYUX7_COMPAT_CSS_PATH)) {
      tree.overwrite(SKYUX7_COMPAT_CSS_PATH, contents);
    } else {
      tree.create(SKYUX7_COMPAT_CSS_PATH, contents);
    }
  };
}

function addStylesheetToWorkspace(): Rule {
  return () =>
    updateWorkspace((workspace) => {
      for (const project of workspace.projects.values()) {
        for (const targetName of ['build', 'test']) {
          // Ignore build target for libraries.
          if (
            !(
              targetName === 'build' &&
              project.extensions.projectType === 'library'
            )
          ) {
            const target = project.targets.get(targetName);

            /* istanbul ignore else */
            if (target && target.options) {
              const styles = (target.options.styles = (target.options.styles ||
                []) as string[]);

              if (!styles.includes(SKYUX7_COMPAT_CSS_PATH)) {
                styles.push(SKYUX7_COMPAT_CSS_PATH);
              }
            }
          }
        }
      }
    });
}

export default function (): Rule {
  return (tree) => {
    const packageJson: {
      dependencies?: { [_: string]: string };
      devDependencies?: { [_: string]: string };
    } = JSON.parse(readRequiredFile(tree, '/package.json'));

    let contents = '';

    for (const library of compatStyles.libraries) {
      if (
        packageJson.dependencies?.[library.name] ||
        packageJson.devDependencies?.[library.name]
      ) {
        for (const component of library.components) {
          contents += buildComponentCss(component);
        }
      }
    }

    const rules: Rule[] = [];

    if (contents) {
      contents = `${buildCommentBlock(
        `TODO: The following componnent libraries introduced visual breaking changes in SKY UX 7. Each block of CSS reintroduces the styles that were changed or removed for backwards compatibility. You will need to do the following before migrating to the next major version of SKY UX:
- Address each of the changes by following the instructions
  in each block of CSS, then remove the block.
- Delete this file after all blocks have been addressed.
- Remove each occurrence of this file in your project's
  angular.json file.`
      )}

${contents}`;

      rules.push(writeStylesheet(contents), addStylesheetToWorkspace());
    }

    return chain(rules);
  };
}
