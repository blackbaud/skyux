import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
  type SkyChartDataPointClick,
} from '@skyux/charts';

import { SkyChartDataPointHarness } from './chart-data-point-harness';
import { SkyChartDataPointHarnessFilters } from './chart-data-point-harness-filters';

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
      <sky-chart-bar (dataPointClick)="dataPointClick = $event">
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
class TestComponent {
  public dataPointClick: SkyChartDataPointClick | undefined;
}

describe('Chart data point harness', () => {
  async function setupTest(filters: SkyChartDataPointHarnessFilters): Promise<{
    harness: SkyChartDataPointHarness;
    testComponent: TestComponent;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    // The data points are positioned once the chart is laid out, after the
    // first render.
    fixture.detectChanges();
    await fixture.whenStable();

    const harness = await loader.getHarness(
      SkyChartDataPointHarness.with(filters),
    );

    return { harness, testComponent: fixture.componentInstance };
  }

  it('should throw when no data point matches the filters', async () => {
    await expectAsync(setupTest({ category: 'East' })).toBeRejected();
  });

  it('should get the category and series label text', async () => {
    const { harness } = await setupTest({
      category: 'South',
      seriesLabelText: /2026/,
    });

    await expectAsync(harness.getCategory()).toBeResolvedTo('South');
    await expectAsync(harness.getSeriesLabelText()).toBeResolvedTo('2026');
  });

  it('should emit the chart data point click event when clicked', async () => {
    const { harness, testComponent } = await setupTest({
      category: 'North',
      seriesLabelText: '2026',
    });

    await harness.click();

    expect(testComponent.dataPointClick).toEqual({
      category: 'North',
      categoryIndex: 0,
      seriesIndex: 1,
      seriesLabelText: '2026',
      value: 10,
    });
  });
});
