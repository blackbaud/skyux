import { RuleTester } from '@angular-eslint/test-utils';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const parser = require('@angular-eslint/template-parser');

export function createTemplateRuleTester(): RuleTester {
  return new RuleTester({
    languageOptions: {
      parser,
    },
  });
}
