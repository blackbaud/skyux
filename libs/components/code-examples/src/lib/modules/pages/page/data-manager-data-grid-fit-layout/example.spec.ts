import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';
import { SkyDataManagerHarness } from '@skyux/data-manager/testing';
import { SkyPageHarness } from '@skyux/pages/testing';

import { PagesPageDataManagerDataGridFitLayoutExample } from './example';

describe('Data grid with data manager in a fit layout page example', () => {
  async function setupTest(): Promise<{
    dataManagerHarness: SkyDataManagerHarness;
    gridHarness: SkyDataGridHarness;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      imports: [PagesPageDataManagerDataGridFitLayoutExample],
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(
      PagesPageDataManagerDataGridFitLayoutExample,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    return {
      dataManagerHarness: await loader.getHarness(SkyDataManagerHarness),
      gridHarness: await loader.getHarness(
        SkyDataGridHarness.with({ dataSkyId: 'transactions-grid' }),
      ),
      loader,
    };
  }

  it('should dock the data manager and grid to fill a fit layout page', async () => {
    const { dataManagerHarness, gridHarness, loader } = await setupTest();

    const pageHarness = await loader.getHarness(SkyPageHarness);

    await expectAsync(pageHarness.getLayout()).toBeResolvedTo('fit');
    await expectAsync(dataManagerHarness.getDockType()).toBeResolvedTo('fill');
    await expectAsync(gridHarness.getDockType()).toBeResolvedTo('fill');
  });

  it('should load every row without paging', async () => {
    const { gridHarness } = await setupTest();

    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(gridHarness.isLoading()).toBeResolvedTo(false);
    await expectAsync(gridHarness.getDisplayedRowCount()).toBeResolvedTo(1000);
    await expectAsync(gridHarness.getPagingOrNull()).toBeResolvedTo(null);
  });

  it('should hide the column marked columnHidden', async () => {
    const { gridHarness } = await setupTest();

    await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
      'date',
      'vendor',
      'category',
      'amount',
    ]);
    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo(['Date', 'Vendor', 'Category', 'Amount']);
  });

  it('should show and hide columns using the column picker', async () => {
    const { dataManagerHarness, gridHarness } = await setupTest();

    const toolbarHarness = await dataManagerHarness.getToolbar();
    const columnPickerHarness = await toolbarHarness.openColumnPicker();

    await (
      await columnPickerHarness.getColumn({ titleText: 'Category' })
    ).deselect();
    await (
      await columnPickerHarness.getColumn({ titleText: 'Reference' })
    ).select();
    await columnPickerHarness.saveAndClose();

    await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
      'date',
      'vendor',
      'amount',
      'reference',
    ]);
  });

  it('should filter the rows using the search', async () => {
    const { dataManagerHarness, gridHarness } = await setupTest();

    const toolbarHarness = await dataManagerHarness.getToolbar();
    const searchHarness = await toolbarHarness.getSearch();
    if (!searchHarness) {
      throw new Error('Expected the toolbar to display a search.');
    }

    await searchHarness.enterText('delta');
    await expectAsync(gridHarness.getDisplayedRowCount()).toBeResolvedTo(200);

    await searchHarness.enterText('TXN-00001');
    await expectAsync(gridHarness.getDisplayedRowCount()).toBeResolvedTo(1);

    await searchHarness.clear();
    await expectAsync(gridHarness.getDisplayedRowCount()).toBeResolvedTo(1000);
  });
});
