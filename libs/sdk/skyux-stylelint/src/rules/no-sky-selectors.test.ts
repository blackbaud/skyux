import { describe } from 'vitest';

import { testRule } from '../testing/test-rule.js';

import plugin, { ruleName } from './no-sky-selectors.js';

describe(ruleName, () => {
  testRule({
    plugins: [plugin],
    ruleName,
    config: true,
    accept: [
      {
        code: '.my-class { color: red; }',
        description: 'non-sky class names are allowed',
      },
      {
        code: '.my-sky-blue { color: blue; }',
        description: 'custom classes with "sky" in the middle are allowed',
      },
      {
        code: '.component-sky { color: red; }',
        description: 'classes ending with "sky" are allowed',
      },
      {
        code: '.skycomponent { color: red; }',
        description: 'classes with "sky" not followed by dash are allowed',
      },
      {
        code: 'div { color: red; }',
        description: 'regular element selectors are allowed',
      },
      {
        code: '[data-sky-element] { color: red; }',
        description: 'attribute selectors are allowed',
      },
      {
        code: '.my-class .other-class { margin: 10px; }',
        description: 'complex selectors without sky- patterns are allowed',
      },
      {
        code: '/* .sky-component would be invalid */',
        description: 'comments containing sky- are allowed',
      },
      {
        code: '@media (min-width: 768px) { .my-class { color: red; } }',
        description: 'media queries with non-sky classes are allowed',
      },
      {
        code: '.blue-sky-theme { background: blue; }',
        description: 'classes with sky not at word boundary are allowed',
      },
      {
        code: '.myskyux-custom { color: blue; }',
        description: 'classes with skyux not at word boundary are allowed',
      },
      {
        code: '.myskypages-custom { color: green; }',
        description: 'classes with skypages not at word boundary are allowed',
      },
    ],

    reject: [
      {
        code: '.sky-component { color: red; }',
        description: 'basic .sky- class selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.skyux-button { margin: 10px; }',
        description: '.skyux- class selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.skypages-layout { padding: 5px; }',
        description: '.skypages- class selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '#sky-component { color: red; }',
        description: '#sky- ID selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '#skyux-button { margin: 10px; }',
        description: '#skyux- ID selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '#skypages-layout { padding: 5px; }',
        description: '#skypages- ID selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: 'sky-component { color: red; }',
        description: 'sky- element selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: 'skyux-button { margin: 10px; }',
        description: 'skyux- element selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: 'skypages-layout { padding: 5px; }',
        description: 'skypages- element selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.my-class .sky-button { margin: 10px; }',
        description: 'complex selector with .sky- class should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-component.sky-active { color: blue; }',
        description:
          'multiple .sky- classes in one selector should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-button:hover { background: blue; }',
        description: 'pseudo-class with .sky- class should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-button::before { content: ""; }',
        description: 'pseudo-element with .sky- class should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: 'div .sky-component span { font-weight: bold; }',
        description: 'descendant selector with .sky- class should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-component > .child { padding: 5px; }',
        description: 'child combinator with .sky- class should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: 'div sky-element span { font-weight: bold; }',
        description: 'descendant selector with sky- element should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '#container .skyux-form { background: white; }',
        description: 'ID and .skyux- class combination should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '@media (min-width: 768px) { .sky-component { color: red; } }',
        description: '.sky- class inside media query should be rejected',
        message:
          'Do not reference SKY UX classes, IDs, or components in stylesheets',
        line: 1,
        column: 29,
      },
    ],
  });

  testRule({
    plugins: [plugin],
    ruleName,
    config: null,
    accept: [
      {
        code: '.sky-component { color: red; }',
        description: 'should not validate when rule is disabled',
      },
      {
        code: 'sky-element { margin: 10px; }',
        description: 'should not validate sky- elements when rule is disabled',
      },
      {
        code: '#skyux-id { padding: 5px; }',
        description: 'should not validate skyux- IDs when rule is disabled',
      },
    ],
  });

  testRule({
    plugins: [plugin],
    ruleName,
    config: 'some-invalid-value',
    reject: [
      {
        code: '.sky-component { color: red; }',
        description: 'should not validate when config invalid',
        message: `Invalid option value "some-invalid-value" for rule "${ruleName}"`,
      },
    ],
  });

  // Test multiple violations in one file
  testRule({
    plugins: [plugin],
    ruleName,
    config: true,
    reject: [
      {
        code: `
          .sky-component { color: red; }
          .my-class { margin: 10px; }
          .skyux-button { padding: 5px; }
          #skypages-header {}
          sky-element { display: block; }
        `,
        description: 'multiple sky violations in different rules',
        warnings: [
          {
            message:
              'Do not reference SKY UX classes, IDs, or components in stylesheets',
            line: 2,
            column: 11,
          },
          {
            message:
              'Do not reference SKY UX classes, IDs, or components in stylesheets',
            line: 4,
            column: 11,
          },
          {
            message:
              'Do not reference SKY UX classes, IDs, or components in stylesheets',
            line: 5,
            column: 11,
          },
          {
            message:
              'Do not reference SKY UX classes, IDs, or components in stylesheets',
            line: 6,
            column: 11,
          },
        ],
      },
    ],
  });
});
