import {
  RuleTester,
  convertAnnotatedSourceToFailureCase,
} from '@angular-eslint/test-utils';

import { RULE_NAME, messageId, rule } from './no-lambda-imports';

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `import { foo } from '@skyux/foo';`,
    `import '@skyux/foo';`,
    `import { Lλ } from 'foo';`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'it should fail when importing a lambda file',
      annotatedSource: `
        import { λ1999 } from '@skyux/foo';
                 ~~~~~
        `,
      messageId,
      data: {
        importName: 'λ1999',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'it should fail when importing multiple lambda files',
      annotatedSource: `
        import { SkySummaryActionBarModule, λ3, λ5 } from '@skyux/foo';
                                            ~~  ^^
        `,
      messages: [
        {
          char: '~',
          messageId,
          data: {
            importName: 'λ3',
          },
        },
        {
          char: '^',
          messageId,
          data: {
            importName: 'λ5',
          },
        },
      ],
    }),
  ],
});
