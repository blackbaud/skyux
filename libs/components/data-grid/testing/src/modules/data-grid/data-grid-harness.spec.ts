import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { SkyPagingHarness } from '@skyux/lists/testing';

import { SkyDataGridHarness } from './data-grid-harness';
import { DataGridTestComponent } from './fixtures/data-grid-test.component';

describe('data-grid-harness', () => {
  let fixture: ComponentFixture<DataGridTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(DataGridTestComponent);
  });

  it('should check if the grid is ready', async () => {
    fixture.componentRef.setInput('showAllColumns', false);
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(false);

    fixture.componentRef.setInput('showAllColumns', true);
    fixture.detectChanges();

    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
  });

  it('should get columns', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
      'column1',
      'column2',
      'column3',
    ]);
    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo([
      'Column1',
      'Column2',
      'Column3',
    ]);

    fixture.componentRef.setInput('showCol3', false);
    fixture.detectChanges();

    await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
      'column1',
      'column2',
    ]);
    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo([
      'Column1',
      'Column2',
    ]);
  });

  it('should throw error if the grid is not available', async () => {
    fixture.componentRef.setInput('showAllColumns', false);
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(false);
    await expectAsync(harness.getDisplayedColumnIds()).toBeRejectedWith(
      'Unable to retrieve displayed column IDs.',
    );
    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeRejectedWith(
      'Unable to retrieve displayed column header names.',
    );

    fixture.componentRef.setInput('showAllColumns', true);
    fixture.detectChanges();

    await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
      'column1',
      'column2',
      'column3',
    ]);
    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo([
      'Column1',
      'Column2',
      'Column3',
    ]);

    fixture.componentRef.setInput('showCol3HeaderText', false);
    fixture.detectChanges();

    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo([
      'Column1',
      'Column2',
      '',
    ]);
  });

  it('should get the paging harness for a paged grid', async () => {
    fixture.componentInstance.pageSize = 5;
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);

    const paging = await harness.getPaging();
    expect(paging).toBeInstanceOf(SkyPagingHarness);
    await expectAsync(paging.getCurrentPage()).toBeResolvedTo(1);

    await paging.clickNextButton();
    fixture.detectChanges();

    await expectAsync(paging.getCurrentPage()).toBeResolvedTo(2);
  });

  it('should get the paging harness or null', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    await expectAsync(harness.getPagingOrNull()).toBeResolvedTo(null);

    fixture.componentInstance.pageSize = 5;
    fixture.detectChanges();

    await expectAsync(harness.getPagingOrNull()).toBeResolvedTo(
      jasmine.any(SkyPagingHarness),
    );
  });

  it('should throw an error when getting paging for an unpaged grid', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    await expectAsync(harness.getPaging()).toBeRejectedWithError(
      'Unable to retrieve paging. The data grid is not paged.',
    );
  });

  it('should get the wait harness and reflect grid readiness', async () => {
    fixture.componentRef.setInput('showAllColumns', false);
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    const wait = await harness.getWait();
    expect(wait).toBeInstanceOf(SkyWaitHarness);
    await expectAsync(harness.isGridReady()).toBeResolvedTo(false);
    await expectAsync(wait.isWaiting()).toBeResolvedTo(true);

    fixture.componentRef.setInput('showAllColumns', true);
    fixture.detectChanges();

    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(wait.isWaiting()).toBeResolvedTo(false);
  });
});
