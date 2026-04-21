import type { TSESTree } from '@typescript-eslint/utils';
import { type RuleContext } from '@typescript-eslint/utils/ts-eslint';

import { createESLintRule } from './utils/create-eslint-rule';
import {
  SKY_CLASSNAME_MESSAGES,
  STYLE_API_DOCS_URL,
  checkSkyClassName,
} from './utils/style-public-api';

export const RULE_NAME = 'no-invalid-sky-classnames';

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
  const result = checkSkyClassName(className);

  if (result.type === 'valid') {
    return;
  }

  if (result.type === 'unknownThemeClass') {
    context.report({
      node,
      messageId: 'unknownThemeClass',
      data: { className, docsUrl: STYLE_API_DOCS_URL },
    });
    return;
  }

  if (result.type === 'deprecatedWithReplacement') {
    const { replacement } = result;
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
    return;
  }

  if (result.type === 'deprecatedNoReplacement') {
    context.report({
      node,
      messageId: 'deprecatedNoReplacement',
      data: { className, docsUrl: STYLE_API_DOCS_URL },
    });
    return;
  }

  context.report({
    node,
    messageId: 'privateClass',
    data: { className, docsUrl: STYLE_API_DOCS_URL },
  });
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
    messages: SKY_CLASSNAME_MESSAGES,
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
