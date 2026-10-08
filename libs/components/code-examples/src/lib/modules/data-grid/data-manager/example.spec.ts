import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';
import { SkyDataManagerHarness } from '@skyux/data-manager/testing';

import { DataGridDataManagerExample } from './example';

describe('Data grid data manager example', () => {
  async function setupTest(): Promise<{
    dataManagerHarness: SkyDataManagerHarness;
    gridHarness: SkyDataGridHarness;
  }> {
    TestBed.configureTestingModule({
      imports: [DataGridDataManagerExample],
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(DataGridDataManagerExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    return {
      dataManagerHarness: await loader.getHarness(SkyDataManagerHarness),
      gridHarness: await loader.getHarness(SkyDataGridHarness),
    };
  }

  it('should hide the column marked columnHidden', async () => {
    const { gridHarness } = await setupTest();

    await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
      'name',
      'type',
      'color',
    ]);
  });

  it('should show and hide columns using the column picker', async () => {
    const { dataManagerHarness, gridHarness } = await setupTest();

    const toolbarHarness = await dataManagerHarness.getToolbar();
    const columnPickerHarness = await toolbarHarness.openColumnPicker();

    await (
      await columnPickerHarness.getColumn({ titleText: 'Color' })
    ).deselect();
    await (
      await columnPickerHarness.getColumn({ titleText: 'Quantity' })
    ).select();
    await columnPickerHarness.saveAndClose();

    await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
      'name',
      'type',
      'quantity',
    ]);
  });
});
