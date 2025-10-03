import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SkyListSummaryModule } from '@skyux/lists';

import { SkyListSummaryHarness } from './list-summary-harness';
import { SkyListSummaryItemHarness } from './list-summary-item-harness';

@Component({
  imports: [SkyListSummaryModule],
  template: `
    <sky-list-summary data-sky-id="test-summary">
      <sky-list-summary-item
        data-sky-id="test-item-1"
        [label]="'Total Items'"
        [value]="42"
      />
      <sky-list-summary-item
        data-sky-id="test-item-2"
        [label]="'Average Score'"
        [value]="'98.5%'"
      />
    </sky-list-summary>
  `,
})
class TestComponent {}

@Component({
  imports: [SkyListSummaryModule],
  template: `
    <sky-list-summary data-sky-id="test-summary-with-help">
      <sky-list-summary-item
        data-sky-id="test-item-with-help"
        [label]="'Revenue'"
        [value]="1000000"
        [helpPopoverContent]="
          'This represents the total revenue for the current period.'
        "
        [helpPopoverTitle]="'Revenue Help'"
      />
      <sky-list-summary-item
        data-sky-id="test-item-without-help"
        [label]="'Profit'"
        [value]="250000"
      />
    </sky-list-summary>
  `,
})
class TestComponentWithHelp {}

let fixture: ComponentFixture<TestComponent | TestComponentWithHelp>;
let loader: HarnessLoader;

async function setupTest(
  component: typeof TestComponent | typeof TestComponentWithHelp,
): Promise<void> {
  await TestBed.configureTestingModule({
    imports: [component],
    providers: [provideNoopAnimations()],
  }).compileComponents();

  fixture = TestBed.createComponent(component);
  loader = TestbedHarnessEnvironment.loader(fixture);
}

describe('List Summary Harnesses', () => {
  describe('SkyListSummaryHarness', () => {
    beforeEach(async () => {
      await setupTest(TestComponent);
    });

    it('should locate the summary component', async () => {
      const harness = await loader.getHarness(SkyListSummaryHarness);
      expect(harness).toBeTruthy();
    });

    it('should locate the summary component by dataSkyId', async () => {
      const harness = await loader.getHarness(
        SkyListSummaryHarness.with({ dataSkyId: 'test-summary' }),
      );
      expect(harness).toBeTruthy();
    });

    it('should get all summary items', async () => {
      const harness = await loader.getHarness(SkyListSummaryHarness);
      const items = await harness.getSummaryItems();
      expect(items.length).toBe(2);
    });

    it('should get a specific summary item', async () => {
      const harness = await loader.getHarness(SkyListSummaryHarness);
      const item = await harness.getSummaryItem({ labelText: 'Total Items' });
      expect(item).toBeTruthy();
    });
  });

  describe('SkyListSummaryItemHarness', () => {
    beforeEach(async () => {
      await setupTest(TestComponent);
    });

    it('should get the label text', async () => {
      const harness = await loader.getHarness(
        SkyListSummaryItemHarness.with({ dataSkyId: 'test-item-1' }),
      );
      const labelText = await harness.getLabelText();
      expect(labelText).toBe('Total Items');
    });

    it('should get the value text', async () => {
      const harness = await loader.getHarness(
        SkyListSummaryItemHarness.with({ dataSkyId: 'test-item-1' }),
      );
      const valueText = await harness.getValueText();
      expect(valueText).toBe('42');
    });

    it('should filter by label text', async () => {
      const harness = await loader.getHarness(
        SkyListSummaryItemHarness.with({ labelText: 'Average Score' }),
      );
      const labelText = await harness.getLabelText();
      expect(labelText).toBe('Average Score');
    });

    it('should filter by value text', async () => {
      const harness = await loader.getHarness(
        SkyListSummaryItemHarness.with({ valueText: '98.5%' }),
      );
      const valueText = await harness.getValueText();
      expect(valueText).toBe('98.5%');
    });

    it('should provide access to key info harness', async () => {
      const harness = await loader.getHarness(
        SkyListSummaryItemHarness.with({ dataSkyId: 'test-item-1' }),
      );
      const keyInfoHarness = await harness.getKeyInfo();
      expect(keyInfoHarness).toBeTruthy();

      const layout = await keyInfoHarness.getLayout();
      expect(layout).toBe('horizontal');
    });
  });

  describe('SkyListSummaryItemHarness - Help Popover', () => {
    beforeEach(async () => {
      await setupTest(TestComponentWithHelp);
    });

    it('should click help inline button', async () => {
      const harness = await loader.getHarness(
        SkyListSummaryItemHarness.with({ dataSkyId: 'test-item-with-help' }),
      );

      // This should not throw an error if help inline is present
      await expectAsync(harness.clickHelpInline()).toBeResolved();
    });

    it('should get help popover content and title', async () => {
      const harness = await loader.getHarness(
        SkyListSummaryItemHarness.with({ dataSkyId: 'test-item-with-help' }),
      );

      // Click to open the popover
      await harness.clickHelpInline();

      const content = await harness.getHelpPopoverContent();
      expect(content).toBe(
        'This represents the total revenue for the current period.',
      );

      const title = await harness.getHelpPopoverTitle();
      expect(title).toBe('Revenue Help');
    });

    it('should throw error when trying to interact with help inline that is not present', async () => {
      const harness = await loader.getHarness(
        SkyListSummaryItemHarness.with({ dataSkyId: 'test-item-without-help' }),
      );

      await expectAsync(harness.clickHelpInline()).toBeRejectedWithError(
        'No help inline found.',
      );
    });
  });
});
