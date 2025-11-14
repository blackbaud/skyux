import { callRule, externalSchematic } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../testing/scaffold';

jest.mock('@angular-devkit/schematics', () => {
  const schematics = jest.requireActual('@angular-devkit/schematics');
  return {
    ...schematics,
    externalSchematic: jest.fn().mockReturnValue(jest.fn()),
    callRule: jest.fn((rule, tree) => {
      // Default implementation - just return the tree as an observable
      const { of } = jest.requireActual('rxjs');
      return of(tree);
    }),
  };
});

/* eslint-disable @cspell/spellchecker */
const dateTime = `import * as i0 from '@angular/core';

declare class SkyDatePipe {}
declare class SkyFuzzyDatePipe {}

declare class SkyDatePipeModule {
  static ɵfac: i0.ɵɵFactoryDeclaration<SkyDatePipeModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<SkyDatePipeModule, never, [typeof SkyDatePipe, typeof SkyFuzzyDatePipe], [typeof SkyDatePipe, typeof SkyFuzzyDatePipe]>;
  static ɵinj: i0.ɵɵInjectorDeclaration<SkyDatePipeModule>;
}

export { SkyDatePipeModule, SkyDatePipe };
`;

const modals = `import * as i0 from '@angular/core';

declare class SkyModalComponent {}
declare class SkyModalContentComponent {}
declare class SkyModalFooterComponent {}
declare class SkyModalHeaderComponent {}
declare class SkyModalIsDirtyDirective {}

declare class SkyModalModule {
  static ɵfac: i0.ɵɵFactoryDeclaration<SkyModalModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<SkyModalModule, never, [
    typeof SkyModalComponent,
    typeof SkyModalContentComponent,
    typeof SkyModalFooterComponent,
    typeof SkyModalHeaderComponent,
    typeof SkyModalIsDirtyDirective
  ], [typeof SkyModalComponent, typeof SkyModalContentComponent, typeof SkyModalFooterComponent, typeof SkyModalHeaderComponent, typeof SkyModalIsDirtyDirective]>;
  static ɵinj: i0.ɵɵInjectorDeclaration<SkyModalModule>;
}

export { SkyModalModule, SkyModalComponent as λ5, SkyModalLegacyService, SkyModalService };
`;
/* eslint-enable @cspell/spellchecker */

