import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAgGridModule } from '@skyux/ag-grid';

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
      TestBed.configureTestingModule({});
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
      TestBed.configureTestingModule({});
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
  });
});
