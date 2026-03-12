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
  imports: [
    SkyBarChartComponent,
    SkyBoxModule,
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
  public readonly stackedVertical = [
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

  public readonly stackedVerticalLog = [
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
  public readonly stackedHorizontal = [
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

  public readonly stackedHorizontalLog = [
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
