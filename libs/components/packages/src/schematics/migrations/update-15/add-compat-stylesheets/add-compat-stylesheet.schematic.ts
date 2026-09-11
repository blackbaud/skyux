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
      name: '@skyux/tabs',
      components: [
        {
          name: 'vertical-tabset',
          styles: [
            {
              css: `
/* The --sky-comp-* and --sky-space-stacked-* tokens below are declared only
   under .sky-theme-modern, so each var() fallback supplies the corresponding
   default-theme value. One block covers both themes. */
:root {
  --sky-compat-vertical-tabset-content-spacing-xs:
    var(--sky-comp-tab-vertical-content-space-inset-xs-top, 10px)
    var(--sky-comp-tab-vertical-content-space-inset-xs-right, 0)
    var(--sky-comp-tab-vertical-content-space-inset-xs-bottom, 0)
    var(--sky-comp-tab-vertical-content-space-inset-xs-left, 10px);
  --sky-compat-vertical-tabset-content-spacing-sm:
    var(--sky-comp-tab-vertical-content-space-inset-sm-top, 10px)
    var(--sky-comp-tab-vertical-content-space-inset-sm-right, 0)
    var(--sky-comp-tab-vertical-content-space-inset-sm-bottom, 0)
    var(--sky-comp-tab-vertical-content-space-inset-sm-left, 10px);
  --sky-compat-vertical-tabset-content-overflow-y: auto;
  --sky-compat-vertical-tab-content-pane-margin-bottom-xs: var(--sky-space-stacked-s, 0);
}
`,
              instructions: `
Vertical tab content spacing and scrolling are now controlled by the "layout" input on each "sky-vertical-tab" element, matching the "layout" input on "sky-tab". Tabs that do not specify a layout, or that specify "none", no longer receive the previous default padding or vertical scrolling. To address this change, set "layout" on each "sky-vertical-tab" to the value that matches its content ("blocks", "fit", or "list"), then remove this block of code.`,
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
