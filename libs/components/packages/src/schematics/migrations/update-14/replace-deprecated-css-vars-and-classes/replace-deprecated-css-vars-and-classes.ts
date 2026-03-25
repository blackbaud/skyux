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
  traverseClasses(stylesJson as unknown as PublicApiStyles, result);
  return result;
}

function buildTokenReplacements(): Record<string, string> {
  const result: Record<string, string> = {};
  traverseTokens(tokensJson as unknown as PublicApiTokens, result);
  return result;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replaces CSS class names using word-boundary-aware matching that accounts for
 * hyphenated class names. Ensures `sky-old-class` does not match inside
 * `not-sky-old-class` or `sky-old-class-extended`.
 */
function applyClassReplacements(
  content: string,
  replacements: Record<string, string>,
): string {
  let updated = content;

  for (const [oldClass, newClass] of Object.entries(replacements)) {
    const pattern = new RegExp(
      `(?<![\\w-])${escapeRegExp(oldClass)}(?![\\w-])`,
      'g',
    );
    updated = updated.replace(pattern, newClass);
  }

  return updated;
}

/**
 * Replaces CSS custom property names using boundary-aware matching. Uses the
 * same lookaround strategy as class replacements to prevent `--sky-old-var`
 * from matching inside `--sky-old-var-extended`.
 */
function applyCustomPropertyReplacements(
  content: string,
  replacements: Record<string, string>,
): string {
  let updated = content;

  for (const [oldProp, newProp] of Object.entries(replacements)) {
    const pattern = new RegExp(
      `(?<![\\w-])${escapeRegExp(oldProp)}(?![\\w-])`,
      'g',
    );
    updated = updated.replace(pattern, newProp);
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

          updated = applyClassReplacements(updated, cssClassReplacements);
          updated = applyCustomPropertyReplacements(
            updated,
            customPropertyReplacements,
          );

          if (updated !== content) {
            const recorder = tree.beginUpdate(filePath);
            recorder.remove(0, content.length);
            recorder.insertLeft(0, updated);
            tree.commitUpdate(recorder);

            context.logger.info(`Updated ${filePath}`);
          }
        },
      );
    });
  };
}
