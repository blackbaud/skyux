import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyAgGridWrapperHarness } from './ag-grid-wrapper-harness';
import { AgGridTestComponent } from './fixtures/ag-grid-test.component';
import { EmptyAgGridTestComponent } from './fixtures/empty-ag-grid-test.component';

describe('SkyAgGridWrapperHarness', () => {
  describe('using grid options', () => {
    let fixture: ComponentFixture<AgGridTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(AgGridTestComponent);
    });

    it('should check if the grid is ready', async () => {
      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(SkyAgGridWrapperHarness.with({ dataSkyId: 'grid' }));
      await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
    });

    it('should get columns', async () => {
      fixture.detectChanges();

      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(SkyAgGridWrapperHarness.with({ dataSkyId: 'grid' }));
      await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
      await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
        'column1',
        'column2',
        'column3',
      ]);
      await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo(
        ['Column 1', 'Column 2', 'Column 3'],
      );

      fixture.componentRef.setInput('showCol3', false);
      fixture.detectChanges();

      await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
        'column1',
        'column2',
      ]);
      await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo(
        ['Column 1', 'Column 2'],
      );
    });

    it('should throw error if the grid is not available', async () => {
      fixture.componentRef.setInput('showAllColumns', false);
      fixture.detectChanges();

      const harness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(SkyAgGridWrapperHarness.with({ dataSkyId: 'grid' }));
      await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([]);

      fixture.componentRef.setInput('showAllColumns', true);
      fixture.detectChanges();

      await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
        'column1',
        'column2',
        'column3',
      ]);
      await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo(
        ['Column 1', 'Column 2', 'Column 3'],
      );

      fixture.componentRef.setInput('showCol3HeaderText', false);
      fixture.detectChanges();

      await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo(
        ['Column 1', 'Column 2', ''],
      );
    });
  });

  describe('using empty wrapper', () => {
    let fixture: ComponentFixture<EmptyAgGridTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(EmptyAgGridTestComponent);
      fixture.detectChanges();
    });

    it('should check if the grid is ready', async () => {
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
});
