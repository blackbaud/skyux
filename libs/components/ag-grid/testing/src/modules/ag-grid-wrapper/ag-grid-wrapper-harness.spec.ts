import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAgGridModule } from '@skyux/ag-grid';

import { provideSkyAgGridTesting } from '../ag-grid/provide-ag-grid-testing';
import { SkyAgGridWrapperHarness } from './ag-grid-wrapper-harness';
import { AgGridTestComponent } from './fixtures/ag-grid-test.component';

@Component({
  selector: 'app-test',
  template: `<sky-ag-grid-wrapper data-sky-id="wrapper" />`,
  imports: [SkyAgGridModule],
})
class TestComponent {}

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

    async function getHarness(): Promise<SkyAgGridWrapperHarness> {
      fixture.detectChanges();
      await fixture.whenStable();

      return await TestbedHarnessEnvironment.loader(fixture).getHarness(
        SkyAgGridWrapperHarness.with({ dataSkyId: 'ag-grid-wrapper' }),
      );
    }

    it('should get the displayed cell values of a column', async () => {
      const harness = await getHarness();

      await expectAsync(
        harness.getDisplayedCellValues('column2'),
      ).toBeResolvedTo([
        'Apple',
        'Banana',
        'Banana',
        'Daikon',
        'Edamame',
        'Fig',
        'Grape',
      ]);
      await expectAsync(
        harness.getDisplayedCellValues('column3'),
      ).toBeResolvedTo([
        'true',
        'false',
        'true',
        'false',
        'true',
        'false',
        'true',
      ]);
    });

    it('should get an empty value for a cell without a value', async () => {
      fixture.componentInstance.data = [
        { id: '1', column1: '1', column2: 'Apple' },
      ];
      const harness = await getHarness();

      await expectAsync(
        harness.getDisplayedCellValues('column3'),
      ).toBeResolvedTo(['']);
    });

    it('should throw an error when getting cell values for an unknown column', async () => {
      const harness = await getHarness();

      await expectAsync(
        harness.getDisplayedCellValues('column1'),
      ).toBeRejectedWithError('Unable to find column "column1".');
    });

    it('should get no cell values when the grid displays no rows', async () => {
      fixture.componentInstance.data = [];
      const harness = await getHarness();

      await expectAsync(
        harness.getDisplayedCellValues('column2'),
      ).toBeResolvedTo([]);
    });

    it('should resolve waitUntilRendered() once the grid has rendered', async () => {
      const harness = await getHarness();

      await expectAsync(harness.waitUntilRendered()).toBeResolved();
    });

    it('should wait for the render caused by an action', async () => {
      const harness = await getHarness();
      await harness.waitUntilRendered();

      const api = await harness.getGridApi();

      await harness.waitUntilRendered(() =>
        api.setGridOption('quickFilterText', 'Banana'),
      );

      await expectAsync(
        harness.getDisplayedCellValues('column2'),
      ).toBeResolvedTo(['Banana', 'Banana']);
    });

    it('should stop waiting after the bounded timeout if an action does not cause a render', async () => {
      const harness = await getHarness();
      await harness.waitUntilRendered();
      const action = jasmine.createSpy('action');
      // Advance the clock on every read so the wait reaches its timeout
      // without depending on how long AG Grid takes to stop rendering.
      let now = Date.now();
      spyOn(Date, 'now').and.callFake(() => (now += 1000));

      await expectAsync(harness.waitUntilRendered(action)).toBeResolved();
      expect(action).toHaveBeenCalledTimes(1);
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
      const action = jasmine.createSpy('action');
      try {
        await expectAsync(harness.waitUntilRendered()).toBeResolved();
        await expectAsync(harness.waitUntilRendered(action)).toBeResolved();
        expect(action).toHaveBeenCalledTimes(1);
      } finally {
        (window as any).AG_GRID_UNDER_TEST = originalValue;
      }
    });
  });
});
