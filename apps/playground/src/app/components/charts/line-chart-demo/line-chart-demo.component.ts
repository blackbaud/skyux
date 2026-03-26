import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChartActivatedDatapoint,
  SkyChartCategoryAxisComponent,
  SkyChartComponent,
  SkyChartMeasureAxisComponent,
  SkyLineChartComponent,
  SkyLineChartPoint,
  SkyLineChartSeriesComponent,
  SkyLineChartSeriesDatapointComponent,
} from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { ChartDemoUtils } from '../shared/chart-demo-utils';

@Component({
  selector: 'app-bar-chart-demo',
  templateUrl: 'line-chart-demo.component.html',
  imports: [
    SkyPageModule,
    SkyTabsModule,
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
  // #region Linear
  public readonly singleSeries = [
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
  ];

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
  // #endregion

  // #region Logarithmic Scale
  public readonly logSingleSeries = [
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
  ];

  public readonly logMultiSeries = [
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

  public readonly logStacked = [
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
  // #endregion

  public onDatapointActivated(
    event: SkyChartActivatedDatapoint<SkyLineChartPoint>,
  ): void {
    window.alert(JSON.stringify(event, null, 2));
  }
}
