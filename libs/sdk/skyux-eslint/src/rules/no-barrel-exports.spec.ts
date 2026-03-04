import {
  RuleTester,
  convertAnnotatedSourceToFailureCase,
} from '@angular-eslint/test-utils';

import {
  RULE_NAME,
  messageId,
  namespaceMessageId,
  rule,
} from './no-barrel-exports';

jest.mock('./utils/resolve-exports', () => ({
  resolveModulePath: (currentFile: string, specifier: string) => {
    if (specifier === './resolvable') {
      return '/fake/resolvable.ts';
    }
    if (specifier === './resolvable-mixed') {
      return '/fake/resolvable-mixed.ts';
    }
    if (specifier === './resolvable-types-only') {
      return '/fake/resolvable-types-only.ts';
    }
    if (specifier === './empty-exports') {
      return '/fake/empty-exports.ts';
    }
    return undefined;
  },
  getNamedExportsFromFile: (filePath: string) => {
    if (filePath === '/fake/resolvable.ts') {
      return { valueExports: ['Bar', 'Foo'], typeExports: [] };
    }
    if (filePath === '/fake/resolvable-mixed.ts') {
      return {
        valueExports: ['FooComponent'],
        typeExports: ['FooConfig', 'FooType'],
      };
    }
    if (filePath === '/fake/resolvable-types-only.ts') {
      return { valueExports: [], typeExports: ['BarConfig', 'FooConfig'] };
    }
    return undefined;
  },
}));

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `export { Foo, Bar } from './foo';`,
    `export const foo = 1;`,
    `export class Foo {}`,
    `export interface Foo {}`,
    `export type Foo = string;`,
    `export function foo() {}`,
    `export enum Foo { A }`,
    `import './foo';`,
    `import { Foo } from './foo';`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should flag export * from with relative path',
      annotatedSource: `
        export * from './foo';
        ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag export * from with package path',
      annotatedSource: `
        export * from 'some-package';
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag export * as namespace re-export',
      annotatedSource: `
        export * as foo from './foo';
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: namespaceMessageId,
      data: {
        namespace: 'foo',
      },
    }),
    {
      code: `export * from './resolvable';`,
      output: `export { Bar, Foo } from './resolvable';`,
      errors: [{ messageId }],
    },
    {
      code: `export * from './resolvable-mixed';`,
      output: `export { FooComponent } from './resolvable-mixed';\nexport type { FooConfig, FooType } from './resolvable-mixed';`,
      errors: [{ messageId }],
    },
    {
      code: `export * from './resolvable-types-only';`,
      output: `export type { BarConfig, FooConfig } from './resolvable-types-only';`,
      errors: [{ messageId }],
    },
    {
      code: `export * from './unresolvable';`,
      errors: [{ messageId }],
    },
    {
      code: `export * from './empty-exports';`,
      errors: [{ messageId }],
    },
  ],
});
