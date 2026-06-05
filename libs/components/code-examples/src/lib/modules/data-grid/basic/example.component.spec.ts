import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';
import {
  SkyDropdownHarness,
  SkyDropdownMenuHarness,
} from '@skyux/popovers/testing';

import { DataGridBasicExampleComponent } from './example.component';

describe('Basic data grid example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DataGridBasicExampleComponent>;
    loader: HarnessLoader;
    docLoader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataGridBasicExampleComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(DataGridBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const docLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.detectChanges();

    return { fixture, loader, docLoader };
  }

  it('should create the component and show data', async () => {
    const { fixture, loader } = await setupTest();
    expect(fixture.componentInstance).toBeDefined();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({
        dataSkyId: 'example-data-grid',
      }),
    );
    const waitHarness = await gridHarness.getWait();
    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(false);
    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
      'ag-Grid-SelectionColumn',
      'context',
      'name',
      'age',
      'startDate',
      'endDate',
      'department',
      'jobTitle',
    ]);

    // Not using paging.
    await expectAsync(gridHarness.getPagingOrNull()).toBeResolvedTo(null);
    await expectAsync(gridHarness.getPaging()).toBeRejectedWithError(
      'Unable to retrieve paging. The data grid is not paged.',
    );

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo([
      '',
      'Context menu',
      'Name',
      'Age',
      'Start date',
      'End date',
      'Department',
      'Title',
    ]);
  });

  it('should show context menu and handle item click', async () => {
    const { loader, docLoader } = await setupTest();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({
        dataSkyId: 'example-data-grid',
      }),
    );
    const menuButtonHarness = await gridHarness.queryHarness(
      SkyDropdownHarness.with({
        dataSkyId: 'context-menu-2',
      }),
    );
    await menuButtonHarness.clickDropdownButton();
    const menuHarness = await docLoader.getHarness(SkyDropdownMenuHarness);

    const moreInfoButton = await menuHarness.querySelector(
      'button[aria-label="More info for Jane Deere"]',
    );
    expect(moreInfoButton).toBeTruthy();
    const moreInfoActionSpy = spyOn(window, 'alert').and.stub();
    await moreInfoButton?.click();
    expect(moreInfoActionSpy).toHaveBeenCalledWith(
      'More info clicked for Jane Deere',
    );
  });
});
