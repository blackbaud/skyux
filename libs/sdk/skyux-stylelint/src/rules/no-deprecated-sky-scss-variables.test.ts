import stylelint from 'stylelint';
import { describe, expect, it, vi } from 'vitest';

import { testRule } from '../testing/test-rule.js';

import plugin, { ruleName } from './no-deprecated-sky-scss-variables.js';

vi.mock('../utility/style-public-api.js', () => ({
  deprecatedScssVarMap: new Map([
    ['$sky-deprecated-var', '--sky-theme-replacement'],
    ['$sky-deprecated-var-2', '--sky-theme-replacement-2'],
    ['$sky-deprecated-no-replacement', undefined],
  ]),
}));

describe(ruleName, () => {
  testRule({
    plugins: [plugin],
    ruleName,
    config: true,
    fix: true,
    customSyntax: 'postcss-scss',
    accept: [
      {
        code: 'a { margin-top: 8px; }',
        description: 'plain values are allowed',
      },
      {
        code: '$my-own-var: 8px;',
        description: 'non-sky SCSS variables are allowed',
      },
      {
        code: 'a { margin-top: var(--sky-theme-mock-prop); }',
        description: 'CSS custom properties are not matched against this rule',
      },
    ],
    reject: [
      {
        code: 'a { margin-top: $sky-deprecated-var; }',
        description:
          'deprecated $sky- SCSS variable with replacement should error',
        warnings: [
          {
            message:
              '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
          },
        ],
        fixed: 'a { margin-top: var(--sky-theme-replacement); }',
      },
      {
        code: 'a { margin-left: $sky-deprecated-no-replacement; }',
        description:
          'deprecated $sky- SCSS variable with no replacement should error',
        unfixable: true,
        warnings: [
          {
            message:
              '"$sky-deprecated-no-replacement" is deprecated with no direct replacement. See the style API documentation: https://developer.blackbaud.com/skyux/design/styles',
          },
        ],
      },
      {
        code: 'a { margin: $sky-my-custom-variable; }',
        description:
          'unknown $sky- SCSS variables are flagged as private or obsolete',
        warnings: [
          {
            message:
              '"$sky-my-custom-variable" is a private or obsolete SKY UX SCSS variable. To find an alternative, see the style API documentation: https://developer.blackbaud.com/skyux/design/styles',
          },
        ],
        unfixable: true,
      },
      {
        code: 'a { margin: $sky-deprecated-var $sky-deprecated-var-2; }',
        description:
          'multiple deprecated SCSS variables in one declaration should each error and be replaced',
        warnings: [
          {
            message:
              '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
          },
          {
            message:
              '"$sky-deprecated-var-2" is deprecated. Use "var(--sky-theme-replacement-2)" instead.',
          },
        ],
        fixed:
          'a { margin: var(--sky-theme-replacement) var(--sky-theme-replacement-2); }',
      },
    ],
  });

  it('should not report when options are invalid', async () => {
    const result = await stylelint.lint({
      code: 'a { color: red; }',
      config: {
        plugins: [plugin],
        rules: { [ruleName]: ['invalid-value'] },
      },
      customSyntax: 'postcss-scss',
    });
    expect(result.results[0].warnings).toHaveLength(0);
    expect(result.results[0].invalidOptionWarnings).toHaveLength(1);
  });
});
