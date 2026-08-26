import { Rule, Tree, chain } from '@angular-devkit/schematics';
import {
  ProjectDefinition,
  updateWorkspace,
} from '@schematics/angular/utility';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { VERSION } from '../../../../version';
import { readRequiredFile } from '../../../utility/tree';
import { getSourceRoot } from '../../../utility/workspace';

const COMPAT_CSS_FILE_NAME = `skyux${VERSION.major}-compat.css`;

interface CompatStyle {
  libraries: {
    name: string;
    components: {
      name: string;
      styles: { css: string; instructions: string }[];
    }[];
  }[];
}

const compatStyles: CompatStyle = {
  libraries: [
    {
      name: '@skyux/theme',
      components: [
        {
          name: 'button',
          styles: [
            {
              css: `
:root {
  --sky-compat-btn-disabled-pointer-events: none;
}
`,
              instructions: `
Pointer events are no longer disabled on elements with the "sky-btn-disabled" class or the "disabled" attribute. To address this change, remove this block of code, then either add the "disabled" attribute to the element (preferred) or update any click and keyboard handlers to ignore interaction while the element is disabled.`,
            },
          ],
        },
      ],
    },
    {
      name: '@skyux/layout',
      components: [
        {
          name: 'toolbar',
          styles: [
            {
              css: `
:root {
  --sky-compat-toolbar-container-padding: var(--sky-comp-toolbar-space-inset-top)
    var(--sky-comp-toolbar-space-inset-right)
    var(--sky-comp-toolbar-space-inset-bottom)
    var(--sky-comp-toolbar-space-inset-left);
}
`,
              instructions: `
The toolbar no longer applies its own left, right, and top padding unless it is inside a page or tab with layout="list". Everywhere else it now inherits the padding of its container, so that its contents line up with the content above and below it. To address this change, remove this block of code, then remove any negative margins or spacing overrides your app applied to compensate for the toolbar's extra padding.`,
            },
          ],
        },
      ],
    },
    {
      name: '@skyux/filter-bar',
      components: [
        {
          name: 'filter bar',
          styles: [
            {
              css: `
:root {
  --sky-compat-filter-bar-toolbar-padding: var(--sky-comp-filter_bar-space-inset-top)
    var(--sky-comp-filter_bar-space-inset-right)
    var(--sky-comp-filter_bar-space-inset-bottom)
    var(--sky-comp-filter_bar-space-inset-left);
}
`,
              instructions: `
The filter bar no longer applies its own left, right, and top padding unless it is inside a page or tab with layout="list". Everywhere else it now inherits the padding of its container, so that its filters line up with the content above and below it. To address this change, remove this block of code, then remove any negative margins or spacing overrides your app applied to compensate for the filter bar's extra padding.`,
            },
          ],
        },
      ],
    },
    {
      name: '@skyux/lists',
      components: [
        {
          name: 'list summary',
          styles: [
            {
              css: `
:root {
  --sky-compat-list-summary-padding: var(--sky-comp-list_summary-space-inset-top)
    var(--sky-comp-list_summary-space-inset-right)
    var(--sky-comp-list_summary-space-inset-bottom)
    var(--sky-comp-list_summary-space-inset-left);
}
`,
              instructions: `
The list summary no longer applies its own left and right padding unless it is inside a page or tab with layout="list". Everywhere else it now inherits the padding of its container, so that its summary items line up with the content above and below it. Its top and bottom padding is unchanged. To address this change, remove this block of code, then remove any negative margins or spacing overrides your app applied to compensate for the list summary's extra padding.`,
            },
          ],
        },
      ],
    },
  ],
};

function getProjectAppPath(project: ProjectDefinition): string {
  return `${getSourceRoot(project)}/app`;
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
    `COMPONENT: ${component.name.toUpperCase()}`,
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

function addStylesheetToStylesArray(
  styles: string[] | undefined,
  filePath: string,
): void {
  if (styles && !styles.includes(filePath)) {
    styles.push(filePath);
  }
}

function addStylesheetToWorkspace(): Rule {
  return () =>
    updateWorkspace((workspace) => {
      for (const project of workspace.projects.values()) {
        for (const targetName of ['build', 'test']) {
          if (project.extensions['projectType'] === 'application') {
            const target = project.targets.get(targetName);
            const sourceRoot = getProjectAppPath(project);
            const filePath = `${sourceRoot}/${COMPAT_CSS_FILE_NAME}`;

            /* istanbul ignore else */
            if (target && target.options) {
              target.options['styles'] ??= [];

              addStylesheetToStylesArray(
                target.options['styles'] as string[],
                filePath,
              );

              // A configuration's `styles` array replaces (rather than
              // merges with) the target's base `styles` array, so any
              // configuration that already declares its own `styles` needs
              // the compatibility stylesheet appended too.
              for (const configuration of Object.values(
                target.configurations ?? {},
              )) {
                addStylesheetToStylesArray(
                  configuration?.['styles'] as string[] | undefined,
                  filePath,
                );
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
        `TODO: The following component libraries introduced visual breaking ` +
          `changes in SKY UX ${VERSION.major}. Each block of CSS reintroduces ` +
          `the styles that were changed or removed for backward compatibility. ` +
          `You will need to do the following before migrating to the next major ` +
          `version of SKY UX:
- Address each of the changes by following the instructions
  in each block of CSS, then remove the block.
- Delete this file after all blocks have been addressed.
- Remove each occurrence of this file in your project's
  angular.json file.`,
      )}
${contents}`
    : undefined;
}

export default function (): Rule {
  return async (tree) => {
    const workspace = await getWorkspace(tree);
    const styles = getCompatStyles(tree);
    const rules: Rule[] = [];

    for (const [, projectDefinition] of workspace.projects.entries()) {
      if (projectDefinition.extensions['projectType'] === 'application') {
        if (styles) {
          const sourcePath = getProjectAppPath(projectDefinition);
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
