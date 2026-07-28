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
});
