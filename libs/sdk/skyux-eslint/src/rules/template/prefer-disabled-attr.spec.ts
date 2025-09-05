import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './prefer-disabled-attr';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // Elements that don't support disabled attribute should be ignored
    `<div class="sky-btn-disabled"></div>`,
    `<span class="sky-btn-disabled"></span>`,
    `<p class="sky-btn-disabled"></p>`,
    `<div [class.sky-btn-disabled]="isDisabled">Div with disabled class</div>`,
    `<span [class]="'sky-btn-disabled'">Span with class binding</span>`,
    `<div [ngClass]="{'sky-btn-disabled': isDisabled}">Div with ngClass</div>`,

    // Elements without sky-btn-disabled class are valid
    `<button class="other-class"></button>`,
    `<input class="btn btn-primary" />`,

    // Elements with disabled attribute but NO sky-btn-disabled class are valid
    `<button disabled></button>`,
    `<input [disabled]="isDisabled" />`,
    `<textarea [attr.disabled]="condition"></textarea>`,
    `<select disabled></select>`,

    // Empty class attributes
    `<button class=""></button>`,
    `<input class="" />`,
  ],
  invalid: [
    // sky-btn-disabled class should NEVER be used on elements that support disabled
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when button has sky-btn-disabled class (no disabled attribute)',
      annotatedSource: `
      <button class="sky-btn-disabled"></button>
              ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <button disabled></button>
              ~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when button has sky-btn-disabled class WITH disabled attribute',
      annotatedSource: `
      <button class="sky-btn-disabled" disabled></button>
              ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <button disabled></button>
              ~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when button has sky-btn-disabled class WITH property binding',
      annotatedSource: `
      <button class="sky-btn-disabled" [disabled]="isDisabled"></button>
              ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <button [disabled]="isDisabled"></button>
              ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when button has sky-btn-disabled class WITH attribute binding',
      annotatedSource: `
      <button class="sky-btn-disabled" [attr.disabled]="isDisabled"></button>
              ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <button [attr.disabled]="isDisabled"></button>
              ~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when input has sky-btn-disabled class',
      annotatedSource: `
      <input class="sky-btn-disabled" />
             ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <input disabled />
             ~
      `,
      messageId,
      data: {
        element: 'input',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when textarea has sky-btn-disabled class',
      annotatedSource: `
      <textarea class="sky-btn-disabled"></textarea>
                ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <textarea disabled></textarea>
                ~
      `,
      messageId,
      data: {
        element: 'textarea',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when select has sky-btn-disabled class',
      annotatedSource: `
      <select class="sky-btn-disabled"></select>
              ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <select disabled></select>
              ~
      `,
      messageId,
      data: {
        element: 'select',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail with multiple classes including sky-btn-disabled',
      annotatedSource: `
      <button class="btn sky-btn-disabled primary"></button>
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <button disabled class="btn primary"></button>
              ~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail with class binding for sky-btn-disabled',
      annotatedSource: `
      <button [class.sky-btn-disabled]="someCondition"></button>
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <button [disabled]="someCondition"></button>
              ~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail with class binding AND disabled attribute',
      annotatedSource: `
      <button [class.sky-btn-disabled]="isDisabled" [disabled]="isDisabled"></button>
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <button [disabled]="isDisabled"></button>
              ~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail with [class] binding containing sky-btn-disabled string',
      annotatedSource: `
      <button [class]="'sky-btn-disabled'">Button</button>
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail with [class] binding containing sky-btn-disabled in expression',
      annotatedSource: `
      <button [class]="condition ? 'sky-btn-disabled' : 'enabled'">Button</button>
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail with [ngClass] binding containing sky-btn-disabled',
      annotatedSource: `
      <button [ngClass]="{'sky-btn-disabled': isDisabled}">Button</button>
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail with [ngClass] binding with string containing sky-btn-disabled',
      annotatedSource: `
      <input [ngClass]="'btn sky-btn-disabled'" />
             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'input',
      },
    }),
  ],
});
