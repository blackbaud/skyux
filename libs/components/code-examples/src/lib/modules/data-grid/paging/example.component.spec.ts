import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';

import { DataGridPagingExampleComponent } from './example.component';

describe('Data grid paging example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DataGridPagingExampleComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataGridPagingExampleComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(DataGridPagingExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    return { fixture, loader };
  }

  it('should create the component and show data', async () => {
    const { fixture, loader } = await setupTest();
    expect(fixture.componentInstance).toBeDefined();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({
        dataSkyId: 'example-data-grid',
      }),
    );
    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
      'name',
      'age',
      'startDate',
      'endDate',
      'department',
      'jobTitle',
      'active',
    ]);
    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo([
      'Name',
      'Age',
      'Start date',
      'End date',
      'Department',
      'Job title',
      'Active',
    ]);
  });

  it('should page through the data grid', async () => {
    const { loader } = await setupTest();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({
        dataSkyId: 'example-data-grid',
      }),
    );

    // Access the paging harness directly from the data grid harness.
    const pagingHarness = await gridHarness.getPaging();

    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);

    await pagingHarness.clickNextButton();
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);

    await pagingHarness.clickPreviousButton();
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);

    await pagingHarness.clickPageButton(2);
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
  });
});
