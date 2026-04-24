import stylelint from 'stylelint';
import { describe, expect, it, vi } from 'vitest';

import { testRule } from '../testing/test-rule.js';

import plugin, { ruleName } from './no-invalid-sky-custom-properties.js';

vi.mock('../utility/style-public-api.js', () => ({
  deprecatedCustomPropsMap: new Map([
    ['--sky-deprecated-prop', '--sky-theme-replacement'],
    ['--sky-deprecated-prop-2', '--sky-theme-replacement-2'],
    ['--sky-deprecated-no-replacement', undefined],
  ]),
  validThemeCustomProperties: new Set([
    '--sky-theme-replacement',
    '--sky-theme-replacement-2',
    '--sky-theme-valid-prop',
  ]),
}));

describe(ruleName, () => {
  testRule({
    plugins: [plugin],
    ruleName,
    config: true,
    fix: true,
    accept: [
      {
        code: 'a { color: red; }',
        description: 'declarations without sky- custom properties are allowed',
      },
      {
        code: 'a { margin-top: var(--my-token); }',
        description: 'non-sky custom properties are allowed',
      },
      {
        code: 'a { margin-top: var(--sky-theme-valid-prop); }',
        description: 'valid --sky-theme- custom properties are allowed',
      },
      {
        code: 'a { margin-top: var(--sky-theme-replacement); }',
        description: 'the replacement target is itself a valid custom property',
      },
    ],
    reject: [
      {
        code: 'a { color: var(--sky-deprecated-prop); }',
        description: 'deprecated custom property with replacement should error',
        warnings: [
          {
            message:
              '"--sky-deprecated-prop" is deprecated. Use "--sky-theme-replacement" instead.',
          },
        ],
        fixed: 'a { color: var(--sky-theme-replacement); }',
      },
      {
        code: 'a { color: var(--sky-deprecated-no-replacement); }',
        description:
          'deprecated custom property with no replacement should error',
        unfixable: true,
        warnings: [
          {
            message:
              '"--sky-deprecated-no-replacement" is deprecated with no direct replacement. See the style API documentation: https://developer.blackbaud.com/skyux/design/styles',
          },
        ],
      },
      {
        code: 'a { margin-top: var(--sky-theme-unknown-token); }',
        description: 'unknown --sky-theme- custom property should error',
        unfixable: true,
        warnings: [
          {
            message:
              '"--sky-theme-unknown-token" is not a known --sky-theme- custom property. See the style API documentation for valid custom properties: https://developer.blackbaud.com/skyux/design/styles',
          },
        ],
      },
      {
        code: 'a { margin-top: var(--sky-private-internal); }',
        description: 'private --sky- custom property should error',
        unfixable: true,
        warnings: [
          {
            message:
              '"--sky-private-internal" is a private SKY UX custom property and should not be used directly. To find an alternative, check the style API documentation: https://developer.blackbaud.com/skyux/design/styles',
          },
        ],
      },
      {
        code: 'a { margin: var(--sky-deprecated-prop) var(--sky-deprecated-prop-2); }',
        description:
          'multiple deprecated custom properties in one declaration should each error and be replaced',
        warnings: [
          {
            message:
              '"--sky-deprecated-prop" is deprecated. Use "--sky-theme-replacement" instead.',
          },
          {
            message:
              '"--sky-deprecated-prop-2" is deprecated. Use "--sky-theme-replacement-2" instead.',
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
    });
    expect(result.results[0].warnings).toHaveLength(0);
    expect(result.results[0].invalidOptionWarnings).toHaveLength(1);
  });
});
