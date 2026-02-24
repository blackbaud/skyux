import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyBarChartComponent,
  SkyBarChartConfig,
  SkySelectedChartDataPoint,
} from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';

import { ChartDemoUtils } from '../shared/chart-demo-utils';

@Component({
  selector: 'app-bar-chart-demo',
  templateUrl: './bar-chart-demo.component.html',
  styles: [
    `
      :host {
        display: block;
        margin: 20px;
      }
    `,
  ],
  imports: [SkyBarChartComponent, SkyBoxModule, SkyFluidGridModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartDemoComponent {
  // #region Vertical
  protected readonly singleSeriesVertical: SkyBarChartConfig = {
    orientation: 'vertical',
    stacked: false,
    series: [
      {
        label: 'Spending',
        data: [
          { category: 'January', label: '$50,000', value: 50_000 },
          { category: 'February', label: '$100,000', value: 100_000 },
          { category: 'March', label: '$150,000', value: 150_000 },
          { category: 'April', label: '$200,000', value: 200_000 },
        ],
      },
    ],
    categoryAxis: { label: 'Month' },
    valueAxis: {
      label: 'Amount',
      tickFormatter: (value) => `$${Number(value) / 1000}K`,
    },

  };

  protected readonly multiSeriesVertical: SkyBarChartConfig = {
    orientation: 'vertical',
    stacked: false,
    series: [
      {
        label: 'Budget',
        data: [
          { category: 'Revenue', label: '$120,000', value: 120_000 },
          { category: 'Expenses', label: '$85,000', value: 85_000 },
        ],
      },
      {
        label: 'Actuals',
        data: [
          { category: 'Revenue', label: '$115,000', value: 115_000 },
          { category: 'Expenses', label: '$78,000', value: 78_000 },
        ],
      },
    ],
    categoryAxis: { label: 'Month' },
    valueAxis: { 
      label: 'Amount', 
      tickFormatter: (value) => `$${Number(value) / 1000}K`, 
    },
  };

  protected readonly stackedVertical: SkyBarChartConfig = {
    orientation: 'vertical',
    stacked: true,
    series: [
      {
        label: 'Dataset 1',
        data: ChartDemoUtils.numbers({
          count: 7,
          min: 0,
          max: 100,
          decimals: 0,
        }).map((value, index) => {
          return {
            category: ChartDemoUtils.months({ count: 7 })[index],
            label: `$${value}`,
            value,
          };
        }),
      },
      {
        label: 'Dataset 2',
        data: ChartDemoUtils.numbers({
          count: 7,
          min: 0,
          max: 100,
          decimals: 0,
        }).map((value, index) => {
          return {
            category: ChartDemoUtils.months({ count: 7 })[index],
            label: `$${value}`,
            value,
          };
        }),
      },
      {
        label: 'Dataset 3',
        data: ChartDemoUtils.numbers({
          count: 7,
          min: 0,
          max: 100,
          decimals: 0,
        }).map((value, index) => {
          return {
            category: ChartDemoUtils.months({ count: 7 })[index],
            label: `$${value}`,
            value,
          };
        }),
      },
    ],
    valueAxis: { label: 'Value' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly singleSeriesVerticalLog: SkyBarChartConfig = {
    orientation: 'vertical',
    series: [
      {
        label: 'Spending',
        data: [
          { category: 'January', label: '$50,000', value: 50_000 },
          { category: 'February', label: '$100,000', value: 100_000 },
          { category: 'March', label: '$150,000', value: 150_000 },
          { category: 'April', label: '$200,000', value: 200_000 },
        ],
      },
    ],
    valueAxis: { label: 'Value', scaleType: 'logarithmic' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly multiSeriesVerticalLog: SkyBarChartConfig = {
    orientation: 'vertical',
    series: [
      {
        label: 'Budget',
        data: [
          { category: 'Revenue', label: '$120,000', value: 120_000 },
          { category: 'Expenses', label: '$85,000', value: 85_000 },
        ],
      },
      {
        label: 'Actuals',
        data: [
          { category: 'Revenue', label: '$115,000', value: 115_000 },
          { category: 'Expenses', label: '$78,000', value: 78_000 },
        ],
      },
    ],
    valueAxis: { label: 'Value', scaleType: 'logarithmic' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly stackedVerticalLog: SkyBarChartConfig = {
    orientation: 'vertical',
    stacked: true,
    series: [
      {
        label: 'Dataset 1',
        data: ChartDemoUtils.numbers({
          count: 7,
          min: 0,
          max: 100,
          decimals: 0,
        }).map((value, index) => {
          return {
            category: ChartDemoUtils.months({ count: 7 })[index],
            label: `$${value}`,
            value,
          };
        }),
      },
      {
        label: 'Dataset 2',
        data: ChartDemoUtils.numbers({
          count: 7,
          min: 0,
          max: 100,
          decimals: 0,
        }).map((value, index) => {
          return {
            category: ChartDemoUtils.months({ count: 7 })[index],
            label: `$${value}`,
            value,
          };
        }),
      },
      {
        label: 'Dataset 3',
        data: ChartDemoUtils.numbers({
          count: 7,
          min: 0,
          max: 100,
          decimals: 0,
        }).map((value, index) => {
          return {
            category: ChartDemoUtils.months({ count: 7 })[index],
            label: `$${value}`,
            value,
          };
        }),
      },
    ],
    valueAxis: { label: 'Value', scaleType: 'logarithmic' },
    categoryAxis: { label: 'Month' },
  };
  // #endregion

  // #region Horizontal
  protected readonly singleSeriesHorizontal: SkyBarChartConfig = {
    orientation: 'horizontal',
    series: [
      {
        label: 'Spending',
        data: [
          { category: 'January', label: '$50,000', value: 50_000 },
          { category: 'February', label: '$100,000', value: 100_000 },
          { category: 'March', label: '$150,000', value: 150_000 },
          { category: 'April', label: '$200,000', value: 200_000 },
        ],
      },
    ],
    valueAxis: { label: 'Amount' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly multiSeriesHorizontal: SkyBarChartConfig = {
    orientation: 'horizontal',
    series: [
      {
        label: 'Budget',
        data: [
          { category: 'Revenue', label: '$120,000', value: 120_000 },
          { category: 'Expenses', label: '$85,000', value: 85_000 },
        ],
      },
      {
        label: 'Actuals',
        data: [
          { category: 'Revenue', label: '$115,000', value: 115_000 },
          { category: 'Expenses', label: '$78,000', value: 78_000 },
        ],
      },
    ],
    valueAxis: { label: 'Amount' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly stackedHorizontal: SkyBarChartConfig = {
    orientation: 'horizontal',
    stacked: true,
    series: [
      {
        label: 'Dataset 1',
        data: ChartDemoUtils.numbers({
          count: 7,
          min: 0,
          max: 100,
          decimals: 0,
        }).map((value, index) => {
          return {
            category: ChartDemoUtils.months({ count: 7 })[index],
            label: `$${value}`,
            value,
          };
        }),
      },
      {
        label: 'Dataset 2',
        data: ChartDemoUtils.numbers({
          count: 7,
          min: 0,
          max: 100,
          decimals: 0,
        }).map((value, index) => {
          return {
            category: ChartDemoUtils.months({ count: 7 })[index],
            label: `$${value}`,
            value,
          };
        }),
      },
      {
        label: 'Dataset 3',
        data: ChartDemoUtils.numbers({
          count: 7,
          min: 0,
          max: 100,
          decimals: 0,
        }).map((value, index) => {
          return {
            category: ChartDemoUtils.months({ count: 7 })[index],
            label: `$${value}`,
            value,
          };
        }),
      },
    ],
    valueAxis: { label: 'Amount' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly singleSeriesHorizontalLog: SkyBarChartConfig = {
    orientation: 'horizontal',
    series: [
      {
        label: 'Spending',
        data: [
          { category: 'January', label: '$50,000', value: 50_000 },
          { category: 'February', label: '$100,000', value: 100_000 },
          { category: 'March', label: '$150,000', value: 150_000 },
          { category: 'April', label: '$200,000', value: 200_000 },
        ],
      },
    ],
    valueAxis: { label: 'Amount', scaleType: 'logarithmic' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly multiSeriesHorizontalLog: SkyBarChartConfig = {
    orientation: 'horizontal',
    series: [
      {
        label: 'Budget',
        data: [
          { category: 'Revenue', label: '$120,000', value: 120_000 },
          { category: 'Expenses', label: '$85,000', value: 85_000 },
        ],
      },
      {
        label: 'Actuals',
        data: [
          { category: 'Revenue', label: '$115,000', value: 115_000 },
          { category: 'Expenses', label: '$78,000', value: 78_000 },
        ],
      },
    ],
    valueAxis: { label: 'Amount', scaleType: 'logarithmic' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly stackedHorizontalLog: SkyBarChartConfig = {
    orientation: 'horizontal',
    stacked: true,
    series: [
      {
        label: 'Dataset 1',
        data: ChartDemoUtils.numbers({ count: 7, min: 0, max: 1_000 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 7 })[index],
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 2',
        data: ChartDemoUtils.numbers({ count: 7, min: 0, max: 1_000 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 7 })[index],
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 3',
        data: ChartDemoUtils.numbers({ count: 7, min: 0, max: 1_000 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 7 })[index],
              label: `$${value}`,
              value,
            };
          },
        ),
      },
    ],
    valueAxis: { label: 'Amount', scaleType: 'logarithmic' },
    categoryAxis: { label: 'Month' },
  };
  // #endregion

  public onDataPointClicked(event: SkySelectedChartDataPoint): void {
    window.alert('Datapoint Clicked: ' + JSON.stringify(event, null ,2));
  }
}
