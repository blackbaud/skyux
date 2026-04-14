import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyChartBarComponent,
  type SkyChartBarDatum,
  SkyChartBarSeriesComponent,
  SkyChartBarSeriesDataPointComponent,
  SkyChartCategoryAxisComponent,
  SkyChartComponent,
  type SkyChartDataPointClickArgs,
  SkyChartMeasureAxisComponent,
} from '@skyux/charts';
import { SkyRadioModule } from '@skyux/forms';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { ChartDemoUtils } from '../shared/chart-demo-utils';

@Component({
  selector: 'app-chart-bar-demo',
  templateUrl: './chart-bar-demo.component.html',
  styles: [],
  imports: [
    FormsModule,
    SkyPageModule,
    SkyChartBarComponent,
    SkyBoxModule,
    SkyRadioModule,
    SkyTabsModule,
    SkyFluidGridModule,
    SkyChartBarComponent,
    SkyChartBarSeriesComponent,
    SkyChartBarSeriesDataPointComponent,
    SkyChartCategoryAxisComponent,
    SkyChartMeasureAxisComponent,
    SkyChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarDemoComponent {
  protected readonly orientation = signal<'vertical' | 'horizontal'>(
    'vertical',
  );

  protected readonly linear = {
    singleSeries: [
      {
        labelText: 'Spending',
        data: [
          { category: 'January', label: '$50,000', value: 50_000 },
          { category: 'February', label: '$100,000', value: 100_000 },
          { category: 'March', label: '$150,000', value: 150_000 },
          { category: 'April', label: '$200,000', value: 200_000 },
          { category: 'May', label: '$250,000', value: 250_000 },
          { category: 'June', label: '$300,000', value: 300_000 },
          { category: 'July', label: '$350,000', value: 350_000 },
          { category: 'August', label: '$400,000', value: 400_000 },
          { category: 'September', label: '$450,000', value: 450_000 },
          { category: 'October', label: '$500,000', value: 500_000 },
          { category: 'November', label: '$550,000', value: 550_000 },
          { category: 'December', label: '$575,000', value: 575_000 },
        ],
      },
    ],
    multiSeries: [
      {
        labelText: 'Budget',
        data: [
          { category: 'Revenue', label: '$120,000', value: 120_000 },
          { category: 'Expense', label: '$85,000', value: 85_000 },
        ],
      },
      {
        labelText: 'Actuals',
        data: [
          { category: 'Revenue', label: '$115,000', value: 115_000 },
          { category: 'Expense', label: '$78,000', value: 78_000 },
        ],
      },
    ],
    stacked: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      categories: ChartDemoUtils.months({ count: 7 }),
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
      labels: ['2024', '2025'],
      categories: ChartDemoUtils.months({ count: 6 }),
      min: 1,
      max: 100_000,
    }),
    stacked: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      categories: ChartDemoUtils.months({ count: 7 }),
      min: 1,
      max: 100,
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
    multi3x8: ChartDemoUtils.createRandomSeries({
      seriesCount: 3,
      dataCount: 8,
    }),
    multi6x8: ChartDemoUtils.createRandomSeries({
      seriesCount: 6,
      dataCount: 8,
    }),
    multi9x8: ChartDemoUtils.createRandomSeries({
      seriesCount: 9,
      dataCount: 8,
    }),
    multi12x8: ChartDemoUtils.createRandomSeries({
      seriesCount: 12,
      dataCount: 8,
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
    event: SkyChartDataPointClickArgs<SkyChartBarDatum>,
  ): void {
    console.log(JSON.stringify(event, null, 2));
  }
}
