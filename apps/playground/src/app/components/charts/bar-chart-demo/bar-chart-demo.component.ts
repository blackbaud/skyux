import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyBarChartComponent,
  SkyBarChartSeriesComponent,
  SkyBarChartSeriesDatapointComponent,
  SkyChartActivatedDatapoint,
  SkyChartCategoryAxisComponent,
  SkyChartComponent,
  SkyChartMeasureAxisComponent,
} from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { ChartDemoUtils } from '../shared/chart-demo-utils';

@Component({
  selector: 'app-bar-chart-demo',
  templateUrl: './bar-chart-demo.component.html',
  styles: [],
  imports: [
    SkyPageModule,
    SkyBarChartComponent,
    SkyBoxModule,
    SkyTabsModule,
    SkyFluidGridModule,
    SkyBarChartComponent,
    SkyBarChartSeriesComponent,
    SkyBarChartSeriesDatapointComponent,
    SkyChartCategoryAxisComponent,
    SkyChartMeasureAxisComponent,
    SkyChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartDemoComponent {
  // #region Vertical
  public readonly verticalSingleSeries = [
    {
      labelText: 'Spending',
      data: [
        { category: 'January', label: '$50,000', value: 50_000 },
        { category: 'February', label: '$100,000', value: 100_000 },
        { category: 'March', label: '$150,000', value: 150_000 },
        { category: 'April', label: '$200,000', value: 200_000 },
      ],
    },
  ];

  public readonly verticalMultiSeries = [
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
        { category: 'Revenue', label: '$15,000', value: 115_000 },
        { category: 'Expense', label: '$78,000', value: 78_000 },
      ],
    },
  ];

  public readonly verticalStacked = [
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
  ];

  public readonly verticalLog = [
    {
      label: 'Dataset 1',
      data: [1, 1.1, 1.9, 2.1, 4.9, 5.1, 9, 11, 90, 110, 900, 1100, 9000].map(
        (value, index) => {
          return {
            category: 'Cat-' + (index + 1),
            label: `$${value}`,
            value: value,
          };
        },
      ),
    },
  ];

  public readonly verticalStackedLog = [
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
  ];
  // #endregion

  // #region Horizontal
  public readonly horizontalSingleSeries = [];

  public readonly horizontalMultiSeries = [];

  public readonly horizontalStacked = [
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
  ];

  public readonly horizontalLog = [];

  public readonly horizontalLogStacked = [
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
  ];
  // #endregion

  public onDatapointActivated(event: SkyChartActivatedDatapoint): void {
    window.alert('Datapoint Clicked: ' + JSON.stringify(event, null, 2));
  }
}
