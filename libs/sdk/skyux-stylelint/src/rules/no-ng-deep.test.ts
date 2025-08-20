import { describe } from 'vitest';

import { testRule } from '../testing/test-rule.js';

import plugin, { ruleName } from './no-ng-deep.js';

describe(ruleName, () => {
  testRule({
    plugins: [plugin],
    ruleName,
    config: true,
    accept: [
      {
        code: '.my-class { color: red; }',
        description: 'regular selectors should be allowed',
      },
      {
        code: ':host { display: block; }',
        description: ':host selector should be allowed',
      },
      {
        code: ':host-context(.theme-dark) { background: black; }',
        description: ':host-context selector should be allowed',
      },
      {
        code: '.parent .child { margin: 10px; }',
        description: 'descendant selectors should be allowed',
      },
      {
        code: '.parent > .child { margin: 10px; }',
        description: 'child selectors should be allowed',
      },
      {
        code: '.parent + .sibling { margin: 10px; }',
        description: 'adjacent sibling selectors should be allowed',
      },
      {
        code: '.parent ~ .sibling { margin: 10px; }',
        description: 'general sibling selectors should be allowed',
      },
      {
        code: 'div:hover { color: blue; }',
        description: 'pseudo-class selectors should be allowed',
      },
      {
        code: 'p::before { content: ""; }',
        description: 'other pseudo-element selectors should be allowed',
      },
      {
        code: '.ng-deep-like-class { color: red; }',
        description: 'classes containing "ng-deep" should be allowed',
      },
      {
        code: '[data-ng-deep] { color: red; }',
        description: 'attribute selectors with ng-deep should be allowed',
      },
      {
        code: '/* ::ng-deep would be invalid */',
        description: 'comments containing ::ng-deep should be allowed',
      },
      {
        code: '@media (min-width: 768px) { .my-class { color: red; } }',
        description: 'media queries without ng-deep should be allowed',
      },
      {
        code: '.deep { color: blue; }',
        description: 'classes with "deep" should be allowed',
      },
      {
        code: '.ng-container { display: contents; }',
        description: 'other ng- prefixed classes should be allowed',
      },
      {
        code: '::NG-DEEP .uppercase { color: green; }',
        description:
          'uppercase ::NG-DEEP should be allowed (Angular does not recognize it)',
      },
    ],

    reject: [
      {
        code: '::ng-deep .my-class { color: red; }',
        description: 'standard ::ng-deep usage should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 1,
      },
      {
        code: '.parent ::ng-deep .child { margin: 10px; }',
        description: '::ng-deep in descendant selectors should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 1,
      },
      {
        code: ':host ::ng-deep .global { color: blue; }',
        description: '::ng-deep with :host should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 1,
      },
      {
        code: '.component ::ng-deep .nested .deep { padding: 5px; }',
        description: 'complex selectors with ::ng-deep should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 1,
      },
      {
        code: '::ng-deep { display: block; }',
        description: '::ng-deep without following selector should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 1,
      },
      {
        code: '@media (min-width: 768px) { ::ng-deep .responsive { font-size: 16px; } }',
        description: '::ng-deep within media queries should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 1,
      },
      {
        code: '.parent ::ng-deep .child, .other-selector { margin: 0; }',
        description: '::ng-deep in selector groups should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 1,
      },
      {
        code: '::ng-deep .mat-dialog-container { background: white; }',
        description:
          '::ng-deep targeting third-party components should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 1,
      },
    ],
  });

  // Test with a more complex CSS structure
  testRule({
    plugins: [plugin],
    ruleName,
    config: true,
    accept: [
      {
        code: `
          .component {
            color: blue;

            .nested {
              margin: 10px;
            }
          }

          :host(.theme-dark) {
            background: black;
          }
        `,
        description: 'complex CSS without ng-deep should be allowed',
      },
    ],

    reject: [
      {
        code: `
          .component {
            color: blue;

            ::ng-deep .global-override {
              font-weight: bold;
            }
          }
        `,
        description: '::ng-deep in nested CSS should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 5,
      },
      {
        code: `
          :host {
            display: block;
          }

          :host ::ng-deep .global {
            color: red;
          }
        `,
        description:
          '::ng-deep after :host in separate rules should be rejected',
        message:
          'Unexpected usage of "::ng-deep". The Angular team strongly discourages new use of ::ng-deep as it breaks component encapsulation. Consider using :host or component communication patterns instead.',
        line: 6,
      },
    ],
  });

  testRule({
    plugins: [plugin],
    ruleName,
    config: null,
    accept: [
      {
        code: '::ng-deep .should-be-allowed { color: red; }',
        description: 'should allow ng-deep when rule is disabled',
      },
    ],
  });

  testRule({
    plugins: [plugin],
    ruleName,
    config: 'invalid',
    reject: [
      {
        code: '::ng-deep .should-not-be-checked { color: red; }',
        description: 'should not validate when config invalid',
        message: `Invalid option value "invalid" for rule "${ruleName}"`,
      },
    ],
  });
});
