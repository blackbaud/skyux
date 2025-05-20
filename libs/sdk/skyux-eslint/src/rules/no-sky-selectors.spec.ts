import {
  RuleTester,
  convertAnnotatedSourceToFailureCase,
} from '@angular-eslint/test-utils';

import { RULE_NAME, messageId, rule } from './no-sky-selectors';

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `@Component({ selector: 'app-foo' }) export class FooComponent {}`,
    `@Component({ selector: 'app-sky-foo' }) export class FooComponent {}`,
    `@Component({ }) export class FooComponent {}`,
    `@Directive({ selector: '[libFoo]' }) export class FooDirective {}`,
    `@Directive({ }) export class FooDirective {}`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: '',
      annotatedSource: `
@Component({ selector: 'sky-foo' })
                       ~~~~~~~~~
export class FooComponent {}
`,
      messageId,
    }),
    convertAnnotatedSourceToFailureCase({
      description: '',
      annotatedSource: `
@Component({ selector: 'my-foo,sky-foo[attr]' })
                       ~~~~~~~~~~~~~~~~~~~~~~
export class FooComponent {}
`,
      messageId,
    }),
    convertAnnotatedSourceToFailureCase({
      description: '',
      annotatedSource: `
@Directive({ selector: '[skyFoo]' })
                       ~~~~~~~~~~
export class FooDirective {}
`,
      messageId,
    }),
    convertAnnotatedSourceToFailureCase({
      description: '',
      annotatedSource: `
@Directive({ selector: 'input[foo],textarea[skyuxFoo]' })
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export class FooDirective {}
`,
      messageId,
    }),
  ],
});
