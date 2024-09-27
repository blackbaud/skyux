import { RuleTester } from '@angular-eslint/test-utils';

export function createTemplateRuleTester(): RuleTester {
  return new RuleTester({
    languageOptions: {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      parser: require('@angular-eslint/template-parser'),
    },
  });
}
