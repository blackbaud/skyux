import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
  type SkyChartBarSeriesValue,
} from '@skyux/charts';

/**
 * @title Floating bar chart with multiple series
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar-floating-multiple-series-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
})
export class ChartsChartBarFloatingMultipleSeriesExample {
  protected readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  protected readonly anchorage: SkyChartBarSeriesValue[] = [
    [-13, -6],
    [-11, -3],
    [-7, 1],
    [0, 8],
    [6, 14],
    [11, 18],
  ];
  protected readonly asheville: SkyChartBarSeriesValue[] = [
    [-3, 8],
    [-1, 11],
    [3, 15],
    [7, 20],
    [12, 24],
    [16, 28],
  ];
}