describe('standalone', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../collection.json'),
  );

  async function setup(): Promise<{
    tree: UnitTestTree;
    runSchematic: () => Promise<UnitTestTree>;
  }> {
    const tree = await createTestApp(runner, {
      projectName: 'my-test-app',
    });
    tree.create('node_modules/@skyux/datetime/index.d.ts', dateTime);
    tree.create('node_modules/@skyux/modals/index.d.ts', modals);

    return {
      tree,
      runSchematic: async () =>
        await runner.runSchematic('standalone-migration', {}, tree),
    };
  }

  it('should migrate a standalone component to use SKY UX modules', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component } from '@angular/core';
    import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
    import { SkyModalComponent } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div>{{ test | async }}</div>',
      imports: [AsyncPipe, NgTemplateOutlet, SkyModalComponent],
    })
    export class TestComponent {}
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toEqual(`
    import { Component } from '@angular/core';
    import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
    import {  SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div>{{ test | async }}</div>',
      imports: [AsyncPipe, NgTemplateOutlet, SkyModalModule],
    })
    export class TestComponent {}
    `);
  });

  it('should migrate a standalone component with a single import to use SKY UX modules', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component } from '@angular/core';
    import { SkyModalComponent } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [SkyModalComponent],
    })
    export class TestComponent {}
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toEqual(`
    import { Component } from '@angular/core';
    import {  SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [SkyModalModule],
    })
    export class TestComponent {}
    `);
  });

  it('should migrate a standalone component with λ imports to use SKY UX modules', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component } from '@angular/core';
    import { λ5 } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [λ5],
    })
    export class TestComponent {}
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toEqual(`
    import { Component } from '@angular/core';
    import {  SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [SkyModalModule],
    })
    export class TestComponent {}
    `);
  });

  it('should migrate a standalone component with λ and other imports to use SKY UX modules', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component } from '@angular/core';
    import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
    import { λ5 } from '@skyux/modals';

    import { BehaviorSubject } from 'rxjs';

    @Component({
      selector: 'app-test',
      template: '<div>{{ test | async }}</div>',
      imports: [λ5, AsyncPipe, NgTemplateOutlet],
    })
    export class TestComponent {
      protected readonly test = new BehaviorSubject<number>(1);
    }
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toEqual(`
    import { Component } from '@angular/core';
    import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
    import {  SkyModalModule } from '@skyux/modals';

    import { BehaviorSubject } from 'rxjs';

    @Component({
      selector: 'app-test',
      template: '<div>{{ test | async }}</div>',
      imports: [AsyncPipe, NgTemplateOutlet, SkyModalModule],
    })
    export class TestComponent {
      protected readonly test = new BehaviorSubject<number>(1);
    }
    `);
  });

  it('should migrate a standalone component with injected SKY UX pipes', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component, inject } from '@angular/core';
    import { SkyDatePipe, SkyFuzzyDatePipe } from '@skyux/datetime';

    @Component({
      selector: 'app-test',
      template: \`
        <div>{{ test | skyDate }}</div>
        <div>{{ test | skyFuzzyDate }}</div>
      \`,
      imports: [SkyDatePipe, SkyFuzzyDatePipe],
    })
    export class TestComponent {
      protected readonly datePipe = inject(SkyDatePipe);

      constructor(protected fuzzyDataPipe: SkyFuzzyDatePipe) {}
    }
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toEqual(`
    import { Component, inject } from '@angular/core';
    import { SkyDatePipe, SkyFuzzyDatePipe, SkyDatePipeModule } from '@skyux/datetime';

    @Component({
      selector: 'app-test',
      template: \`
        <div>{{ test | skyDate }}</div>
        <div>{{ test | skyFuzzyDate }}</div>
      \`,
      imports: [SkyDatePipeModule],
    })
    export class TestComponent {
      protected readonly datePipe = inject(SkyDatePipe);

      constructor(protected fuzzyDataPipe: SkyFuzzyDatePipe) {}
    }
    `);
  });

  it('should migrate a legacy service', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component, inject } from '@angular/core';
    import { SkyModalLegacyService } from '@skyux/modals';

    import { TestModalComponent } from './test-modal.component';

    @Component({
      selector: 'app-test',
      template: \`
        <div>{{ test | skyDate }}</div>
        <div>{{ test | skyFuzzyDate }}</div>
      \`,
      imports: [SkyDatePipe, SkyFuzzyDatePipe],
    })
    export class TestComponent {
      readonly #modalSvc = inject(SkyModalLegacyService);

      protected openModal(): void {
        this.#modalSvc.open(TestModalComponent);
      }
    }
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toEqual(`
    import { Component, inject } from '@angular/core';
    import { SkyModalService } from '@skyux/modals';

    import { TestModalComponent } from './test-modal.component';

    @Component({
      selector: 'app-test',
      template: \`
        <div>{{ test | skyDate }}</div>
        <div>{{ test | skyFuzzyDate }}</div>
      \`,
      imports: [SkyDatePipe, SkyFuzzyDatePipe],
    })
    export class TestComponent {
      readonly #modalSvc = inject(SkyModalService);

      protected openModal(): void {
        this.#modalSvc.open(TestModalComponent);
      }
    }
    `);
  });

  it('should migrate a test', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.spec.ts',
      `
    import { TestBed } from '@angular/core/testing';
    import { λ5 } from '@skyux/modals';

    describe('TestComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [λ5],
        });
      });
    });
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.spec.ts')).toEqual(`
    import { TestBed } from '@angular/core/testing';
    import {  SkyModalModule } from '@skyux/modals';

    describe('TestComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [SkyModalModule],
        });
      });
    });
    `);
  });

  it('should do nothing on a component', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component } from '@angular/core';
    import { SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [SkyModalModule],
    })
    export class TestComponent {}
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toEqual(`
    import { Component } from '@angular/core';
    import { SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [SkyModalModule],
    })
    export class TestComponent {}
    `);
  });

  it('should do nothing on a service', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.service.ts',
      `
    import { Injectable, inject } from '@angular/core';
    import { SkyDatePipe } from '@skyux/datetime';

    @Injectable({
      providedIn: 'root',
    })
    export class TestService {
      public datePipe = inject(SkyDatePipe);
    }
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.service.ts')).toEqual(`
    import { Injectable, inject } from '@angular/core';
    import { SkyDatePipe } from '@skyux/datetime';

    @Injectable({
      providedIn: 'root',
    })
    export class TestService {
      public datePipe = inject(SkyDatePipe);
    }
    `);
  });

  it('should do nothing on a second component in the same file', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component } from '@angular/core';
    import { λ5 } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<sky-modal></sky-modal>',
      imports: [λ5],
    })
    export class TestComponent {}

    @Component({
      selector: 'app-other',
      template: '<div></div>',
      imports: [],
    })
    export class OtherComponent {}
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toEqual(`
    import { Component } from '@angular/core';
    import {  SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<sky-modal></sky-modal>',
      imports: [SkyModalModule],
    })
    export class TestComponent {}

    @Component({
      selector: 'app-other',
      template: '<div></div>',
      imports: [],
    })
    export class OtherComponent {}
    `);
  });

  it('should provide for a pipe that is injected in a component', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component, Directive } from '@angular/core';
    import { SkyDatePipe } from '@skyux/datetime';

    @Component({
      selector: 'app-test',
      template: '<div>{{ test | async }}</div>',
      styles: 'display: block;',
    })
    export class Test1Component {
      readonly #pipe = inject(SkyDatePipe);
    }

    @Component({ selector: 'app-test', template: '<div>{{ test | async }}</div>' })
    export class Test2Component {
      readonly #pipe = inject(SkyDatePipe);
    }

    @Component({
      template: '<div>{{ test | async }}</div>',
    })
    export class Test3Component {
      readonly #pipe = inject(SkyDatePipe);
    }

    @Component({ template: '<div>{{ test | async }}</div>' })
    export class Test3Component {
      readonly #pipe = inject(SkyDatePipe);
    }

    @Directive({})
    export class TestDirective {
      readonly #pipe = inject(SkyDatePipe);
    }
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toEqual(`
    import { Component, Directive } from '@angular/core';
    import { SkyDatePipe, SkyDatePipeModule } from '@skyux/datetime';

    @Component({
      selector: 'app-test',
      template: '<div>{{ test | async }}</div>',
      styles: 'display: block;',
      imports: [SkyDatePipeModule],
    })
    export class Test1Component {
      readonly #pipe = inject(SkyDatePipe);
    }

    @Component({ selector: 'app-test', template: '<div>{{ test | async }}</div>', imports: [SkyDatePipeModule] })
    export class Test2Component {
      readonly #pipe = inject(SkyDatePipe);
    }

    @Component({
      template: '<div>{{ test | async }}</div>', imports: [SkyDatePipeModule]
    })
    export class Test3Component {
      readonly #pipe = inject(SkyDatePipe);
    }

    @Component({ template: '<div>{{ test | async }}</div>' , imports: [SkyDatePipeModule]})
    export class Test3Component {
      readonly #pipe = inject(SkyDatePipe);
    }

    @Directive({imports: [SkyDatePipeModule]})
    export class TestDirective {
      readonly #pipe = inject(SkyDatePipe);
    }
    `);
  });

  it('should call angular standalone first', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component } from '@angular/core';
    import { SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [SkyModalModule],
    })
    export class TestComponent {}
    `,
    );
    await runner.runSchematic('standalone-migration', {}, tree);
    expect(externalSchematic).toHaveBeenCalledWith(
      '@angular/core',
      'standalone-migration',
      {
        mode: 'convert-to-standalone',
        path: '',
      },
      {
        interactive: false,
      },
    );
  });

  it('should handle missing install', async () => {
    const { tree } = await setup();
    tree.create(
      'src/app/test.component.ts',
      `
    import { Component } from '@angular/core';
    import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
    import { λ5 } from '@skyux/missing';

    @Component({
      selector: 'app-test',
      template: '<div>{{ test | async }}</div>',
      imports: [AsyncPipe, NgTemplateOutlet, λ5],
    })
    export class TestComponent {}
    `,
    );
    await expect(
      runner.runSchematic('standalone-migration', {}, tree),
    ).rejects.toThrowError(
      `Could not find package @skyux/missing -- please run 'npm install'.`,
    );
  });

  describe('ngCoreSchematic error handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should catch and ignore "Could not find any files to migrate" errors', async () => {
      const { throwError } = require('rxjs');
      const mockCallRule = callRule as jest.MockedFunction<typeof callRule>;
      mockCallRule.mockReturnValueOnce(
        throwError(
          () => new Error('Could not find any files to migrate under path ""'),
        ),
      );

      const { tree } = await setup();
      tree.create(
        'src/app/test.component.ts',
        `
    import { Component } from '@angular/core';
    import { SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [SkyModalModule],
    })
    export class TestComponent {}
    `,
      );

      // Should not throw error
      await expect(
        runner.runSchematic('standalone-migration', {}, tree),
      ).resolves.toBeDefined();
    });

    it('should wrap other errors with descriptive message', async () => {
      const { throwError } = require('rxjs');
      const mockCallRule = callRule as jest.MockedFunction<typeof callRule>;
      mockCallRule.mockReturnValueOnce(
        throwError(() => new Error('Some Angular schematic error')),
      );

      const { tree } = await setup();
      tree.create(
        'src/app/test.component.ts',
        `
    import { Component } from '@angular/core';
    import { SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [SkyModalModule],
    })
    export class TestComponent {}
    `,
      );

      await expect(
        runner.runSchematic('standalone-migration', {}, tree),
      ).rejects.toThrowError('Error while converting to standalone modules');
    });

    it('should preserve original error as cause', async () => {
      const { throwError } = require('rxjs');
      const originalError = new Error('Original Angular schematic error');
      const mockCallRule = callRule as jest.MockedFunction<typeof callRule>;
      mockCallRule.mockReturnValueOnce(throwError(() => originalError));

      const { tree } = await setup();
      tree.create(
        'src/app/test.component.ts',
        `
    import { Component } from '@angular/core';
    import { SkyModalModule } from '@skyux/modals';

    @Component({
      selector: 'app-test',
      template: '<div></div>',
      imports: [SkyModalModule],
    })
    export class TestComponent {}
    `,
      );

      try {
        await runner.runSchematic('standalone-migration', {}, tree);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          'Error while converting to standalone modules',
        );
        expect((error as Error).cause).toBe(originalError);
      }
    });
  });
});
