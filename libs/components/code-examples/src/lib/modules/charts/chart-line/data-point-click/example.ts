import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  type SkyChartDataPointClickArgs,
  SkyChartLine,
  SkyChartLineSeries,
  type SkyChartLineSeriesValue,
} from '@skyux/charts';

/**
 * @title Line chart with clickable data points
 */
@Component({
  imports: [
    CurrencyPipe,
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
  ],
  selector: 'app-chart-line-data-point-click-example',
  templateUrl: './example.html',
})
export class ChartsChartLineDataPointClickExample {
  protected readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  protected readonly online = [12400, 13800, 15100, 14200, 16900, 18300];
  protected readonly inPerson = [9800, 8700, 10400, 11900, 11200, 12600];

  protected readonly selection = signal<
    SkyChartDataPointClickArgs<SkyChartLineSeriesValue> | undefined
  >(undefined);
}
