import { RuleTester } from '@angular-eslint/test-utils';

import { RULE_NAME, rule } from './no-invalid-sky-classnames';

jest.mock('./utils/style-public-api', () => ({
  deprecatedStyleClassMap: new Map([
    ['sky-deprecated-class', 'sky-theme-new-class'],
    ['sky-deprecated-class-2', 'sky-theme-new-class-2'],
    ['sky-deprecated-no-replacement', undefined],
  ]),
  validPublicClassNames: new Set([
    'sky-theme-new-class',
    'sky-theme-valid-class',
  ]),
  WHITELISTED_SKY_CLASSES: new Set(['sky-btn', 'sky-btn-primary']),
}));

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // Non-sky strings have nothing to check.
    `const x = 'foo bar baz';`,
    // Whitelisted sky- classes are allowed.
    `element.className = 'sky-btn';`,
    `classList.add('sky-btn-primary');`,
    // Valid sky-theme- classes are allowed.
    `const cls = 'sky-theme-valid-class';`,
    // Non-string literals are ignored.
    `const x = 42;`,
    // Empty strings are ignored.
    `element.className = '';`,
    // Spec files are skipped entirely.
    {
      code: `element.className = 'sky-deprecated-class';`,
      filename: 'component.spec.ts',
    },
    // Inline templates are skipped — the template rule handles them.
    `const component = { template: '<div class="sky-deprecated-class"></div>' };`,
  ],
  invalid: [
    {
      code: `element.classList.add('sky-deprecated-class');`,
      errors: [
        {
          messageId: 'deprecatedWithReplacement',
          data: {
            className: 'sky-deprecated-class',
            replacement: 'sky-theme-new-class',
          },
        },
      ],
      output: `element.classList.add('sky-theme-new-class');`,
    },
    {
      code: `element.classList.add('sky-theme-does-not-exist');`,
      errors: [
        {
          messageId: 'unknownThemeClass',
          data: { className: 'sky-theme-does-not-exist' },
        },
      ],
    },
    {
      code: `element.classList.add('sky-private-class');`,
      errors: [
        {
          messageId: 'privateClass',
          data: { className: 'sky-private-class' },
        },
      ],
    },
    {
      code: `element.classList.add('sky-deprecated-no-replacement');`,
      errors: [
        {
          messageId: 'deprecatedNoReplacement',
          data: {
            className: 'sky-deprecated-no-replacement',
            docsUrl: 'https://developer.blackbaud.com/skyux/design/styles',
          },
        },
      ],
    },
    {
      code: `element.classList.add('sky-deprecated-class sky-deprecated-class-2');`,
      errors: [
        {
          messageId: 'deprecatedWithReplacement',
          data: {
            className: 'sky-deprecated-class',
            replacement: 'sky-theme-new-class',
          },
        },
        {
          messageId: 'deprecatedWithReplacement',
          data: {
            className: 'sky-deprecated-class-2',
            replacement: 'sky-theme-new-class-2',
          },
        },
      ],
      output: [
        `element.classList.add('sky-theme-new-class sky-deprecated-class-2');`,
        `element.classList.add('sky-theme-new-class sky-theme-new-class-2');`,
      ],
    },
  ],
});
