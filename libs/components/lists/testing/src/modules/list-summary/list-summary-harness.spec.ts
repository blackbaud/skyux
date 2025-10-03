import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('List Summary Harnesses', () => {
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  describe('SkyListSummaryHarness', () => {
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
});
