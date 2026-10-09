import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { AgGridDataGridBasicExampleComponent } from './example.component';

describe('AG Grid data grid basic example', () => {
  async function setupTest(): Promise<{
    gridHarness: SkyAgGridWrapperHarness;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [AgGridDataGridBasicExampleComponent],
      providers: [provideSkyAgGridTesting(), provideNoopSkyAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataGridBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const gridHarness = await loader.getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'basic-grid' }),
    );
    // AG Grid renders outside the Angular zone, so wait on the harness rather than `whenStable()`.
    await gridHarness.waitUntilRendered();

    return { gridHarness, loader };
  }

  it('should render the grid sorted by start date', async () => {
    const { gridHarness } = await setupTest();

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo([
      '',
      'Name',
      'Age',
      'Start date',
      'End date',
      'Department',
      'Title',
    ]);
    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo([
      'Billy Bob',
      'Jane Deere',
      'David Smith',
      'Emily Johnson',
      'John Doe',
      'Nicole Davidson',
      'Carl Roberts',
    ]);
    await expectAsync(
      gridHarness.getDisplayedCellValues('endDate'),
    ).toBeResolvedTo([
      'N/A',
      'N/A',
      '06/15/2018',
      'N/A',
      '09/30/2017',
      'N/A',
      'N/A',
    ]);
  });

  it('should alert when a context menu action is clicked', async () => {
    const { loader } = await setupTest();
    const alertSpy = spyOn(window, 'alert');

    const contextMenu = await loader.getHarness(
      SkyDropdownHarness.with({
        selector: '.ag-row[row-index="0"] sky-dropdown',
      }),
    );
    await contextMenu.clickDropdownButton();

    const menu = await contextMenu.getDropdownMenu();
    const items = await menu.getItems();
    await expectAsync(
      Promise.all(items.map((item) => item.getText())),
    ).toBeResolvedTo(['Delete', 'Mark inactive', 'More info']);

    await (await menu.getItem({ text: 'Delete' })).click();

    expect(alertSpy).toHaveBeenCalledWith('Delete clicked for Billy Bob');
  });
});
