import {
  stripIndent,
  stripIndents,
} from '@angular-devkit/core/src/utils/literals';
import { Tree } from '@angular-devkit/schematics';

import {
  importExportedStandalone,
  swapModuleForStandalone,
} from './swap-module-for-standalone';

describe('swap-module-for-standalone', () => {
  const FILE_PATH = 'foo.ts';

  function createTree(content: string): Tree {
    const tree = Tree.empty();
    tree.create(FILE_PATH, content);

    return tree;
  }

  describe('swapModuleForStandalone', () => {
    function swap(content: string): { result: string; swapped: boolean } {
      const tree = createTree(content);
      const swapped = swapModuleForStandalone(
        tree,
        FILE_PATH,
        { className: 'OldModule', packageName: '@old/pkg' },
        { className: 'NewComponent', packageName: '@new/pkg' },
      );

      return { result: tree.readText(FILE_PATH), swapped };
    }

    it('should swap the module for the standalone class in component imports', () => {
      const { result, swapped } = swap(stripIndents`
        import { Component } from '@angular/core';
        import { OldModule } from '@old/pkg';

        @Component({
          selector: 'app-foo',
          imports: [OldModule],
          template: '',
        })
        export class FooComponent {}
      `);

      expect(swapped).toBe(true);
      expect(result).toEqual(stripIndents`
        import { Component } from '@angular/core';
        import { NewComponent } from '@new/pkg';

        @Component({
          selector: 'app-foo',
          imports: [NewComponent],
          template: '',
        })
        export class FooComponent {}
      `);
    });

    it('should swap the module in NgModule imports and exports', () => {
      const { result } = swap(stripIndents`
        import { NgModule } from '@angular/core';
        import { OldModule } from '@old/pkg';

        @NgModule({
          imports: [OldModule],
          exports: [OldModule],
        })
        export class SharedModule {}
      `);

      expect(result).toEqual(stripIndents`
        import { NgModule } from '@angular/core';
        import { NewComponent } from '@new/pkg';

        @NgModule({
          imports: [NewComponent],
          exports: [NewComponent],
        })
        export class SharedModule {}
      `);
    });

    it('should swap the module in TestBed imports', () => {
      const { result } = swap(stripIndents`
        import { TestBed } from '@angular/core/testing';
        import { OldModule } from '@old/pkg';

        TestBed.configureTestingModule({
          imports: [OldModule],
        });
      `);

      expect(result).toEqual(stripIndents`
        import { TestBed } from '@angular/core/testing';
        import { NewComponent } from '@new/pkg';

        TestBed.configureTestingModule({
          imports: [NewComponent],
        });
      `);
    });

    it('should also import the standalone class in an NgModule that only exports the module', () => {
      const { result } = swap(stripIndent`
        import { NgModule } from '@angular/core';
        import { OldModule } from '@old/pkg';

        @NgModule({
          exports: [OldModule],
        })
        export class SharedModule {}
      `);

      expect(result).toEqual(stripIndent`
        import { NgModule } from '@angular/core';
        import { NewComponent } from '@new/pkg';

        @NgModule({
          exports: [NewComponent],
          imports: [
            NewComponent
          ],
        })
        export class SharedModule {}
      `);
    });

    it('should keep other imports from the old package', () => {
      const { result } = swap(stripIndents`
        import { OldModule, OtherModule } from '@old/pkg';

        export const IMPORTS = [OtherModule, OldModule];
      `);

      expect(result).toEqual(stripIndents`
        import { OtherModule } from '@old/pkg';
        import { NewComponent } from '@new/pkg';

        export const IMPORTS = [OtherModule, NewComponent];
      `);
    });

    it('should add the standalone class to an existing import from its package', () => {
      const { result } = swap(stripIndents`
        import { OldModule } from '@old/pkg';
        import { OtherComponent } from '@new/pkg';

        export const IMPORTS = [OtherComponent, OldModule];
      `);

      expect(result).toEqual(stripIndents`
        import { OtherComponent, NewComponent } from '@new/pkg';

        export const IMPORTS = [OtherComponent, NewComponent];
      `);
    });

    it('should not list the standalone class twice in a metadata array', () => {
      const { result } = swap(stripIndents`
        import { Component } from '@angular/core';
        import { OldModule } from '@old/pkg';
        import { NewComponent } from '@new/pkg';

        @Component({
          selector: 'app-foo',
          imports: [NewComponent, OldModule],
          template: '',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [OldModule],
          template: '',
        })
        export class BarComponent {}
      `);

      expect(result).toEqual(stripIndents`
        import { Component } from '@angular/core';
        import { NewComponent } from '@new/pkg';

        @Component({
          selector: 'app-foo',
          imports: [NewComponent],
          template: '',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [NewComponent],
          template: '',
        })
        export class BarComponent {}
      `);
    });

    it('should swap the module in a plain array that lists the standalone class', () => {
      const { result } = swap(stripIndents`
        import { OldModule } from '@old/pkg';
        import { NewComponent } from '@new/pkg';

        export const IMPORTS = [OldModule, NewComponent];
      `);

      // The duplicate is harmless: Angular de-duplicates `imports`.
      expect(result).toEqual(stripIndents`
        import { NewComponent } from '@new/pkg';

        export const IMPORTS = [NewComponent, NewComponent];
      `);
    });

    it('should use the local name of an aliased standalone class import', () => {
      const { result } = swap(stripIndents`
        import { Component } from '@angular/core';
        import { OldModule } from '@old/pkg';
        import { NewComponent as Renamed } from '@new/pkg';

        @Component({
          selector: 'app-foo',
          imports: [Renamed, OldModule],
          template: '',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [OldModule],
          template: '',
        })
        export class BarComponent {}
      `);

      expect(result).toEqual(stripIndents`
        import { Component } from '@angular/core';
        import { NewComponent as Renamed } from '@new/pkg';

        @Component({
          selector: 'app-foo',
          imports: [Renamed],
          template: '',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [Renamed],
          template: '',
        })
        export class BarComponent {}
      `);
    });

    it('should not change a file that does not import the module', () => {
      const content = stripIndents`
        import { OldModule } from './local';

        export const IMPORTS = [OldModule];
      `;

      const { result, swapped } = swap(content);

      expect(swapped).toBe(false);
      expect(result).toEqual(content);
    });

    describe('multi-line formatting', () => {
      it('should remove the module when it is last in a multi-line import', () => {
        const { result } = swap(stripIndent`
          import {
            OtherModule,
            OldModule,
          } from '@old/pkg';

          export const IMPORTS = [OtherModule, OldModule];
        `);

        expect(result).toEqual(stripIndent`
          import {
            OtherModule,
          } from '@old/pkg';
          import { NewComponent } from '@new/pkg';

          export const IMPORTS = [OtherModule, NewComponent];
        `);
      });

      it('should remove the module when it is first in a multi-line import', () => {
        const { result } = swap(stripIndent`
          import {
            OldModule,
            OtherModule,
          } from '@old/pkg';

          export const IMPORTS = [OldModule, OtherModule];
        `);

        expect(result).toEqual(stripIndent`
          import {
            OtherModule,
          } from '@old/pkg';
          import { NewComponent } from '@new/pkg';

          export const IMPORTS = [NewComponent, OtherModule];
        `);
      });

      it('should remove a multi-line import that only imports the module', () => {
        const { result } = swap(stripIndent`
          import { Component } from '@angular/core';
          import {
            OldModule,
          } from '@old/pkg';

          export const IMPORTS = [OldModule];
        `);

        expect(result).toEqual(stripIndent`
          import { Component } from '@angular/core';
          import { NewComponent } from '@new/pkg';

          export const IMPORTS = [NewComponent];
        `);
      });

      it.each([
        ['first', ['OldModule', 'CommonModule', 'FormsModule']],
        ['in the middle', ['CommonModule', 'OldModule', 'FormsModule']],
        ['last', ['CommonModule', 'FormsModule', 'OldModule']],
        ['alone', ['OldModule']],
      ])(
        'should swap the module %s in multi-line metadata arrays',
        (_position, names) => {
          function toFile(moduleImport: string, moduleName: string): string {
            const array = (field: string): string[] => [
              `  ${field}: [`,
              ...names.map(
                (name) => `    ${name === 'OldModule' ? moduleName : name},`,
              ),
              '  ],',
            ];

            return [
              `import { Component, NgModule } from '@angular/core';`,
              `import { TestBed } from '@angular/core/testing';`,
              moduleImport,
              '',
              '@Component({',
              `  selector: 'app-foo',`,
              ...array('imports'),
              `  template: '',`,
              '})',
              'export class FooComponent {}',
              '',
              '@NgModule({',
              ...array('imports'),
              ...array('exports'),
              '})',
              'export class FooModule {}',
              '',
              'TestBed.configureTestingModule({',
              ...array('imports'),
              '});',
            ].join('\n');
          }

          const { result } = swap(
            toFile(`import { OldModule } from '@old/pkg';`, 'OldModule'),
          );

          expect(result).toEqual(
            toFile(`import { NewComponent } from '@new/pkg';`, 'NewComponent'),
          );
        },
      );

      it('should remove the module first in a multi-line array that lists the standalone class', () => {
        const { result } = swap(stripIndent`
          import { NgModule } from '@angular/core';
          import { OldModule } from '@old/pkg';
          import { NewComponent } from '@new/pkg';

          @NgModule({
            imports: [
              OldModule,
              NewComponent,
            ],
            exports: [
              OldModule,
              NewComponent,
            ],
          })
          export class FooModule {}
        `);

        expect(result).toEqual(stripIndent`
          import { NgModule } from '@angular/core';
          import { NewComponent } from '@new/pkg';

          @NgModule({
            imports: [
              NewComponent,
            ],
            exports: [
              NewComponent,
            ],
          })
          export class FooModule {}
        `);
      });

      it('should remove the module last in a multi-line array that lists the standalone class', () => {
        const { result } = swap(stripIndent`
          import { Component } from '@angular/core';
          import { OldModule } from '@old/pkg';
          import { NewComponent } from '@new/pkg';

          @Component({
            selector: 'app-foo',
            imports: [
              NewComponent,
              OldModule,
            ],
            template: '',
          })
          export class FooComponent {}
        `);

        expect(result).toEqual(stripIndent`
          import { Component } from '@angular/core';
          import { NewComponent } from '@new/pkg';

          @Component({
            selector: 'app-foo',
            imports: [
              NewComponent,
            ],
            template: '',
          })
          export class FooComponent {}
        `);
      });

      it('should remove the module in the middle of a multi-line TestBed array that lists the standalone class', () => {
        const { result } = swap(stripIndent`
          import { TestBed } from '@angular/core/testing';
          import { OldModule } from '@old/pkg';
          import { NewComponent } from '@new/pkg';

          TestBed.configureTestingModule({
            imports: [
              NewComponent,
              OldModule,
              FooComponent,
            ],
          });
        `);

        expect(result).toEqual(stripIndent`
          import { TestBed } from '@angular/core/testing';
          import { NewComponent } from '@new/pkg';

          TestBed.configureTestingModule({
            imports: [
              NewComponent,
              FooComponent,
            ],
          });
        `);
      });

      it('should not import the standalone class again when a multi-line import has it', () => {
        const { result } = swap(stripIndent`
          import { Component } from '@angular/core';
          import {
            OldModule,
            OtherModule,
          } from '@old/pkg';
          import {
            NewComponent,
          } from '@new/pkg';

          @Component({
            selector: 'app-foo',
            imports: [NewComponent],
            template: '',
          })
          export class FooComponent {}

          @Component({
            selector: 'app-bar',
            imports: [
              OtherModule,
              OldModule,
            ],
            template: '',
          })
          export class BarComponent {}
        `);

        expect(result).toEqual(stripIndent`
          import { Component } from '@angular/core';
          import {
            OtherModule,
          } from '@old/pkg';
          import {
            NewComponent,
          } from '@new/pkg';

          @Component({
            selector: 'app-foo',
            imports: [NewComponent],
            template: '',
          })
          export class FooComponent {}

          @Component({
            selector: 'app-bar',
            imports: [
              OtherModule,
              NewComponent,
            ],
            template: '',
          })
          export class BarComponent {}
        `);
      });
    });
  });

  describe('importExportedStandalone', () => {
    function importExported(content: string): string {
      const tree = createTree(content);
      importExportedStandalone(tree, FILE_PATH, 'NewComponent');

      return tree.readText(FILE_PATH);
    }

    it('should add an exported class to an NgModule with no imports', () => {
      const result = importExported(stripIndent`
        import { NgModule } from '@angular/core';

        @NgModule({
          exports: [NewComponent],
        })
        export class SharedModule {}
      `);

      expect(result).toEqual(stripIndent`
        import { NgModule } from '@angular/core';

        @NgModule({
          exports: [NewComponent],
          imports: [
            NewComponent
          ],
        })
        export class SharedModule {}
      `);
    });

    it('should add an exported class to existing NgModule imports', () => {
      const result = importExported(stripIndents`
        import { NgModule } from '@angular/core';

        @NgModule({
          imports: [CommonModule],
          exports: [NewComponent],
        })
        export class SharedModule {}
      `);

      expect(result).toEqual(stripIndents`
        import { NgModule } from '@angular/core';

        @NgModule({
          imports: [CommonModule, NewComponent],
          exports: [NewComponent],
        })
        export class SharedModule {}
      `);
    });

    it('should not change an NgModule that already imports the exported class', () => {
      const content = stripIndents`
        import { NgModule } from '@angular/core';

        @NgModule({
          imports: [NewComponent],
          exports: [NewComponent],
        })
        export class SharedModule {}
      `;

      expect(importExported(content)).toEqual(content);
    });

    it('should not change an NgModule that does not export the class', () => {
      const content = stripIndents`
        import { NgModule } from '@angular/core';

        @NgModule({
          exports: [OtherComponent],
        })
        export class SharedModule {}
      `;

      expect(importExported(content)).toEqual(content);
    });
  });
});
