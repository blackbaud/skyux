import ts from 'typescript';

import { hasUnconvertibleUsage } from './has-unconvertible-usage';

describe('has-unconvertible-usage', () => {
  function check(content: string): boolean {
    return hasUnconvertibleUsage(
      ts.createSourceFile('foo.ts', content, ts.ScriptTarget.Latest, true),
      '@old/pkg',
      ['OldModule', 'AggregateModule'],
    );
  }

  it.each([
    [
      'a named import',
      `import { OldModule, AggregateModule } from '@old/pkg';\nexport const IMPORTS = [OldModule, AggregateModule];`,
    ],
    [
      'a namespace import that does not reference the classes',
      `import * as old from '@old/pkg';\nimport { OldModule } from '@old/pkg';\nexport const IMPORTS = [old.OtherModule, OldModule];`,
    ],
    ['a re-export of another class', `export { OtherModule } from '@old/pkg';`],
    [
      'an aliased import from another package',
      `import { OldModule as Local } from './local';\nexport const IMPORTS = [Local];`,
    ],
    ['a local export', `const OldModule = 1;\nexport { OldModule };`],
    ['a re-export from another package', `export * from './local';`],
  ])('should return false for %s', (_description, content) => {
    expect(check(content)).toBe(false);
  });

  it.each([
    [
      'an aliased import of one of the classes',
      `import { AggregateModule as Aggregate } from '@old/pkg';\nexport const IMPORTS = [Aggregate];`,
    ],
    [
      'a namespace import that references one of the classes',
      `import * as old from '@old/pkg';\nexport const IMPORTS = [old.OldModule];`,
    ],
    [
      'a named re-export of one of the classes',
      `export { OldModule } from '@old/pkg';`,
    ],
    [
      'an aliased re-export of one of the classes',
      `export { AggregateModule as Aggregate } from '@old/pkg';`,
    ],
    ['a wildcard re-export', `export * from '@old/pkg';`],
    ['a namespace re-export', `export * as old from '@old/pkg';`],
    ['a re-export from a subpath', `export * from '@old/pkg/sub';`],
  ])('should return true for %s', (_description, content) => {
    expect(check(content)).toBe(true);
  });
});
