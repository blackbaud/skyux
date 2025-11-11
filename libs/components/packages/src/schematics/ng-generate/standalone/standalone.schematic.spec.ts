import { externalSchematic } from '@angular-devkit/schematics';
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
  };
});

const dateTime = `import * as i0 from '@angular/core';

declare class SkyDatePipe {}

declare class SkyDatePipeModule {
  static ɵfac: i0.ɵɵFactoryDeclaration<SkyDatePipeModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<SkyDatePipeModule, never, [typeof SkyDatePipe], [typeof SkyDatePipe]>;
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

export { SkyModalModule, SkyModalComponent as λ5 };
`;

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

  it('should do nothing', async () => {
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
        interactive: false,
        mode: 'convert-to-standalone',
        path: '',
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
});
