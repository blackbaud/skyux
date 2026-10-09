import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyCheckboxHarness } from '@skyux/forms/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { AgGridDataGridBasicMultiselectExampleComponent } from './example.component';

describe('AG Grid basic multiselect example', () => {
  async function setupTest(): Promise<{
    gridHarness: SkyAgGridWrapperHarness;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [AgGridDataGridBasicMultiselectExampleComponent],
      providers: [provideSkyAgGridTesting(), provideNoopSkyAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataGridBasicMultiselectExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const gridHarness = await loader.getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'basic-multiselect-grid' }),
    );
    // AG Grid renders outside the Angular zone, so wait on the harness rather than `whenStable()`.
    await gridHarness.waitUntilRendered();

    return { gridHarness, loader };
  }

  async function getRowCheckbox(
    loader: HarnessLoader,
    rowIndex: number,
  ): Promise<SkyCheckboxHarness> {
    return await loader.getHarness(
      SkyCheckboxHarness.with({
        dataSkyId: 'row-checkbox',
        ancestor: `.ag-row[row-index="${rowIndex}"]`,
      }),
    );
  }

  async function getCheckedRowLabels(loader: HarnessLoader): Promise<string[]> {
    const rowCheckboxes = await loader.getAllHarnesses(
      SkyCheckboxHarness.with({ dataSkyId: 'row-checkbox' }),
    );
    const checkedLabels: string[] = [];

    for (const checkbox of rowCheckboxes) {
      if (await checkbox.isChecked()) {
        checkedLabels.push((await checkbox.getLabelText()) ?? '');
      }
    }

    return checkedLabels;
  }

  it('should render the grid sorted by start date', async () => {
    const { gridHarness } = await setupTest();

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo([
      '',
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
  });

  it('should select rows with the row and header checkboxes', async () => {
    const { loader } = await setupTest();
    const emilyCheckbox = await getRowCheckbox(loader, 3);
    const johnCheckbox = await getRowCheckbox(loader, 4);

    await expectAsync(emilyCheckbox.getLabelText()).toBeResolvedTo(
      'Select Emily Johnson',
    );
    await expectAsync(emilyCheckbox.isChecked()).toBeResolvedTo(true);

    await johnCheckbox.check();
    await emilyCheckbox.uncheck();
    await expectAsync(getCheckedRowLabels(loader)).toBeResolvedTo([
      'Select John Doe',
    ]);

    const headerCheckbox = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: 'header-row-selector' }),
    );
    await headerCheckbox.check();
    expect((await getCheckedRowLabels(loader)).length).toBe(7);

    await headerCheckbox.uncheck();
    await expectAsync(getCheckedRowLabels(loader)).toBeResolvedTo([]);
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
