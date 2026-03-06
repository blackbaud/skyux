import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChartActivatedDatapoint,
  SkyChartCategoryAxisComponent,
  SkyChartComponent,
  SkyChartMeasureAxisComponent,
  SkyLineChartComponent,
  SkyLineChartSeriesComponent,
  SkyLineChartSeriesDatapointComponent,
} from '@skyux/charts';
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
  imports: [
    SkyLineChartComponent,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyChartComponent,
    SkyLineChartComponent,
    SkyLineChartSeriesComponent,
    SkyLineChartSeriesDatapointComponent,
    SkyChartCategoryAxisComponent,
    SkyChartMeasureAxisComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartDemoComponent {
  public readonly multiSeries = [
    {
      label: '2022',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2023',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2024',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2025',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
  ];

  public readonly stacked = [
    {
      label: '2022',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2023',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2024',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2025',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
  ];

  public readonly multiSeriesLog = [
    {
      label: '2022',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 1_000,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2023',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 1_000,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2024',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 1_000,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2025',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 1_000,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
  ];

  public readonly stackedLog = [
    {
      label: '2022',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 1_000,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2023',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 1_000,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2024',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 1_000,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
    {
      label: '2025',
      data: ChartDemoUtils.numbers({
        count: 12,
        min: 0,
        max: 1_000,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 12 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
  ];

  public onDatapointActivated(event: SkyChartActivatedDatapoint): void {
    window.alert('Datapoint Clicked: ' + JSON.stringify(event, null, 2));
  }
}
