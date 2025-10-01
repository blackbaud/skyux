import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyFilterBarHarness } from '@skyux/filter-bar/testing';

import { FilterBarLookupExampleComponent } from './example.component';

describe('Filter bar with lookup filter', () => {
  async function setupTest(): Promise<{
    filterBarHarness: SkyFilterBarHarness;
    fixture: ComponentFixture<FilterBarLookupExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(FilterBarLookupExampleComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const filterBarHarness = await loader.getHarness(SkyFilterBarHarness);

    return { filterBarHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterBarLookupExampleComponent],
    });
  });

  it('should display the filter bar with lookup filter', async () => {
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
      filterId: 'lookup-filter',
    });
    await expectAsync(staffAssignedFilter.getLabelText()).toBeResolvedTo(
      'Lookup filter',
    );
  });
});
