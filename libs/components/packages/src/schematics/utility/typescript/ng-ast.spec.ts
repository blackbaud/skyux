import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { getInlineTemplates } from './ng-ast';

describe('ng-ast', () => {
  it('should get inline templates', () => {
    const sourceText = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        template: '<div>Hello</div>'
      })
      export class TestComponent {}
    `;
    const sourceFile = ts.createSourceFile(
      'test.ts',
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    expect(getInlineTemplates(sourceFile)).toEqual([{ start: 90, end: 106 }]);
    expect(sourceText.slice(90, 106)).toBe('<div>Hello</div>');
  });
});
