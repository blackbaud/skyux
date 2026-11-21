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

  it('should get a legend item per slice', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });
    const items = await harness.getLegendItems();

    await expectAsync(
      Promise.all(items.map((item) => item.getLabelText())),
    ).toBeResolvedTo(['North', 'South']);
  });

  it('should get the legend items that match the filters', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });

    const items = await harness.getLegendItems({ labelText: 'South' });

    await expectAsync(
      Promise.all(items.map((item) => item.getLabelText())),
    ).toBeResolvedTo(['South']);
  });

  it('should get a legend item by its label text', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });
    const item = await harness.getLegendItem({ labelText: 'South' });

    await expectAsync(item.getLabelText()).toBeResolvedTo('South');
  });

  it('should throw when no legend item matches the filters', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });

    await expectAsync(
      harness.getLegendItem({ labelText: 'no-such-slice' }),
    ).toBeRejected();
  });

  it('should get the data points', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });
    const dataPoints = await harness.getDataPoints();

    await expectAsync(
      Promise.all(dataPoints.map((dataPoint) => dataPoint.getCategory())),
    ).toBeResolvedTo(['North', 'South']);
  });

  it('should get the data points that match the filters', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });

    const dataPoints = await harness.getDataPoints({ category: 'South' });

    await expectAsync(
      Promise.all(dataPoints.map((dataPoint) => dataPoint.getCategory())),
    ).toBeResolvedTo(['South']);
  });

  it('should get a data point by its category', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });
    const dataPoint = await harness.getDataPoint({ category: 'South' });

    await expectAsync(dataPoint.getCategory()).toBeResolvedTo('South');
  });

  it('should throw when no data point matches the filters', async () => {
    const { harness } = await setupTest({ dataSkyId: 'complete-chart' });

    await expectAsync(
      harness.getDataPoint({ category: 'no-such-slice' }),
    ).toBeRejected();
  });
});
