import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { resolve } from 'path';

import { createTestApp } from '../../../testing/scaffold';

describe('Fix Imports', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    resolve(__dirname, '../../../../../migrations.json'),
  );

  it('should convert deep import to shallow import', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyBreakpoint } from '@skyux/core/lib/modules/breakpoint-observer/breakpoint';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {
        constructor() {
          console.log(SkyBreakpoint.xs);
        }
      }
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';
      import { SkyBreakpoint } from '@skyux/core';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {
        constructor() {
          console.log(SkyBreakpoint.xs);
        }
      }
    `;
    await runner.runSchematic('fix-imports', {}, tree);
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should convert multiple deep imports to shallow imports', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyBreakpoint } from '@skyux/core/lib/modules/breakpoint-observer/breakpoint';
      import { SkyModalConfigurationInterface } from '@skyux/modals/lib/modules/modal/modal.interface';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';
      import { SkyBreakpoint } from '@skyux/core';
      import { SkyModalConfigurationInterface } from '@skyux/modals';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    await runner.runSchematic('fix-imports', {}, tree);
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should handle mixed imports (some deep, some shallow)', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyBreakpoint } from '@skyux/core/lib/modules/breakpoint-observer/breakpoint';
      import { SkyModule } from '@skyux/core';
      import { Observable } from 'rxjs';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';
      import { SkyBreakpoint } from '@skyux/core';
      import { SkyModule } from '@skyux/core';
      import { Observable } from 'rxjs';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    await runner.runSchematic('fix-imports', {}, tree);
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should update SkyPageModule import from @skyux/layout', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyPageModule } from '@skyux/layout';
      import { SkyModule } from '@skyux/core';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';
      import { SkyPageModule } from '@skyux/pages';
      import { SkyModule } from '@skyux/core';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    await runner.runSchematic('fix-imports', {}, tree);
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should update SkyPageModule import from @skyux/layout with other imports preceding', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyBoxModule, SkyPageModule } from '@skyux/layout';
      import { SkyModule } from '@skyux/core';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';
      import { SkyBoxModule } from '@skyux/layout';
      import { SkyModule } from '@skyux/core';
      import { SkyPageModule } from '@skyux/pages';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    await runner.runSchematic('fix-imports', {}, tree);
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should update SkyPageModule import from @skyux/layout with other imports', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyPageModule, SkyToolbarModule } from '@skyux/layout';
      import { SkyModule } from '@skyux/core';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';
      import { SkyToolbarModule } from '@skyux/layout';
      import { SkyModule } from '@skyux/core';
      import { SkyPageModule } from '@skyux/pages';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    await runner.runSchematic('fix-imports', {}, tree);
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should not modify files without deep imports', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyModule } from '@skyux/core';
      import { Observable } from 'rxjs';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    await runner.runSchematic('fix-imports', {}, tree);
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      input,
    );
  });

  it('should handle all known deep import patterns', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { CellEditorLookupParams } from '@skyux/ag-grid/lib/modules/ag-grid/types/cell-editor-lookup-params';
      import { SkyModalInterface } from '@skyux/modals/lib/modules/modal/modal.interface';
      import { SkyLookupShowMorePickerHarness } from '@skyux/lookup/testing/modules/lookup/lookup-show-more-picker-harness';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';
      import { CellEditorLookupParams } from '@skyux/ag-grid';
      import { SkyModalInterface } from '@skyux/modals';
      import { SkyLookupShowMorePickerHarness } from '@skyux/lookup/testing';

      @Component({
        selector: 'app-test',
        template: '<div></div>',
      })
      export class TestComponent {}
    `;
    await runner.runSchematic('fix-imports', {}, tree);
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should not modify non-TypeScript files', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <div>
        Some HTML content that mentions @skyux/core/lib/modules/breakpoint-observer/breakpoint
      </div>
    `;
    tree.create('src/app/test.component.html', input);
    await runner.runSchematic('fix-imports', {}, tree);
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      input,
    );
  });

  it('should handle imports with different quote styles', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = `import { Component } from '@angular/core';
import { SkyBreakpoint } from "@skyux/core/lib/modules/breakpoint-observer/breakpoint";

@Component({
  selector: 'app-test',
  template: '<div></div>',
})
export class TestComponent {}`;
    tree.create('src/app/test.component.ts', input);
    const output = `import { Component } from '@angular/core';
import { SkyBreakpoint } from "@skyux/core";

@Component({
  selector: 'app-test',
  template: '<div></div>',
})
export class TestComponent {}`;
    await runner.runSchematic('fix-imports', {}, tree);
    expect(tree.readText('src/app/test.component.ts')).toBe(output);
  });
});
