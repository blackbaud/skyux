import {
  RuleTester,
  convertAnnotatedSourceToFailureCase,
} from '@angular-eslint/test-utils';

import { RULE_NAME, noLambdaImports } from './no-lambda-imports';

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, noLambdaImports, {
  valid: [
    `import { foo } from '@skyux/foo';`,
    `import '@skyux/foo';`,
    `import { Lλ } from 'foo';`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'it should fail when importing lambda',
      annotatedSource: `
        import { SkySummaryActionBarModule, λ3 } from '@skyux/foo';
                                            ~~
        `,
      messageId: 'noLambdaImports',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'it should fail when importing lambda',
      annotatedSource: `
        import { λ1999 } from '@skyux/foo';
                 ~~~~~
        `,
      messageId: 'noLambdaImports',
    }),
  ],
});
