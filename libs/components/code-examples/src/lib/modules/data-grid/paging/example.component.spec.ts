import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';

import { DataGridPagingExampleComponent } from './example.component';

describe('Data grid paging example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DataGridPagingExampleComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataGridPagingExampleComponent],
      providers: [provideRouter([]), provideNoopSkyAnimations()],
    }).compileComponents();
    const fixture = TestBed.createComponent(DataGridPagingExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    return { fixture, loader };
  }

  it('should create the component and show data', async () => {
    const { fixture, loader } = await setupTest();
    expect(fixture.componentInstance).toBeDefined();
    const gridHarness = await loader.getHarness(SkyDataGridHarness);
    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
      'name',
      'age',
      'startDate',
      'endDate',
      'department',
      'jobTitle',
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
    ]);
  });
});
