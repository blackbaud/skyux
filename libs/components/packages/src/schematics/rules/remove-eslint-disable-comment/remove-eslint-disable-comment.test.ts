import { stripIndent } from '@angular-devkit/core/src/utils/literals';
import { EmptyTree } from '@angular-devkit/schematics';

import { removeEslintDisableComment } from './remove-eslint-disable-comment';

describe('removeEslintDisableComment', () => {
  it('should noop', () => {
    const tree = new EmptyTree();
    tree.create(
      'file.ts',
      stripIndent`
      import { Component } from '@angular/core';

      const a = 1;
      const b = 2;
      const c = 3;
      const d = 4;

    `,
    );
    tree.create('file2.ts', '// eslint-disable');
    removeEslintDisableComment({ ruleNames: ['rule1'] })(tree);
    expect(tree.readText('file.ts')).toEqual(
      stripIndent`
      import { Component } from '@angular/core';

      const a = 1;
      const b = 2;
      const c = 3;
      const d = 4;

    `,
    );
    expect(tree.readText('file2.ts')).toEqual('// eslint-disable');
  });

  it('should remove next line inline comments', () => {
    const tree = new EmptyTree();
    tree.create(
      'file.ts',
      stripIndent`
      import { Component } from '@angular/core';

      // eslint-disable-next-line rule1
      const a = 1;
      // eslint-disable-next-line rule1, rule2
      const b = 2;
      // eslint-disable-next-line rule3, rule1, rule2
      const c = 3;
      const d = 4;

    `,
    );
    removeEslintDisableComment({ ruleNames: ['rule4', 'rule1'] })(tree);
    expect(tree.readText('file.ts')).toEqual(
      stripIndent`
      import { Component } from '@angular/core';


      const a = 1;
      // eslint-disable-next-line rule2
      const b = 2;
      // eslint-disable-next-line rule2, rule3
      const c = 3;
      const d = 4;

    `,
    );
  });

  it('should remove next line block comments', () => {
    const tree = new EmptyTree();
    tree.create(
      'file.ts',
      stripIndent`
      import { Component } from '@angular/core';

      /* eslint-disable-next-line rule1 */
      const a = 1;
      /* eslint-disable-next-line rule1, rule2 */
      const b = 2;
      /* eslint-disable-next-line rule3, rule1, rule2 */
      const c = 3;
      const d = 4;

    `,
    );
    removeEslintDisableComment({ ruleNames: ['rule1'] })(tree);
    expect(tree.readText('file.ts')).toEqual(
      stripIndent`
      import { Component } from '@angular/core';


      const a = 1;
      /* eslint-disable-next-line rule2 */
      const b = 2;
      /* eslint-disable-next-line rule2, rule3 */
      const c = 3;
      const d = 4;

    `,
    );
  });

  it('should remove same line inline comments', () => {
    const tree = new EmptyTree();
    tree.create(
      'file.ts',
      stripIndent`
      import { Component } from '@angular/core';

      const a = 1; // eslint-disable rule1
      const b = 2; // eslint-disable rule1, rule2
      const c = 3; // eslint-disable rule3, rule1, rule2
      const d = 4;

    `,
    );
    removeEslintDisableComment({ ruleNames: ['rule1'] })(tree);
    expect(tree.readText('file.ts')).toEqual(
      stripIndent`
      import { Component } from '@angular/core';

      const a = 1;
      const b = 2; // eslint-disable rule2
      const c = 3; // eslint-disable rule2, rule3
      const d = 4;

    `,
    );
  });

  it('should remove same line block comments', () => {
    const tree = new EmptyTree();
    tree.create(
      'file.ts',
      stripIndent`
      import { Component } from '@angular/core';

      const a = 1; /* eslint-disable rule1 */
      const b = 2; /* eslint-disable rule1, rule2 */
      const c = 3; /* eslint-disable rule3, rule1, rule2 */
      const d = 4;

    `,
    );
    removeEslintDisableComment({ ruleNames: ['rule1'] })(tree);
    expect(tree.readText('file.ts')).toEqual(
      stripIndent`
      import { Component } from '@angular/core';

      const a = 1;
      const b = 2; /* eslint-disable rule2 */
      const c = 3; /* eslint-disable rule2, rule3 */
      const d = 4;

    `,
    );
  });
});
