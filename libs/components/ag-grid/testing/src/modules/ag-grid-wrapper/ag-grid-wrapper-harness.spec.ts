import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyInlineDeleteHarness } from '@skyux/layout/testing';

import { provideSkyAgGridTesting } from '../ag-grid/provide-ag-grid-testing';
import { SkyAgGridWrapperHarness } from './ag-grid-wrapper-harness';
import { AgGridTestComponent } from './fixtures/ag-grid-test.component';

@Component({
  selector: 'app-test',
  template: `<sky-ag-grid-wrapper data-sky-id="wrapper" />`,
  imports: [SkyAgGridModule],
})
class TestComponent {}

@Component({
  selector: 'app-two-grids-test',
  template: `
    <app-ag-grid-test [rowDeleteIds]="['2']" />
    <app-ag-grid-test />
  `,
  imports: [AgGridTestComponent],
})
class TwoGridsTestComponent {}

describe('SkyAgGridWrapperHarness', () => {
  describe('using TestComponent', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideSkyAgGridTesting()],
      });
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('should check if the grid is not ready', async () => {
      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(SkyAgGridWrapperHarness.with({ dataSkyId: 'wrapper' }));
      await expectAsync(harness.isGridReady()).toBeResolvedTo(false);
    });

    it('should throw error if the grid is not available', async () => {
      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(SkyAgGridWrapperHarness.with({ dataSkyId: 'wrapper' }));
      await expectAsync(harness.isGridReady()).toBeResolvedTo(false);
      await expectAsync(harness.getDisplayedColumnIds()).toBeRejectedWith(
        'Unable to retrieve displayed column IDs.',
      );
      await expectAsync(
        harness.getDisplayedColumnHeaderNames(),
      ).toBeRejectedWith('Unable to retrieve displayed column header names.');
    });
  });

  describe('using AgGridTestComponent', () => {
    let fixture: ComponentFixture<AgGridTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideSkyAgGridTesting()],
      });
      fixture = TestBed.createComponent(AgGridTestComponent);
    });

    it('should check if the grid is ready', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(
        SkyAgGridWrapperHarness.with({ dataSkyId: 'ag-grid-wrapper' }),
      );
      await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
    });

    it('should get columns', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(
        SkyAgGridWrapperHarness.with({ dataSkyId: 'ag-grid-wrapper' }),
      );
      await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
      await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
        'column2',
        'column3',
      ]);
      await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo(
        ['Name', ''],
      );
    });

    it('should get the current render count', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(
        SkyAgGridWrapperHarness.with({ dataSkyId: 'ag-grid-wrapper' }),
      );
      await harness.waitUntilRendered();
      expect(await harness.getRenderCount()).toBeGreaterThan(0);
    });

    it('should resolve waitUntilRendered() once the grid has rendered', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(
        SkyAgGridWrapperHarness.with({ dataSkyId: 'ag-grid-wrapper' }),
      );
      await expectAsync(harness.waitUntilRendered()).toBeResolved();
    });

    it('should stop waiting after the bounded timeout if the grid never renders again', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(
        SkyAgGridWrapperHarness.with({ dataSkyId: 'ag-grid-wrapper' }),
      );
      await expectAsync(
        harness.waitUntilRendered(Number.MAX_SAFE_INTEGER),
      ).toBeResolved();
    });

    it('should skip waiting when render tracking is not active', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(
        SkyAgGridWrapperHarness.with({ dataSkyId: 'ag-grid-wrapper' }),
      );

      const originalValue = (window as any).AG_GRID_UNDER_TEST;
      (window as any).AG_GRID_UNDER_TEST = undefined;
      try {
        await expectAsync(harness.waitUntilRendered()).toBeResolved();
      } finally {
        (window as any).AG_GRID_UNDER_TEST = originalValue;
      }
    });

    it('should get the inline delete for a row', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(
        SkyAgGridWrapperHarness.with({ dataSkyId: 'ag-grid-wrapper' }),
      );
      await expectAsync(harness.getRowInlineDelete('2')).toBeResolvedTo(null);

      fixture.componentRef.setInput('rowDeleteIds', ['2']);

      const inlineDelete = await harness.getRowInlineDelete('2');
      expect(inlineDelete).toBeInstanceOf(SkyInlineDeleteHarness);
      await expectAsync(inlineDelete?.isPending()).toBeResolvedTo(false);
      await expectAsync(harness.getRowInlineDelete('3')).toBeResolvedTo(null);

      await inlineDelete?.clickCancelButton();

      await expectAsync(harness.getRowInlineDelete('2')).toBeResolvedTo(null);
    });
  });

  describe('using TwoGridsTestComponent', () => {
    it('should only get the inline delete for a row in its own grid', async () => {
      TestBed.configureTestingModule({
        providers: [provideSkyAgGridTesting()],
      });
      const fixture = TestBed.createComponent(TwoGridsTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      // Both grids have a row with the ID '2', but only the first grid is
      // showing an inline delete for it.
      const [firstGrid, secondGrid] = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getAllHarnesses(SkyAgGridWrapperHarness);

      await expectAsync(firstGrid.getRowInlineDelete('2')).toBeResolvedTo(
        jasmine.any(SkyInlineDeleteHarness),
      );
      await expectAsync(secondGrid.getRowInlineDelete('2')).toBeResolvedTo(
        null,
      );
    });
  });
});
