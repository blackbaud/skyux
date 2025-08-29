import { describe } from 'vitest';

import { testRule } from '../testing/test-rule.js';

import plugin, { ruleName } from './no-static-color-values.js';

describe(ruleName, () => {
  testRule({
    plugins: [plugin],
    ruleName,
    config: true,
    accept: [
      // Approved SKY UX custom properties
      {
        code: '.my-class { color: var(--sky-color-text-default); }',
        description: 'approved sky color custom property should be allowed',
      },
      {
        code: '.my-class { background-color: var(--sky-background-color-page-default); }',
        description:
          'approved sky background color custom property should be allowed',
      },
      {
        code: '.my-class { border-color: var(--sky-border-color-neutral-medium); }',
        description:
          'approved sky border color custom property should be allowed',
      },
      {
        code: '.my-class { border: 1px solid var(--sky-border-color-neutral-medium); }',
        description:
          'shorthand border with approved custom property should be allowed',
      },
      {
        code: '.my-class { background: var(--sky-background-color-info) url(image.png) no-repeat; }',
        description:
          'shorthand background with approved custom property should be allowed',
      },
      {
        code: '.my-class { border-top-color: var(--sky-color-text-default); }',
        description:
          'specific border color with approved custom property should be allowed',
      },
      {
        code: '.my-class { border-right-color: var(--sky-border-color-neutral-medium); }',
        description:
          'border-right-color with approved custom property should be allowed',
      },
      {
        code: '.my-class { border-bottom-color: var(--sky-border-color-neutral-medium); }',
        description:
          'border-bottom-color with approved custom property should be allowed',
      },
      {
        code: '.my-class { border-left-color: var(--sky-border-color-neutral-medium); }',
        description:
          'border-left-color with approved custom property should be allowed',
      },
      {
        code: '.my-class { color: var(--sky-text-color-action-primary); }',
        description: 'text color custom property should be allowed',
      },
      {
        code: '.my-class { background-color: var(--sky-category-color-blue); }',
        description: 'category color custom property should be allowed',
      },
      {
        code: '.my-class { color: var(--sky-highlight-color-info); }',
        description: 'highlight color custom property should be allowed',
      },
      // Non-color properties should be ignored
      {
        code: '.my-class { margin: 10px; }',
        description: 'non-color properties should be ignored',
      },
      {
        code: '.my-class { font-size: 16px; }',
        description: 'non-color properties should be ignored',
      },
      {
        code: '.my-class { width: 100px; }',
        description: 'non-color properties should be ignored',
      },
      // Other CSS values that contain color words but aren't colors
      {
        code: '.my-class { content: "red text here"; }',
        description: 'content property with color words should be allowed',
      },
      // inherit, initial, unset, etc.
      {
        code: '.my-class { color: inherit; }',
        description: 'inherit value should be allowed',
      },
      {
        code: '.my-class { background-color: initial; }',
        description: 'initial value should be allowed',
      },
      {
        code: '.my-class { border-color: unset; }',
        description: 'unset value should be allowed',
      },
      {
        code: '.my-class { color: currentColor; }',
        description: 'currentColor value should be allowed',
      },
      {
        code: '.my-class { background-color: transparent; }',
        description: 'transparent value should be allowed',
      },
      // Approved custom properties with whitespace formatting
      {
        code: '.my-class { color: var( --sky-color-text-default); }',
        description:
          'approved custom property with space after opening parenthesis should be allowed',
      },
      {
        code: '.my-class { background-color: var(\n  --sky-background-color-page-default\n); }',
        description: 'approved custom property with newlines should be allowed',
      },
      {
        code: '.my-class { border-color: var(\t--sky-border-color-neutral-medium); }',
        description:
          'approved custom property with tab after opening parenthesis should be allowed',
      },
      {
        code: '.my-class { color: var(  --sky-color-text-default  ); }',
        description:
          'approved custom property with multiple spaces should be allowed',
      },
    ],

    reject: [
      // Hex colors
      {
        code: '.my-class { color: #fff; }',
        description: 'hex color should be rejected',
        message:
          'Unexpected static color value "#fff" for property "color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { color: #ffffff; }',
        description: '6-digit hex color should be rejected',
        message:
          'Unexpected static color value "#ffffff" for property "color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { background-color: #000; }',
        description: 'hex background color should be rejected',
        message:
          'Unexpected static color value "#000" for property "background-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { border-color: #ff0000; }',
        description: 'hex border color should be rejected',
        message:
          'Unexpected static color value "#ff0000" for property "border-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      // RGB/RGBA colors
      {
        code: '.my-class { color: rgb(255, 255, 255); }',
        description: 'RGB color should be rejected',
        message:
          'Unexpected static color value "rgb(255, 255, 255)" for property "color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { background-color: rgba(0, 0, 0, 0.5); }',
        description: 'RGBA color should be rejected',
        message:
          'Unexpected static color value "rgba(0, 0, 0, 0.5)" for property "background-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      // HSL/HSLA colors
      {
        code: '.my-class { color: hsl(0, 0%, 100%); }',
        description: 'HSL color should be rejected',
        message:
          'Unexpected static color value "hsl(0, 0%, 100%)" for property "color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { background-color: hsla(0, 0%, 0%, 0.5); }',
        description: 'HSLA color should be rejected',
        message:
          'Unexpected static color value "hsla(0, 0%, 0%, 0.5)" for property "background-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      // Named colors
      {
        code: '.my-class { color: red; }',
        description: 'named color should be rejected',
        message:
          'Unexpected static color value "red" for property "color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { background-color: blue; }',
        description: 'named background color should be rejected',
        message:
          'Unexpected static color value "blue" for property "background-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { border-color: green; }',
        description: 'named border color should be rejected',
        message:
          'Unexpected static color value "green" for property "border-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      // Specific border colors
      {
        code: '.my-class { border-top-color: #fff; }',
        description: 'border-top-color with static value should be rejected',
        message:
          'Unexpected static color value "#fff" for property "border-top-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { border-right-color: red; }',
        description: 'border-right-color with static value should be rejected',
        message:
          'Unexpected static color value "red" for property "border-right-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { border-bottom-color: rgb(0, 0, 0); }',
        description: 'border-bottom-color with static value should be rejected',
        message:
          'Unexpected static color value "rgb(0, 0, 0)" for property "border-bottom-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { border-left-color: #000000; }',
        description: 'border-left-color with static value should be rejected',
        message:
          'Unexpected static color value "#000000" for property "border-left-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      // Shorthand properties with static colors
      {
        code: '.my-class { border: 1px solid red; }',
        description: 'border shorthand with static color should be rejected',
        message:
          'Unexpected static color value "red" for property "border". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { background: #fff url(image.png) no-repeat; }',
        description:
          'background shorthand with static color should be rejected',
        message:
          'Unexpected static color value "#fff" for property "background". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { border: 2px dashed rgba(255, 0, 0, 0.5); }',
        description: 'border shorthand with RGBA should be rejected',
        message:
          'Unexpected static color value "rgba(255, 0, 0, 0.5)" for property "border". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      // Case variations
      {
        code: '.my-class { color: RED; }',
        description: 'uppercase named color should be rejected',
        message:
          'Unexpected static color value "RED" for property "color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { background-color: Blue; }',
        description: 'mixed case named color should be rejected',
        message:
          'Unexpected static color value "Blue" for property "background-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { color: #FFF; }',
        description: 'uppercase hex color should be rejected',
        message:
          'Unexpected static color value "#FFF" for property "color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
      {
        code: '.my-class { border-color: #AbCdEf; }',
        description: 'mixed case hex color should be rejected',
        message:
          'Unexpected static color value "#AbCdEf" for property "border-color". Use SKY UX approved custom properties instead.',
        line: 1,
      },
    ],
  });

  testRule({
    plugins: [plugin],
    ruleName,
    config: 'some-invalid-value',
    reject: [
      {
        code: '.my-class { color: #ffffff; }',
        description: 'should not validate when config invalid',
        message: `Invalid option value "some-invalid-value" for rule "${ruleName}"`,
      },
    ],
  });
});
