import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import stylesJson from '@blackbaud/skyux-design-tokens/bundles/public-api-styles.json';
import tokensJson from '@blackbaud/skyux-design-tokens/bundles/public-api-tokens.json';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { visitProjectFiles } from '../../../utility/visit-project-files';

import { PublicApiStyle } from './types/public-api-style';
import { PublicApiStyleGroup } from './types/public-api-style-group';
import { PublicApiStyles } from './types/public-api-styles';
import { PublicApiToken } from './types/public-api-token';
import { PublicApiTokenGroup } from './types/public-api-token-group';
import { PublicApiTokens } from './types/public-api-tokens';

const TARGET_EXTENSIONS = new Set(['.html', '.ts', '.js', '.css', '.scss']);

/**
 * Replaces known deprecated CSS classes and custom properties in HTML,
 * TypeScript/JavaScript, and CSS/SCSS files.
 */
export default function (): Rule {
  return buildReplaceRule(buildClassReplacements(), buildTokenReplacements());
}

export function traverseClasses(
  node: { groups?: PublicApiStyleGroup[]; styles?: PublicApiStyle[] },
  result: Record<string, string>,
): void {
  for (const cls of node.styles ?? []) {
    if (cls.className) {
      for (const deprecated of cls.deprecatedClassNames ?? []) {
        result[deprecated] = cls.className;
      }
      for (const obsolete of cls.obsoleteClassNames ?? []) {
        result[obsolete] = cls.className;
      }
    }
  }
  for (const group of node.groups ?? []) {
    traverseClasses(group, result);
  }
}

export function traverseTokens(
  node: { groups?: PublicApiTokenGroup[]; tokens?: PublicApiToken[] },
  result: Record<string, string>,
): void {
  for (const token of node.tokens ?? []) {
    if (token.customProperty) {
      for (const deprecated of token.deprecatedCustomProperties ?? []) {
        result[deprecated] = token.customProperty;
      }
      for (const obsolete of token.obsoleteCustomProperties ?? []) {
        result[obsolete] = token.customProperty;
      }
    }
  }
  for (const group of node.groups ?? []) {
    traverseTokens(group, result);
  }
}

function buildClassReplacements(): Record<string, string> {
  const result: Record<string, string> = {};
  traverseClasses(stylesJson as PublicApiStyles, result);
  return result;
}

function buildTokenReplacements(): Record<string, string> {
  const result: Record<string, string> = {};
  traverseTokens(tokensJson as PublicApiTokens, result);
  return result;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replaces CSS class names or custom properties using boundary-aware matching
 * that accounts for hyphenated names. Ensures `sky-old-class` does not match
 * inside `not-sky-old-class` or `sky-old-class-extended`, and `--sky-old-var`
 * does not match inside `--sky-old-var-extended`. An `includes()` pre-check
 * skips the regex entirely when the name is absent from the content.
 */
function applyReplacements(
  content: string,
  replacements: Record<string, string>,
): string {
  let updated = content;

  for (const [oldName, newName] of Object.entries(replacements)) {
    if (!updated.includes(oldName)) {
      continue;
    }
    const pattern = new RegExp(
      `(?<![\\w-])${escapeRegExp(oldName)}(?![\\w-])`,
      'g',
    );
    updated = updated.replace(pattern, newName);
  }

  return updated;
}

/**
 * Builds a rule that replaces CSS class names and custom properties across all
 * HTML, TypeScript/JavaScript, and CSS/SCSS files in the workspace.
 */
export function buildReplaceRule(
  cssClassReplacements: Record<string, string>,
  customPropertyReplacements: Record<string, string>,
): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);

    workspace.projects.forEach((project) => {
      visitProjectFiles(
        tree,
        project.sourceRoot || project.root,
        (filePath) => {
          const ext = filePath.slice(filePath.lastIndexOf('.'));

          if (!TARGET_EXTENSIONS.has(ext)) {
            return;
          }

          const content = tree.readText(filePath);
          let updated = content;

          updated = applyReplacements(updated, cssClassReplacements);
          updated = applyReplacements(updated, customPropertyReplacements);

          if (updated !== content) {
            tree.overwrite(filePath, updated);
            context.logger.info(`Updated ${filePath}`);
          }
        },
      );
    });
  };
}
