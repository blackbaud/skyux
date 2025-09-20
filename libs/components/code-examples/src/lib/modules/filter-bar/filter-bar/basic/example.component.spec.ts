import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyFilterBarHarness } from '@skyux/filter-bar/testing';
import { SkyModalHarness } from '@skyux/modals/testing';

import { FilterBarBasicExampleComponent } from './example.component';
import { FilterModalHarness } from './filter-modal-harness';

describe('Basic filter bar', () => {
  async function setupTest(): Promise<{
    filterBarHarness: SkyFilterBarHarness;
    fixture: ComponentFixture<FilterBarBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(FilterBarBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const filterBarHarness = await loader.getHarness(SkyFilterBarHarness);

    return { filterBarHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterBarBasicExampleComponent],
    });
  });

  it('should display the filter bar with initial filters', async () => {
    const { filterBarHarness, fixture } = await setupTest();

    fixture.detectChanges();

    // Check that filter bar has active filters initially
    await expectAsync(filterBarHarness.hasActiveFilters()).toBeResolvedTo(
      false, // Initially no filters are applied
    );

    // Get all filter items
    const filterItems = await filterBarHarness.getItems();
    expect(filterItems).toHaveSize(3);

    // Check specific filter items exist
    const staffAssignedFilter = await filterBarHarness.getItem({
      filterId: 'staff-assigned',
    });
    await expectAsync(staffAssignedFilter.getLabelText()).toBeResolvedTo(
      'Staff assigned',
    );

    const currentGradeFilter = await filterBarHarness.getItem({
      filterId: 'current-grade',
    });
    await expectAsync(currentGradeFilter.getLabelText()).toBeResolvedTo(
      'Current grade',
    );
  });

  it('should open filter modal and interact with form controls using custom harness', async () => {
    const { filterBarHarness, fixture } = await setupTest();
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    fixture.detectChanges();

    // Click on the Role filter to open its modal
    const staffAssignedFilter = await filterBarHarness.getItem({
      filterId: 'staff-assigned',
    });

    await expectAsync(staffAssignedFilter.getFilterValue()).toBeResolvedTo(
      undefined,
    );

    await staffAssignedFilter.click();

    // Get the modal and our custom filter modal harness
    const modal = await loader.getHarness(SkyModalHarness);
    const filterModalHarness = await loader.getHarness(FilterModalHarness);

    // Verify the modal opened
    await expectAsync(modal.getSize()).toBeResolvedTo('medium');

    // Select an option and verify it's selected
    await filterModalHarness.selectOption(2);

    await expectAsync(staffAssignedFilter.getFilterValue()).toBeResolvedTo(
      'Kanesha Hutto',
    );
  });
});
