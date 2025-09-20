import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import {
  type SkyManifestDirectiveDefinition,
  type SkyManifestDirectiveInputDefinition,
  type SkyManifestDirectiveOutputDefinition,
  type SkyManifestPublicApi,
} from '@skyux/manifest';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, rule } from './no-deprecated-directives';

const ruleTester = createTemplateRuleTester();

jest.mock('@skyux/manifest', () => {
  const original = jest.requireActual('@skyux/manifest');

  return {
    ...original,
    isDirectiveDefinition: jest
      .fn()
      .mockImplementation(
        (def) => def.kind === 'component' || def.kind === 'directive',
      ),
    getPublicApi: (): SkyManifestPublicApi => ({
      packages: {
        '@skyux/no-deprecated': [
          {
            kind: 'component',
            selector: 'sky-no-deprecated',
            isDeprecated: false,
          } as SkyManifestDirectiveDefinition,
        ],
        '@skyux/layout': [
          {
            kind: 'component',
            selector: 'sky-card',
            isDeprecated: true,
            deprecationReason: 'Do not use the card component.',
          } as SkyManifestDirectiveDefinition,
          // The sky-page component is an ignored selector.
          {
            kind: 'component',
            selector: 'sky-page',
            isDeprecated: true,
            deprecationReason: 'Do not use the page component.',
          } as SkyManifestDirectiveDefinition,
          // A component without a selector.
          {
            kind: 'component',
            selector: undefined,
            isDeprecated: true,
          } as SkyManifestDirectiveDefinition,
        ],
        '@skyux/forms': [
          {
            kind: 'component',
            selector: 'sky-file-attachment',
            isDeprecated: false,
            deprecationReason: '',
            children: [
              {
                kind: 'directive-input',
                name: 'validateFn',
                isDeprecated: true,
                deprecationReason:
                  'Add a custom Angular `Validator` function to the `FormControl` instead.',
              } as SkyManifestDirectiveInputDefinition,
              {
                kind: 'directive-output',
                name: 'fileChange',
                isDeprecated: true,
                deprecationReason:
                  "Subscribe to the form control's `valueChanges` event instead.",
              } as SkyManifestDirectiveOutputDefinition,
            ],
          } as SkyManifestDirectiveDefinition,
        ],
        '@skyux/foo': [
          {
            isDeprecated: true,
            kind: 'directive',
            selector: 'input[skyDeprecatedThing], textarea[skyDeprecatedThing]',
          } as SkyManifestDirectiveDefinition,
          {
            kind: 'directive',
            selector: '[skyFoo]',
            isDeprecated: false,
            children: [
              {
                kind: 'directive-input',
                name: 'noReason',
                isDeprecated: true,
              } as SkyManifestDirectiveInputDefinition,
            ],
          } as SkyManifestDirectiveDefinition,
          {
            kind: 'directive',
            selector: '[skyAutocomplete]',
            isDeprecated: false,
            children: [
              {
                kind: 'directive-input',
                name: 'autocompleteAttribute',
                isDeprecated: true,
                deprecationReason: 'Do not use it.',
              } as SkyManifestDirectiveInputDefinition,
            ],
          } as SkyManifestDirectiveDefinition,
        ],
      },
    }),
  };
});

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // Deprecated directive, but on the "wrong" element should still pass.
    '<foobar skyDeprecatedThing />',
    '<sky-no-deprecated></sky-no-deprecated>',
    '<sky-page></sky-page>',
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated directives',
      annotatedSource: `
        <input type="text" skyDeprecatedThing />
                           ~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectives',
      data: {
        reason: '',
        selector: 'skyDeprecatedThing',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated features of directives',
      annotatedSource: `
        <input type="text" skyAutocomplete autocompleteAttribute="foo" />
                                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        reason: 'Do not use it.',
        selector: 'input',
        property: 'autocompleteAttribute',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should work if a deprecated property does not have a reason',
      annotatedSource: `
        <input type="text" skyFoo noReason />
                                  ~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        property: 'noReason',
        reason: '',
        selector: 'input',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated components',
      annotatedSource: `
        <sky-card></sky-card>
        ~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectives',
      data: {
        reason: 'Do not use the card component.',
        selector: 'sky-card',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using bound deprecated input',
      annotatedSource: `
        <sky-file-attachment [validateFn]="foo"></sky-file-attachment>
                             ~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        property: 'validateFn',
        reason:
          'Add a custom Angular `Validator` function to the `FormControl` instead.',
        selector: 'sky-file-attachment',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using unbound deprecated input',
      annotatedSource: `
        <sky-file-attachment validateFn="{{ foo }}" />
                             ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        property: 'validateFn',
        reason:
          'Add a custom Angular `Validator` function to the `FormControl` instead.',
        selector: 'sky-file-attachment',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated output',
      annotatedSource: `
        <sky-file-attachment (fileChange)="onFileChange()" />
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        property: 'fileChange',
        reason: "Subscribe to the form control's `valueChanges` event instead.",
        selector: 'sky-file-attachment',
      },
    }),
  ],
});
