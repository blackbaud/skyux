import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyCheckboxHarness } from '@skyux/forms/testing';

import { SkyFilterButtonHarness } from './filter-button-harness';
import { SkyFilterInlineHarness } from './filter-inline-harness';
import { SkyFilterSummaryHarness } from './filter-summary-harness';
import { FilterHarnessTestComponent } from './fixtures/filter-harness-test.component';

describe('Filter test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    filterButtonHarness: SkyFilterButtonHarness;
    fixture: ComponentFixture<FilterHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [FilterHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(FilterHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const filterButtonHarness: SkyFilterButtonHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyFilterButtonHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyFilterButtonHarness);

    return { filterButtonHarness, fixture, loader };
  }

  it('should get the filter button by data-sky-id', async () => {
    const { filterButtonHarness } = await setupTest({
      dataSkyId: 'other-button',
    });

    await expectAsync(filterButtonHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should get the aria-label', async () => {
    const { filterButtonHarness } = await setupTest();

    await expectAsync(filterButtonHarness.getAriaLabel()).toBeResolvedTo(
      'aria label',
    );
  });

  it('should get the aria-controls', async () => {
    const { filterButtonHarness } = await setupTest();

    await expectAsync(filterButtonHarness.getAriaControls()).toBeResolvedTo(
      'inlineFilters',
    );
  });

  it('should get the aria-expanded', async () => {
    const { filterButtonHarness } = await setupTest();

    await expectAsync(filterButtonHarness.getAriaExpanded()).toBeResolvedTo(
      false,
    );

    await filterButtonHarness.clickFilterButton();

    await expectAsync(filterButtonHarness.getAriaExpanded()).toBeResolvedTo(
      true,
    );

    await filterButtonHarness.clickFilterButton();

    await expectAsync(filterButtonHarness.getAriaExpanded()).toBeResolvedTo(
      false,
    );
  });

  it('should get the filter button text', async () => {
    const { filterButtonHarness, fixture } = await setupTest();

    await expectAsync(filterButtonHarness.getButtonText()).toBeResolvedTo(
      'Filter',
    );

    fixture.componentInstance.showText = false;
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(filterButtonHarness.getButtonText()).toBeResolvedTo('');
  });

  it('should get the filter button id', async () => {
    const { filterButtonHarness } = await setupTest();

    await expectAsync(filterButtonHarness.getButtonId()).toBeResolvedTo(
      'test-id',
    );
  });

  it('should get the filter inline and filter inline item by data-sky-id', async () => {
    const { filterButtonHarness, fixture, loader } = await setupTest();

    await filterButtonHarness.clickFilterButton();
    fixture.detectChanges();
    await fixture.whenStable();

    const filterInlineHarness = await loader.getHarness(
      SkyFilterInlineHarness.with({ dataSkyId: 'filter-inline' }),
    );

    await expectAsync(
      filterInlineHarness.getItem({ dataSkyId: 'fruit-filter' }),
    ).toBeResolved();
  });

  it('should get an array of all filter inline items', async () => {
    const { filterButtonHarness, fixture, loader } = await setupTest();

    await filterButtonHarness.clickFilterButton();
    fixture.detectChanges();
    await fixture.whenStable();

    const filterInlineHarness = await loader.getHarness(
      SkyFilterInlineHarness.with({ dataSkyId: 'filter-inline' }),
    );

    const items = await filterInlineHarness.getItems();

    expect(items.length).toBe(2);
  });

  it('should get an array of filter inline items based on criteria', async () => {
    const { filterButtonHarness, fixture, loader } = await setupTest();

    await filterButtonHarness.clickFilterButton();
    fixture.detectChanges();
    await fixture.whenStable();

    const filterInlineHarness = await loader.getHarness(
      SkyFilterInlineHarness.with({ dataSkyId: 'filter-inline' }),
    );

    const items = await filterInlineHarness.getItems({
      dataSkyId: 'hide-orange-filter',
    });

    expect(items.length).toBe(1);
  });

  it('should return an empty array when no filter inline items are found', async () => {
    const { filterButtonHarness, fixture, loader } = await setupTest();

    await filterButtonHarness.clickFilterButton();
    fixture.detectChanges();
    await fixture.whenStable();

    const filterInlineHarness = await loader.getHarness(
      SkyFilterInlineHarness.with({ dataSkyId: 'other-filter-inline' }),
    );

    await expectAsync(filterInlineHarness.getItems()).toBeResolvedTo([]);
  });

  it('should get a filter summary and filter summary item by data-sky-id and interact with the summary item', async () => {
    const { filterButtonHarness, fixture, loader } = await setupTest();

    await filterButtonHarness.clickFilterButton();
    fixture.detectChanges();
    await fixture.whenStable();

    const filterInlineHarness = await loader.getHarness(
      SkyFilterInlineHarness.with({ dataSkyId: 'filter-inline' }),
    );

    const itemHarness = await filterInlineHarness.getItem({
      dataSkyId: 'hide-orange-filter',
    });
    const orangeCheck = await itemHarness.queryHarness(SkyCheckboxHarness);
    await orangeCheck.check();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(filterButtonHarness.isActive()).toBeResolvedTo(true);

    const filterSummaryHarness = await loader.getHarness(
      SkyFilterSummaryHarness.with({ dataSkyId: 'filter-summary' }),
    );

    const filterSummaryItem = await filterSummaryHarness.getItem({
      dataSkyId: 'summary-item-0',
    });

    await filterSummaryItem.clickItem();

    await expectAsync(filterSummaryItem.isDismissible()).toBeResolvedTo(true);

    await filterSummaryItem.dismiss();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(
      loader.getHarness(
        SkyFilterSummaryHarness.with({ dataSkyId: 'filter-summary' }),
      ),
    ).toBeRejected();
  });

  it('should get an array of filter summary items', async () => {
    const { filterButtonHarness, fixture, loader } = await setupTest();

    await filterButtonHarness.clickFilterButton();
    fixture.detectChanges();
    await fixture.whenStable();

    const filterInlineHarness = await loader.getHarness(
      SkyFilterInlineHarness.with({ dataSkyId: 'filter-inline' }),
    );

    const itemHarness = await filterInlineHarness.getItem({
      dataSkyId: 'hide-orange-filter',
    });
    const orangeCheck = await itemHarness.queryHarness(SkyCheckboxHarness);
    await orangeCheck.check();

    fixture.detectChanges();
    await fixture.whenStable();

    const filterSummaryHarness = await loader.getHarness(
      SkyFilterSummaryHarness.with({ dataSkyId: 'filter-summary' }),
    );

    const filterSummaryItems = await filterSummaryHarness.getItems({
      dataSkyId: 'summary-item-0',
    });

    expect(filterSummaryItems.length).toBe(1);
  });

  it('should throw an error if no filter summary items are found', async () => {
    const { loader } = await setupTest();

    const emptySummary = await loader.getHarness(SkyFilterSummaryHarness);

    await expectAsync(emptySummary.getItems()).toBeResolvedTo([]);
  });
});
