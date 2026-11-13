import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { Tree } from '@angular-devkit/schematics';

import { isModuleUsedByFile } from './is-module-used-by-file';

describe('is-module-used-by-file', () => {
  const FILE_PATH = 'app/foo.ts';

  function isUsed(files: Record<string, string>): boolean {
    const tree = Tree.empty();

    for (const [filePath, content] of Object.entries(files)) {
      tree.create(filePath, content);
    }

    return isModuleUsedByFile(
      tree,
      FILE_PATH,
      ['OldModule', 'AggregateModule'],
      ['old-element', 'new-element'],
    );
  }

  function component(name: string, templateProperty: string): string {
    return stripIndents`
      import { Component } from '@angular/core';
      import { OldModule } from '@old/pkg';

      @Component({
        selector: 'app-${name}',
        imports: [OldModule],
        ${templateProperty},
      })
      export class ${name}Component {}
    `;
  }

  function declaringModule(declarationImport: string): string {
    return stripIndents`
      import { NgModule } from '@angular/core';
      import { OldModule } from '@old/pkg';

      ${declarationImport}

      @NgModule({
        declarations: [QuoteComponent],
        imports: [OldModule],
      })
      export class FooModule {}
    `;
  }

  const declaredComponent = (templateUrl: string): string => stripIndents`
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-quote',
      standalone: false,
      templateUrl: '${templateUrl}',
    })
    export class QuoteComponent {}
  `;

  describe('components in the file', () => {
    it.each([
      ['an inline template', `template: '<old-element>Quote</old-element>'`],
      ['another element name', `template: '<new-element>Quote</new-element>'`],
    ])(
      'should return true when %s renders the element',
      (_description, property) => {
        expect(isUsed({ [FILE_PATH]: component('Foo', property) })).toBe(true);
      },
    );

    it('should return false when the inline template does not render the element', () => {
      expect(
        isUsed({
          [FILE_PATH]: component('Foo', `template: '<p>No element</p>'`),
        }),
      ).toBe(false);
    });

    it('should read a templateUrl', () => {
      expect(
        isUsed({
          [FILE_PATH]: component('Foo', `templateUrl: './foo.html'`),
          'app/foo.html': '<old-element>Quote</old-element>',
        }),
      ).toBe(true);
      expect(
        isUsed({
          [FILE_PATH]: component('Foo', `templateUrl: './foo.html'`),
          'app/foo.html': '<p>No element</p>',
        }),
      ).toBe(false);
    });

    it('should count a templateUrl that does not exist as rendering the element', () => {
      expect(
        isUsed({
          [FILE_PATH]: component('Foo', `templateUrl: './missing.html'`),
        }),
      ).toBe(true);
    });
  });

  describe('declared components', () => {
    it('should return true when an NgModule declares a component that renders the element', () => {
      expect(
        isUsed({
          [FILE_PATH]: declaringModule(
            `import { QuoteComponent } from './quote';`,
          ),
          'app/quote.ts': declaredComponent('./quote.html'),
          'app/quote.html': '<old-element>Quote</old-element>',
        }),
      ).toBe(true);
    });

    it('should return false when the declared components do not render the element', () => {
      expect(
        isUsed({
          [FILE_PATH]: declaringModule(
            `import { QuoteComponent } from './quote';`,
          ),
          'app/quote.ts': declaredComponent('./quote.html'),
          'app/quote.html': '<p>No element</p>',
        }),
      ).toBe(false);
    });

    it('should check a TestBed declaration', () => {
      expect(
        isUsed({
          [FILE_PATH]: stripIndents`
            import { TestBed } from '@angular/core/testing';
            import { OldModule } from '@old/pkg';

            import { QuoteComponent } from './quote';

            TestBed.configureTestingModule({
              declarations: [QuoteComponent],
              imports: [OldModule],
            });
          `,
          'app/quote.ts': declaredComponent('./quote.html'),
          'app/quote.html': '<old-element>Quote</old-element>',
        }),
      ).toBe(true);
    });

    it('should return false for a component declared in the same file that does not render the element', () => {
      expect(
        isUsed({
          [FILE_PATH]: stripIndents`
            import { Component, NgModule } from '@angular/core';
            import { OldModule } from '@old/pkg';

            @Component({
              selector: 'app-quote',
              standalone: false,
              template: '<p>No element</p>',
            })
            export class QuoteComponent {}

            @NgModule({
              declarations: [QuoteComponent],
              imports: [OldModule],
            })
            export class FooModule {}
          `,
        }),
      ).toBe(false);
    });

    it.each([
      ['a missing file', {}],
      [
        'a barrel that does not define the class',
        { 'app/quote.ts': `export * from './quote.component';` },
      ],
    ])(
      'should count a declaration imported from %s as rendering the element',
      (_description, files) => {
        expect(
          isUsed({
            [FILE_PATH]: declaringModule(
              `import { QuoteComponent } from './quote';`,
            ),
            ...files,
          }),
        ).toBe(true);
      },
    );
  });

  describe('shared modules', () => {
    it.each([
      [
        'NgModule exports',
        `@NgModule({ exports: [AggregateModule] })\nexport class SharedModule {}`,
      ],
      ['a plain array', `export const IMPORTS = [AggregateModule];`],
      ['another reference', `export const SHARED = AggregateModule;`],
    ])('should return true when %s shares the module', (_description, code) => {
      expect(
        isUsed({
          [FILE_PATH]: `import { NgModule } from '@angular/core';\nimport { AggregateModule } from '@old/pkg';\n\n${code}`,
        }),
      ).toBe(true);
    });
  });
});
