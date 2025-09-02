import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyFilterBarHarness } from './filter-bar-harness';
import { FilterBarHarnessTestComponent } from './fixtures/filter-bar-harness-test.component';

describe('Filter bar test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    filterBarHarness: SkyFilterBarHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [FilterBarHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(FilterBarHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const filterBarHarness: SkyFilterBarHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyFilterBarHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyFilterBarHarness);

    return { filterBarHarness };
  }

  it('should get the filter bar by data-sky-id', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'empty-filter-bar',
    });

    await expectAsync(filterBarHarness.hasActiveFilters()).toBeResolvedTo(
      false,
    );
    await expectAsync(filterBarHarness.hasFilterPicker()).toBeResolvedTo(false);
  });

  it('should detect active filters', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'basic-filter-bar',
    });

    await expectAsync(filterBarHarness.hasActiveFilters()).toBeResolvedTo(true);
  });

  it('should detect filter picker button', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'basic-filter-bar',
    });

    await expectAsync(filterBarHarness.hasFilterPicker()).toBeResolvedTo(true);
  });

  it('should click filter picker button', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'basic-filter-bar',
    });

    await expectAsync(filterBarHarness.openFilterPicker()).toBeResolved();
  });

  it('should throw an error when trying to click filter picker button if it is not present', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'empty-filter-bar',
    });

    await expectAsync(
      filterBarHarness.openFilterPicker(),
    ).toBeRejectedWithError('Filter picker button not found');
  });

  it('should click clear filters button', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'basic-filter-bar',
    });

    await expectAsync(filterBarHarness.clickClearFilters()).toBeResolved();
  });

  it('should throw an error when trying to click clear filters button if no filters are set', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'empty-filter-bar',
    });

    await expectAsync(
      filterBarHarness.clickClearFilters(),
    ).toBeRejectedWithError(
      'Unable to find clear filters button because no filters are set',
    );
  });

  it('should get a filter item by criteria', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'basic-filter-bar',
    });

    const filterItem1 = await filterBarHarness.getItem({ filterId: 'filter1' });
    await expectAsync(filterItem1.hasActiveValue()).toBeResolvedTo(true);
    await expectAsync(filterItem1.getValue()).toBeResolvedTo('value1');
    await expectAsync(filterItem1.click()).toBeResolved();

    const filterItem2 = await filterBarHarness.getItem({
      labelText: 'Test filter 2',
    });
    await expectAsync(filterItem2.hasActiveValue()).toBeResolvedTo(false);
    await expectAsync(filterItem2.getValue()).toBeResolvedTo(undefined);
  });

  it('should get an array of all filter items', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'basic-filter-bar',
    });

    const items = await filterBarHarness.getItems();

    expect(items.length).toBe(2);
  });

  it('should throw an error if no filter items are found matching criteria', async () => {
    const { filterBarHarness } = await setupTest({
      dataSkyId: 'basic-filter-bar',
    });

    await expectAsync(
      filterBarHarness.getItems({ filterId: 'non-existent-filter' }),
    ).toBeRejectedWithError(
      'Unable to find any filter items with filter(s): {"filterId":"non-existent-filter"}',
    );
  });
});
