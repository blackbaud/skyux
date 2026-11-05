import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
  type SkyChartDataPointClick,
} from '@skyux/charts';

/**
 * @title Bar chart with clickable data points
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar-data-point-click-example',
  templateUrl: './example.html',
  imports: [
    CurrencyPipe,
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
})
export class ChartsChartBarDataPointClickExample {
  protected readonly quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  protected readonly online = [42000, 38500, 51200, 67800];
  protected readonly inPerson = [25300, 31000, 28400, 45100];

  protected readonly selection = signal<
    | { category: string | number; seriesLabelText: string; value: number }
    | undefined
  >(undefined);

  protected onDataPointClick(dataPoint: SkyChartDataPointClick): void {
    const { category, seriesLabelText, value } = dataPoint;

    // Floating bars report their value as a [start, end] range. This chart
    // plots only single values, so ranges are ignored.
    if (typeof value === 'number') {
      this.selection.set({ category, seriesLabelText, value });
    }
  }
}
