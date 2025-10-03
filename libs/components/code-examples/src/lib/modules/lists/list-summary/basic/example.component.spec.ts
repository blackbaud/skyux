import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyListSummaryHarness } from '@skyux/lists/testing';

import { ListsListSummaryBasicExampleComponent } from './example.component';

describe('Lists list summary basic example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ListsListSummaryBasicExampleComponent>;
    loader: HarnessLoader;
    component: ListsListSummaryBasicExampleComponent;
  }> {
    await TestBed.configureTestingModule({
      imports: [ListsListSummaryBasicExampleComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      ListsListSummaryBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const component = fixture.componentInstance;

    return { fixture, loader, component };
  }

  it('should create', async () => {
    const { component } = await setupTest();
    expect(component).toBeTruthy();
  });

  it('should render the list summary component', async () => {
    const { fixture, loader } = await setupTest();
    fixture.detectChanges();

    const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);
    expect(listSummaryHarness).toBeTruthy();
  });

  it('should display all summary items', async () => {
    const { fixture, loader } = await setupTest();
    fixture.detectChanges();

    const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);
    const summaryItems = await listSummaryHarness.getSummaryItems();

    expect(summaryItems.length).toBe(4);
  });

  describe('summary item content', () => {
    it('should display correct labels and values', async () => {
      const { fixture, loader } = await setupTest();
      fixture.detectChanges();

      const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);
      const summaryItems = await listSummaryHarness.getSummaryItems();

      // Test first item - Total records (abbreviated format)
      await expectAsync(summaryItems[0].getLabelText()).toBeResolvedTo(
        'Total records',
      );
      await expectAsync(summaryItems[0].getValueText()).toBeResolvedTo('1.2K');

      // Test third item - Revenue with currency formatting (abbreviated format)
      await expectAsync(summaryItems[2].getLabelText()).toBeResolvedTo(
        'Revenue',
      );
      await expectAsync(summaryItems[2].getValueText()).toBeResolvedTo('$1.2M');

      // Test fourth item - Average score with number formatting (no abbreviation for small numbers)
      await expectAsync(summaryItems[3].getLabelText()).toBeResolvedTo(
        'Average score',
      );
      await expectAsync(summaryItems[3].getValueText()).toBeResolvedTo('87.5');
    });
  });

  describe('help popover functionality', () => {
    it('should show help popover content when help icon is clicked', async () => {
      const { fixture, loader } = await setupTest();
      fixture.detectChanges();
      await fixture.whenStable();

      const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);
      const summaryItems = await listSummaryHarness.getSummaryItems();

      // Click help icon on first item
      await summaryItems[0].clickHelpInline();
      fixture.detectChanges();
      await fixture.whenStable();

      // Verify help popover content
      await expectAsync(summaryItems[0].getHelpPopoverContent()).toBeResolvedTo(
        'The total number of records in the current dataset.',
      );
      await expectAsync(summaryItems[0].getHelpPopoverTitle()).toBeResolvedTo(
        'Total Records Help',
      );
    });

    it('should show help popover for items with help content only', async () => {
      const { fixture, loader } = await setupTest();
      fixture.detectChanges();
      await fixture.whenStable();

      const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);
      const summaryItems = await listSummaryHarness.getSummaryItems();

      // Test third item - Revenue (has help content)
      await summaryItems[2].clickHelpInline();
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(summaryItems[2].getHelpPopoverContent()).toBeResolvedTo(
        'Total revenue generated from all active items in the current period.',
      );
    });
  });

  describe('harness filtering capabilities', () => {
    it('should find summary items by label text', async () => {
      const { fixture, loader } = await setupTest();
      fixture.detectChanges();

      const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);

      // Find specific item by label
      const revenueItem = await listSummaryHarness.getSummaryItem({
        labelText: 'Revenue',
      });

      await expectAsync(revenueItem.getLabelText()).toBeResolvedTo('Revenue');
      await expectAsync(revenueItem.getValueText()).toBeResolvedTo('$1.2M');
    });

    it('should find summary items using regex patterns', async () => {
      const { fixture, loader } = await setupTest();
      fixture.detectChanges();

      const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);

      // Find items with "rate" in the label
      const rateItems = await listSummaryHarness.getSummaryItems({
        labelText: /score/i,
      });

      expect(rateItems.length).toBe(1);
      await expectAsync(rateItems[0].getLabelText()).toBeResolvedTo(
        'Average score',
      );
    });

    it('should demonstrate dataSkyId filtering capability', async () => {
      const { fixture, loader } = await setupTest();
      fixture.detectChanges();

      // Test that dataSkyId filtering works by querying without a dataSkyId (should succeed)
      const allSummaryHarnesses = await loader.getAllHarnesses(
        SkyListSummaryHarness,
      );
      expect(allSummaryHarnesses.length).toBe(1);

      // Test that specific dataSkyId filtering capability exists (returns no matches for non-existent ID)
      const specificSummaryHarnesses = await loader.getAllHarnesses(
        SkyListSummaryHarness.with({ dataSkyId: 'non-existent-id' }),
      );
      expect(specificSummaryHarnesses.length).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should handle cases where no items match filter', async () => {
      const { fixture, loader } = await setupTest();
      fixture.detectChanges();

      const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);

      // Try to find an item that doesn't exist
      const nonExistentItems = await listSummaryHarness.getSummaryItems({
        labelText: 'Non-existent label',
      });

      expect(nonExistentItems.length).toBe(0);
    });

    it('should throw error when trying to get single item that does not exist', async () => {
      const { fixture, loader } = await setupTest();
      fixture.detectChanges();

      const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);

      // This should throw an error since no item matches
      await expectAsync(
        listSummaryHarness.getSummaryItem({ labelText: 'Non-existent label' }),
      ).toBeRejected();
    });
  });
});
