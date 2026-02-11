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
  protected readonly singleSeriesHorizontal: SkyBarChartConfig = {
    orientation: 'horizontal',
    categories: ['January', 'February', 'March', 'April'],
    series: [
      {
        label: 'Spending',
        data: [
          { label: '$50K', value: 50_000 },
          { label: '$100K', value: 100_000 },
          { label: '$150K', value: 150_000 },
          { label: '$200K', value: 200_000 },
        ],
      },
    ],
    valueAxis: { beginAtZero: true },
  };

  protected readonly singleSeriesVertical: SkyBarChartConfig = {
    orientation: 'vertical',
    categories: ['January', 'February', 'March', 'April'],
    series: [
      {
        label: 'Spending',
        data: [
          { label: '$50K', value: 50_000 },
          { label: '$100K', value: 100_000 },
          { label: '$150K', value: 150_000 },
          { label: '$200K', value: 200_000 },
        ],
      },
    ],
    valueAxis: { beginAtZero: true },
  };

  protected readonly multiSeriesHorizontal: SkyBarChartConfig = {
    orientation: 'horizontal',
    categories: ['Revenue', 'Expenses'],
    series: [
      {
        label: 'Budget',
        data: [
          { label: '$120K', value: 120_000 },
          { label: '$85K', value: 85_000 },
        ],
      },
      {
        label: 'Actuals',
        data: [
          { label: '$115K', value: 115_000 },
          { label: '$78K', value: 78_000 },
        ],
      },
    ],
    valueAxis: { beginAtZero: true },
  };

  protected readonly multiSeriesVertical: SkyBarChartConfig = {
    orientation: 'vertical',
    categories: ['Revenue', 'Expenses'],
    series: [
      {
        label: 'Budget',
        data: [
          { label: '$120K', value: 120_000 },
          { label: '$85K', value: 85_000 },
        ],
      },
      {
        label: 'Actuals',
        data: [
          { label: '$115K', value: 115_000 },
          { label: '$78K', value: 78_000 },
        ],
      },
    ],
    valueAxis: { beginAtZero: true },
  };

  protected readonly fullyStackedHorizontal: SkyBarChartConfig = {
    orientation: 'horizontal',
    categories: ChartDemoUtils.months({ count: 7 }),
    series: [
      {
        label: 'Dataset 1',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 2',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 3',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
    ],
    valueAxis: { stacked: true, beginAtZero: true },
    categoryAxis: { stacked: true, beginAtZero: true },
  };

  protected readonly stackedByValueHorizontal: SkyBarChartConfig = {
    orientation: 'horizontal',
    categories: ChartDemoUtils.months({ count: 7 }),
    series: [
      {
        label: 'Dataset 1',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 2',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 3',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
    ],
    valueAxis: { stacked: true, beginAtZero: true },
    categoryAxis: { stacked: false, beginAtZero: true },
  };

  protected readonly fullyStackedVertical: SkyBarChartConfig = {
    orientation: 'vertical',
    categories: ChartDemoUtils.months({ count: 7 }),
    series: [
      {
        label: 'Dataset 1',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 2',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 3',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
    ],
    valueAxis: { stacked: true, beginAtZero: true },
    categoryAxis: { stacked: true, beginAtZero: true },
  };

  protected readonly stackedByValueVertical: SkyBarChartConfig = {
    orientation: 'vertical',
    categories: ChartDemoUtils.months({ count: 7 }),
    series: [
      {
        label: 'Dataset 1',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 2',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: 'Dataset 3',
        data: ChartDemoUtils.numbers({ count: 7, min: -100, max: 100 }).map(
          (value) => {
            return {
              label: `$${value}`,
              value,
            };
          },
        ),
      },
    ],
    valueAxis: { stacked: true, beginAtZero: true },
    categoryAxis: { stacked: false, beginAtZero: true },
  };
}
