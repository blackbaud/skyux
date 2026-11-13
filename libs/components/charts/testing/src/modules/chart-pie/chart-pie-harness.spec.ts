import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyChart, SkyChartPie, SkyChartPieSlice } from '@skyux/charts';

import { SkyChartPieHarness } from './chart-pie-harness';

@Component({
  imports: [SkyChart, SkyChartPie, SkyChartPieSlice],
  template: `
    <sky-chart headingText="Complete chart">
      <sky-chart-pie
        data-sky-id="complete-chart"
        categoryLabelText="Region"
        valueLabelText="Sales"
      >
        <sky-chart-pie-slice labelText="North" [value]="10" />
        <sky-chart-pie-slice labelText="South" [value]="20" />
      </sky-chart-pie>
    </sky-chart>
    <sky-chart headingText="Empty chart">
      <sky-chart-pie
        data-sky-id="empty-chart"
        categoryLabelText="Region"
        valueLabelText="Sales"
      />
    </sky-chart>
  `,
})
class TestComponent {}

describe('Chart pie harness', () => {
  async function setupTest(options: {
    dataSkyId: string;
  }): Promise<{ harness: SkyChartPieHarness }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartPieHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness };
  }

  it('should throw when no pie chart matches the filters', async () => {
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
