import type { TSESTree } from '@typescript-eslint/utils';
import { type RuleContext } from '@typescript-eslint/utils/ts-eslint';

import { createESLintRule } from './utils/create-eslint-rule';
import {
  WHITELISTED_SKY_CLASSES,
  deprecatedStyleClassMap,
  validPublicClassNames,
} from './utils/style-public-api';

export const RULE_NAME = 'no-invalid-sky-classnames';

const STYLE_API_DOCS_URL =
  'https://developer.blackbaud.com/skyux/design/styles';

function extractSkyClassNames(value: string): string[] {
  const matches = value.match(/sky-[a-z0-9-]+/g);
  return matches ?? [];
}

function isInlineTemplate(node: TSESTree.Literal): boolean {
  return (
    node.parent.type === 'Property' &&
    node.parent.key.type === 'Identifier' &&
    node.parent.key.name === 'template'
  );
}

function checkClassName(
  className: string,
  fixedClassNames: string[],
  node: TSESTree.Literal,
  context: RuleContext<string, readonly unknown[]>,
): void {
  if (className.startsWith('sky-theme-')) {
    if (!validPublicClassNames.has(className)) {
      context.report({
        node,
        messageId: 'unknownThemeClass',
        data: { className },
      });
    }
    return;
  }

  if (deprecatedStyleClassMap.has(className)) {
    const replacement = deprecatedStyleClassMap.get(className);
    if (replacement) {
      const index = fixedClassNames.indexOf(className);
      if (index > -1) {
        fixedClassNames[index] = replacement;
      }
      context.report({
        node,
        messageId: 'deprecatedWithReplacement',
        data: { className, replacement },
        fix(fixer) {
          const [start, end] = node.range;
          const quote = context.sourceCode.getText(node)[0];
          return fixer.replaceTextRange(
            [start, end],
            `${quote}${fixedClassNames.join(' ')}${quote}`,
          );
        },
      });
    } else {
      context.report({
        node,
        messageId: 'deprecatedNoReplacement',
        data: { className, docsUrl: STYLE_API_DOCS_URL },
      });
    }
    return;
  }

  if (!WHITELISTED_SKY_CLASSES.has(className)) {
    context.report({ node, messageId: 'privateClass', data: { className } });
  }
}

export const rule = createESLintRule({
  create(context) {
    if (context.filename.endsWith('.spec.ts')) {
      return {};
    }

    return {
      ['Literal'](node: TSESTree.Literal): void {
        if (typeof node.value !== 'string' || isInlineTemplate(node)) {
          return;
        }

        const classNames = extractSkyClassNames(node.value);

        if (classNames.length === 0) {
          return;
        }

        const fixedClassNames = node.value.split(/\s+/).filter(Boolean);

        for (const className of classNames) {
          checkClassName(className, fixedClassNames, node, context);
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Validates sky- CSS class usage against the SKY UX style public API.',
    },
    messages: {
      deprecatedWithReplacement:
        '"{{className}}" is deprecated. Use "{{replacement}}" instead.',
      deprecatedNoReplacement:
        '"{{className}}" is deprecated with no direct replacement. See the style API documentation: {{docsUrl}}',
      unknownThemeClass: `"{{className}}" is not a known sky-theme- class. See the style API documentation for valid class names: ${STYLE_API_DOCS_URL}`,
      privateClass: `"{{className}}" is a private SKY UX class and should not be used directly. See the style API documentation for alternatives: ${STYLE_API_DOCS_URL}`,
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
