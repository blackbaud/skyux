import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyFilterBarHarness } from '@skyux/filter-bar/testing';
import { SkyModalHarness } from '@skyux/modals/testing';

import { FilterBarModalExampleComponent } from './example.component';
import { FilterModalHarness } from './filter-modal-harness';

describe('Filter bar with modal filter', () => {
  async function setupTest(): Promise<{
    filterBarHarness: SkyFilterBarHarness;
    fixture: ComponentFixture<FilterBarModalExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(FilterBarModalExampleComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const filterBarHarness = await loader.getHarness(SkyFilterBarHarness);

    return { filterBarHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterBarModalExampleComponent],
    });
  });

  it('should display the filter bar with modal filter', async () => {
    const { filterBarHarness, fixture } = await setupTest();

    fixture.detectChanges();

    // Check that filter bar has active filters initially
    await expectAsync(filterBarHarness.hasActiveFilters()).toBeResolvedTo(
      false, // Initially no filters are applied
    );

    // Get all filter items
    const filterItems = await filterBarHarness.getItems();
    expect(filterItems).toHaveSize(1);

    // Check specific filter items exist
    const staffAssignedFilter = await filterBarHarness.getItem({
      filterId: 'modal-filter',
    });
    await expectAsync(staffAssignedFilter.getLabelText()).toBeResolvedTo(
      'Modal filter',
    );
  });

  it('should open filter modal and interact with form controls using custom harness', async () => {
    const { filterBarHarness, fixture } = await setupTest();
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    fixture.detectChanges();

    // Click on the Role filter to open its modal
    const modalFilter = await filterBarHarness.getItem({
      filterId: 'modal-filter',
    });

    await expectAsync(modalFilter.getFilterValue()).toBeResolvedTo(undefined);

    await modalFilter.click();

    // Get the modal and our custom filter modal harness
    const modal = await loader.getHarness(SkyModalHarness);
    const filterModalHarness = await loader.getHarness(FilterModalHarness);

    // Verify the modal opened
    await expectAsync(modal.getSize()).toBeResolvedTo('small');

    // Select an option and verify it's selected
    await filterModalHarness.selectOptionByIndex(2);

    await expectAsync(modalFilter.getFilterValue()).toBeResolvedTo('No');
  });
});
