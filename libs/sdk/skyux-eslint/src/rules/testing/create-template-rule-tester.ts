import { RuleTester } from '@angular-eslint/test-utils';

const parser = require('@angular-eslint/template-parser');

export function createTemplateRuleTester(): RuleTester {
  return new RuleTester({
    languageOptions: {
      parser,
    },
  });
}
