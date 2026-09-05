import stylelint, { Rule, RuleBase } from 'stylelint';
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
      {
        code: 'a { margin-top: 8px /* $sky-deprecated-var */; }',
        description:
          'a $sky- variable that only appears inside a comment is ignored',
      },
      {
        code: 'a { background: url(/*); }',
        description:
          'a "/*" with no closing "*/" (e.g. in an unquoted url) must not hang the comment scanner; the rest of the value is treated as commented',
      },
      {
        code: String.raw`a { content: \" /* $sky-deprecated-var */; }`,
        description:
          'an escaped quote outside a string does not start a string, so the comment after it still hides the variable',
      },
    ],
    reject: [
      {
        code: 'a { margin: "/*" $sky-deprecated-var; }',
        description:
          'a "/*" inside a quoted string is not a comment, so a variable after it is still detected',
        warnings: [
          {
            message:
              '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
          },
        ],
        fixed: 'a { margin: "/*" var(--sky-theme-replacement); }',
      },
      {
        code: String.raw`a { margin: "\"/*" $sky-deprecated-var; }`,
        description:
          'an escaped quote inside a string does not end the string, so its "/*" is not a comment and a variable after it is still detected',
        warnings: [
          {
            message:
              '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
          },
        ],
        fixed: String.raw`a { margin: "\"/*" var(--sky-theme-replacement); }`,
      },
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
      {
        code: 'a { color: variables.$sky-deprecated-var; }',
        description:
          'a namespaced deprecated SCSS variable should have the namespace removed by the fix',
        warnings: [
          {
            message:
              '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
          },
        ],
        fixed: 'a { color: var(--sky-theme-replacement); }',
      },
      {
        code: 'a { margin: $sky-deprecated-var-2 $sky-deprecated-var; }',
        description:
          'an overlapping variable name earlier in the value should not be corrupted when fixing a later variable',
        warnings: [
          {
            message:
              '"$sky-deprecated-var-2" is deprecated. Use "var(--sky-theme-replacement-2)" instead.',
          },
          {
            message:
              '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
          },
        ],
        fixed:
          'a { margin: var(--sky-theme-replacement-2) var(--sky-theme-replacement); }',
      },
      {
        code: 'a { background: rgba($sky-deprecated-var, 0.25); }',
        description:
          'a deprecated SCSS variable used as an argument to a color function (e.g. rgba) should error but not be auto-fixed',
        unfixable: true,
        warnings: [
          {
            message:
              '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
          },
        ],
      },
      {
        code: 'a { background: rgba(variables.$sky-deprecated-var, 0.25); }',
        description:
          'a namespaced deprecated SCSS variable inside a color function should also not be auto-fixed',
        unfixable: true,
        warnings: [
          {
            message:
              '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
          },
        ],
      },
      {
        code: 'a { border: solid 2px rgba($sky-deprecated-var, 0.25) $sky-deprecated-var-2; }',
        description:
          'only the occurrence inside the color function should be left unfixed; other occurrences in the same value should still be fixed',
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
          'a { border: solid 2px rgba($sky-deprecated-var, 0.25) var(--sky-theme-replacement-2); }',
      },
      {
        code: 'a { background: rgba(/* ) */$sky-deprecated-var, 0.25); }',
        description:
          'a stray ")" inside a comment must not prematurely close a color-function frame, so the variable inside it should still be treated as unfixable',
        unfixable: true,
        warnings: [
          {
            message:
              '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
          },
        ],
      },
      {
        code: 'a { margin: variables.$sky-my-custom-variable; }',
        description:
          'a namespaced unknown $sky- SCSS variable is still flagged as private or obsolete',
        warnings: [
          {
            message:
              '"$sky-my-custom-variable" is a private or obsolete SKY UX SCSS variable. To find an alternative, see the style API documentation: https://developer.blackbaud.com/skyux/design/styles',
          },
        ],
        unfixable: true,
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

  it('should fall back to decl.prop.length when decl.raws.between is undefined', async () => {
    // `decl.raws.between` is always populated by the postcss/postcss-scss
    // parsers, so this simulates the only way it can be missing: a plugin
    // upstream in the same lint run stripping it from the AST.
    const stripRawsBetweenRuleName = 'test/strip-raws-between';
    const stripRawsBetweenRuleBase: RuleBase = () => (root) => {
      root.walkDecls((decl) => {
        delete decl.raws.between;
      });
    };
    const stripRawsBetweenRule = stripRawsBetweenRuleBase as Rule;
    stripRawsBetweenRule.ruleName = stripRawsBetweenRuleName;
    stripRawsBetweenRule.messages = stylelint.utils.ruleMessages(
      stripRawsBetweenRuleName,
      {},
    );
    const stripRawsBetweenPlugin = stylelint.createPlugin(
      stripRawsBetweenRuleName,
      stripRawsBetweenRule,
    );

    const result = await stylelint.lint({
      code: 'a { margin-top: $sky-deprecated-var; }',
      config: {
        plugins: [stripRawsBetweenPlugin, plugin],
        // Rule execution order follows this object's key order, so the
        // `raws.between`-stripping rule must be listed first.
        rules: {
          [stripRawsBetweenRuleName]: true,
          [ruleName]: true,
        },
      },
      customSyntax: 'postcss-scss',
    });

    const [lintResult] = result.results;
    expect(lintResult.warnings).toHaveLength(1);

    const [warning] = lintResult.warnings;
    expect(
      warning.text.startsWith(
        '"$sky-deprecated-var" is deprecated. Use "var(--sky-theme-replacement)" instead.',
      ),
    ).toBe(true);
    // Without `raws.between`, `valueStart` is computed from `decl.prop.length`
    // alone, so the reported column lands on the `:` (column 15) rather than
    // on the `$` where the variable actually starts (column 17).
    expect(warning.column).toEqual(15);
  });
});
