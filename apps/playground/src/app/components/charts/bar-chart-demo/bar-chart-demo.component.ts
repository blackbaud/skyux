import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyBarChartComponent, SkyBarChartConfig } from '@skyux/charts';
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
    series: [
      {
        label: 'Spending',
        data: [
          { category: 'Jan', label: '$50K', value: 50_000 },
          { category: 'Feb', label: '$100K', value: 100_000 },
          { category: 'Mar', label: '$150K', value: 150_000 },
          { category: 'Apr', label: '$200K', value: 200_000 },
        ],
      },
    ],
    valueAxis: { label: 'Amount' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly multiSeriesVertical: SkyBarChartConfig = {
    orientation: 'vertical',
    series: [
      {
        label: 'Budget',
        data: [
          { category: 'Revenue', label: '$120K', value: 120_000 },
          { category: 'Expenses', label: '$85K', value: 85_000 },
        ],
      },
      {
        label: 'Actuals',
        data: [
          { category: 'Revenue', label: '$115K', value: 115_000 },
          { category: 'Expenses', label: '$78K', value: 78_000 },
        ],
      },
    ],
    valueAxis: { label: 'Value' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly stackedVertical: SkyBarChartConfig = {
    orientation: 'vertical',
    stacked: true,
    series: [
      {
        label: 'Dataset 1',
        data: ChartDemoUtils.numbers({ count: 7, min: 0, max: 100 }).map(
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
        data: ChartDemoUtils.numbers({ count: 7, min: 0, max: 100 }).map(
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
        data: ChartDemoUtils.numbers({ count: 7, min: 0, max: 100 }).map(
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
    valueAxis: { label: 'Value' },
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
          { category: 'Jan', label: '$50K', value: 50_000 },
          { category: 'Feb', label: '$100K', value: 100_000 },
          { category: 'Mar', label: '$150K', value: 150_000 },
          { category: 'Apr', label: '$200K', value: 200_000 },
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
          { category: 'Revenue', label: '$120K', value: 120_000 },
          { category: 'Expenses', label: '$85K', value: 85_000 },
        ],
      },
      {
        label: 'Actuals',
        data: [
          { category: 'Revenue', label: '$115K', value: 115_000 },
          { category: 'Expenses', label: '$78K', value: 78_000 },
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
        data: ChartDemoUtils.numbers({ count: 7, min: 0, max: 100 }).map(
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
        data: ChartDemoUtils.numbers({ count: 7, min: 0, max: 100 }).map(
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
        data: ChartDemoUtils.numbers({ count: 7, min: 0, max: 100 }).map(
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
    valueAxis: { label: 'Amount' },
    categoryAxis: { label: 'Month' },
  };
  // #endregion
}
