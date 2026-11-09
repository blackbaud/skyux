import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
  type SkyChartBarSeriesValue,
  type SkyChartDataPointClickArgs,
} from '@skyux/charts';

/**
 * @title Bar chart with clickable data points
 */
@Component({
  imports: [
    CurrencyPipe,
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
  selector: 'app-chart-bar-data-point-click-example',
  templateUrl: './example.html',
})
export class ChartsChartBarDataPointClickExample {
  protected readonly quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  protected readonly online = [42000, 38500, 51200, 67800];
  protected readonly inPerson = [25300, 31000, 28400, 45100];

  protected readonly selection = signal<
    | { category: string | number; seriesLabelText: string; value: number }
    | undefined
  >(undefined);

  protected onDataPointClick(
    dataPoint: SkyChartDataPointClickArgs<SkyChartBarSeriesValue>,
  ): void {
    const { category, seriesLabelText, value } = dataPoint;

    // Floating bars report their value as a [start, end] range. This chart
    // plots only single values, so ranges are ignored.
    if (typeof value === 'number') {
      this.selection.set({ category, seriesLabelText, value });
    }
  }
}
