import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyLineChartComponent, SkyLineChartConfig } from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';

import { ChartDemoUtils } from '../shared/chart-demo-utils';

@Component({
  selector: 'app-bar-chart-demo',
  templateUrl: 'line-chart-demo.component.html',
  styles: [
    `
      :host {
        display: block;
        margin: 20px;
      }
    `,
  ],
  imports: [SkyLineChartComponent, SkyBoxModule, SkyFluidGridModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartDemoComponent {
  protected readonly singleSeries: SkyLineChartConfig = {
    series: [
      {
        label: '2022',
        data: [
          { label: '$25K', category: 'Jan', value: 25 },
          { label: '$28K', category: 'Feb', value: 28 },
          { label: '$22K', category: 'Mar', value: 22 },
          { label: '$35K', category: 'Apr', value: 35 },
          { label: '$30K', category: 'May', value: 30 },
          { label: '$45K', category: 'Jun', value: 45 },
          { label: '$38K', category: 'Jul', value: 38 },
          { label: '$42K', category: 'Aug', value: 42 },
          { label: '$50K', category: 'Sep', value: 50 },
          { label: '$40K', category: 'Oct', value: 40 },
          { label: '$55K', category: 'Nov', value: 55 },
          { label: '$48K', category: 'Dec', value: 48 },
        ],
      },
    ],
    valueAxis: { label: 'Amount' },
    categoryAxis: { label: 'Month' },
  };

  protected readonly multiSeries: SkyLineChartConfig = {
    series: [
      {
        label: '2022',
        data: ChartDemoUtils.numbers({ count: 12, min: 0, max: 100 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 12 })[index],
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: '2023',
        data: ChartDemoUtils.numbers({ count: 12, min: 0, max: 100 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 12 })[index],
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: '2024',
        data: ChartDemoUtils.numbers({ count: 12, min: 0, max: 100 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 12 })[index],
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: '2025',
        data: ChartDemoUtils.numbers({ count: 12, min: 0, max: 100 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 12 })[index],
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

  protected readonly stacked: SkyLineChartConfig = {
    stacked: true,
    series: [
      {
        label: '2022',
        data: ChartDemoUtils.numbers({ count: 12, min: 0, max: 100 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 12 })[index],
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: '2023',
        data: ChartDemoUtils.numbers({ count: 12, min: 0, max: 100 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 12 })[index],
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: '2024',
        data: ChartDemoUtils.numbers({ count: 12, min: 0, max: 100 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 12 })[index],
              label: `$${value}`,
              value,
            };
          },
        ),
      },
      {
        label: '2025',
        data: ChartDemoUtils.numbers({ count: 12, min: 0, max: 100 }).map(
          (value, index) => {
            return {
              category: ChartDemoUtils.months({ count: 12 })[index],
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
}
