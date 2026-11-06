import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
} from '@skyux/charts';

import { SkyChartLegendItemHarness } from '../chart-legend/chart-legend-item-harness';

import { SkyChartBarHarness } from './chart-bar-harness';

@Component({
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
  template: `
    <sky-chart headingText="Complete chart">
      <sky-chart-bar data-sky-id="complete-chart">
        <sky-chart-axis-category
          labelText="Region"
          [categories]="['North', 'South']"
        />
        <sky-chart-axis-value labelText="Sales" />
        <sky-chart-bar-series labelText="2026" [values]="[10, 20]" />
      </sky-chart-bar>
    </sky-chart>
    <sky-chart headingText="Empty chart">
      <sky-chart-bar data-sky-id="empty-chart" />
    </sky-chart>
    <sky-chart headingText="Multi-series chart">
      <sky-chart-bar data-sky-id="multi-series-chart">
        <sky-chart-axis-category
          labelText="Region"
          [categories]="['North', 'South']"
        />
        <sky-chart-axis-value labelText="Sales" />
        <sky-chart-bar-series labelText="2025" [values]="[5, 15]" />
        <sky-chart-bar-series labelText="2026" [values]="[10, 20]" />
      </sky-chart-bar>
    </sky-chart>
  `,
})
class TestComponent {}

describe('Chart bar harness', () => {
  async function setupTest(options: {
    dataSkyId: string;
  }): Promise<{ harness: SkyChartBarHarness }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartBarHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness };
  }

  it('should throw when no bar chart matches the filters', async () => {
    await expectAsync(setupTest({ dataSkyId: 'no-such-chart' })).toBeRejected();
  });

  it('should indicate the plot is rendered', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });

    await expectAsync(harness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should indicate the plot is not rendered', async () => {
    const { harness } = await setupTest({ dataSkyId: 'empty-chart' });

    await expectAsync(harness.isChartRendered()).toBeResolvedTo(false);
  });

  it('should get the legend items', async () => {
    const { harness } = await setupTest({ dataSkyId: 'multi-series-chart' });
    const items = await harness.getLegendItems();

    await expectAsync(
      Promise.all(items.map((item) => item.getLabelText())),
    ).toBeResolvedTo(['2025', '2026']);
  });

  it('should get the legend items that match the filters', async () => {
    const { harness } = await setupTest({ dataSkyId: 'multi-series-chart' });

    await expectAsync(
      harness.getLegendItems({ labelText: '2026' }),
    ).toBeResolvedTo([jasmine.any(SkyChartLegendItemHarness)]);
  });

  it('should get no legend items for a single-series chart', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });

    await expectAsync(harness.getLegendItems()).toBeResolvedTo([]);
  });

  it('should get a legend item by its label text', async () => {
    const { harness } = await setupTest({ dataSkyId: 'multi-series-chart' });
    const item = await harness.getLegendItem({ labelText: '2025' });

    await expectAsync(item.getLabelText()).toBeResolvedTo('2025');
  });

  it('should throw when no legend item matches the filters', async () => {
    const { harness } = await setupTest({ dataSkyId: 'multi-series-chart' });

    await expectAsync(
      harness.getLegendItem({ labelText: 'no-such-series' }),
    ).toBeRejected();
  });
});
