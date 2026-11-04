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

import { SkyChartLegendItemHarness } from './chart-legend-item-harness';

@Component({
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
  template: `
    <sky-chart headingText="Sales">
      <sky-chart-bar>
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

describe('Chart legend item harness', () => {
  async function setupTest(options: {
    labelText: string | RegExp;
  }): Promise<{ harness: SkyChartLegendItemHarness }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartLegendItemHarness.with({ labelText: options.labelText }),
    );

    return { harness };
  }

  it('should throw when no legend item matches the filters', async () => {
    await expectAsync(
      setupTest({ labelText: 'no-such-series' }),
    ).toBeRejected();
  });

  it('should get the label text', async () => {
    const { harness } = await setupTest({ labelText: /2026/ });

    await expectAsync(harness.getLabelText()).toBeResolvedTo('2026');
  });

  it('should toggle the series visibility when clicked', async () => {
    const { harness } = await setupTest({ labelText: '2025' });

    await expectAsync(harness.isSeriesVisible()).toBeResolvedTo(true);

    await harness.click();

    await expectAsync(harness.isSeriesVisible()).toBeResolvedTo(false);

    await harness.click();

    await expectAsync(harness.isSeriesVisible()).toBeResolvedTo(true);
  });
});
