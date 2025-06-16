import { describe } from 'vitest';

import { testRule } from '../testing/test-rule.js';

import plugin, { ruleName } from './no-sky-class-names.js';

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
        description: 'custom classes with "sky" in the name are allowed',
      },
      {
        code: 'div { color: red; }',
        description: 'element selectors are allowed',
      },
      {
        code: '[data-sky-element] { color: red; }',
        description: 'attribute selectors with sky- are allowed',
      },
      {
        code: '#sky-component { color: red; }',
        description: 'ID selectors with sky- are allowed',
      },
      {
        code: '.component-sky { color: red; }',
        description: 'classes ending with "sky" are allowed',
      },
      {
        code: '.sky_component { color: red; }',
        description: 'classes with "sky" not followed by dash are allowed',
      },
      {
        code: '.my-class .other-class { margin: 10px; }',
        description: 'complex selectors without .sky- are allowed',
      },
      {
        code: '/* .sky-component would be invalid */',
        description: 'comments containing .sky- are allowed',
      },
      {
        code: '@media (min-width: 768px) { .my-class { color: red; } }',
        description: 'media queries with non-sky classes are allowed',
      },
    ],
    reject: [
      {
        code: '.sky-component { color: red; }',
        description: 'basic .sky- class selector',
        message: 'Do not reference .sky- classes in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.my-class .sky-button { margin: 10px; }',
        description: 'complex selector with .sky- class',
        message: 'Do not reference .sky- classes in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-component.sky-active { color: blue; }',
        description: 'multiple .sky- classes in one selector',
        message: 'Do not reference .sky- classes in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-button:hover { background: blue; }',
        description: 'pseudo-class with .sky- class',
        message: 'Do not reference .sky- classes in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: 'div .sky-component span { font-weight: bold; }',
        description: 'descendant selector with .sky- class',
        message: 'Do not reference .sky- classes in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-button::before { content: ""; }',
        description: 'pseudo-element with .sky- class',
        message: 'Do not reference .sky- classes in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-component > .child { padding: 5px; }',
        description: 'child combinator with .sky- class',
        message: 'Do not reference .sky- classes in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-component + .sky-sibling { margin-top: 10px; }',
        description: 'adjacent sibling combinator with .sky- classes',
        message: 'Do not reference .sky- classes in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '.sky-component ~ .sky-general { margin-left: 15px; }',
        description: 'general sibling combinator with .sky- classes',
        message: 'Do not reference .sky- classes in stylesheets',
        line: 1,
        column: 1,
      },
      {
        code: '@media (min-width: 768px) { .sky-component { color: red; } }',
        description: '.sky- class inside media query',
        message: 'Do not reference .sky- classes in stylesheets',
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
          .sky-button { padding: 5px; }
        `,
        description: 'multiple .sky- classes in different rules',
        warnings: [
          {
            message: 'Do not reference .sky- classes in stylesheets',
            line: 2,
            column: 11,
          },
          {
            message: 'Do not reference .sky- classes in stylesheets',
            line: 4,
            column: 11,
          },
        ],
      },
    ],
  });
});
