import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChartCategoryAxisComponent,
  SkyChartComponent,
  SkyChartDataPointClickArgs,
  SkyChartLineComponent,
  SkyChartLineDatum,
  SkyChartLineSeriesComponent,
  SkyChartLineSeriesDataPointComponent,
  SkyChartMeasureAxisComponent,
} from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { ChartDemoUtils } from '../shared/chart-demo-utils';

@Component({
  selector: 'app-chart-line-demo',
  templateUrl: 'chart-line-demo.component.html',
  imports: [
    SkyPageModule,
    SkyTabsModule,
    SkyChartLineComponent,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyChartComponent,
    SkyChartLineComponent,
    SkyChartLineSeriesComponent,
    SkyChartLineSeriesDataPointComponent,
    SkyChartCategoryAxisComponent,
    SkyChartMeasureAxisComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineDemoComponent {
  protected readonly linear = {
    singleSeries: [
      {
        labelText: '2022',
        data: [
          { category: 'January', label: '$25K', value: 25 },
          { category: 'February', label: '$28K', value: 28 },
          { category: 'March', label: '$22K', value: 22 },
          { category: 'April', label: '$35K', value: 35 },
          { category: 'May', label: '$30K', value: 30 },
          { category: 'June', label: '$45K', value: 45 },
          { category: 'July', label: '$38K', value: 38 },
          { category: 'August', label: '$42K', value: 42 },
          { category: 'September', label: '$50K', value: 50 },
          { category: 'October', label: '$40K', value: 40 },
          { category: 'November', label: '$55K', value: 55 },
          { category: 'December', label: '$48K', value: 48 },
        ],
      },
    ],
    multiSeries: ChartDemoUtils.createRandomSeries({
      labels: ['2022', '2023', '2024', '2025'],
      categories: ChartDemoUtils.months({ count: 12 }),
      min: 0,
      max: 100,
    }),
    stacked: ChartDemoUtils.createRandomSeries({
      labels: ['2022', '2023', '2024', '2025'],
      categories: ChartDemoUtils.months({ count: 12 }),
      min: 0,
      max: 100,
    }),
  };

  protected readonly log = {
    singleSeries: [
      {
        labelText: 'Dataset 1',
        data: [1, 1.1, 1.9, 2.1, 4.9, 5.1, 9, 11, 90, 110, 900, 1100, 9000].map(
          (value, index) => ({
            category: 'Cat-' + (index + 1),
            label: `$${value}`,
            value,
          }),
        ),
      },
    ],
    multiSeries: ChartDemoUtils.createRandomSeries({
      labels: ['2022', '2023', '2024', '2025'],
      categories: ChartDemoUtils.months({ count: 12 }),
      min: 1,
      max: 1_000,
    }),
    stacked: ChartDemoUtils.createRandomSeries({
      labels: ['2022', '2023', '2024', '2025'],
      categories: ChartDemoUtils.months({ count: 12 }),
      min: 1,
      max: 1_000,
    }),
  };

  protected readonly density = {
    single1x3: ChartDemoUtils.createRandomSeries({
      seriesCount: 1,
      dataCount: 3,
    }),
    single1x6: ChartDemoUtils.createRandomSeries({
      seriesCount: 1,
      dataCount: 6,
    }),
    single1x9: ChartDemoUtils.createRandomSeries({
      seriesCount: 1,
      dataCount: 9,
    }),
    single1x12: ChartDemoUtils.createRandomSeries({
      seriesCount: 1,
      dataCount: 12,
    }),
    multi3x3: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      dataCount: 3,
    }),
    multi3x6: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      dataCount: 6,
    }),
    multi3x9: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      dataCount: 9,
    }),
    multi3x12: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      dataCount: 12,
    }),
    stacked3x3: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      dataCount: 3,
    }),
    stacked3x6: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      dataCount: 6,
    }),
    stacked3x9: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      dataCount: 9,
    }),
    stacked3x12: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      dataCount: 12,
    }),
  };

  public onDataPointClick(
    event: SkyChartDataPointClickArgs<SkyChartLineDatum>,
  ): void {
    console.log(JSON.stringify(event, null, 2));
  }
}
