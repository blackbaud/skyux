import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  type SkyChartBarOrientation,
  SkyChartBarSeries,
  type SkyChartBarSeriesValue,
} from '@skyux/charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
  selector: 'app-chart-bar-floating-multiple-series',
  templateUrl: './chart-bar-floating-multiple-series-playground.html',
})
export class ChartBarFloatingMultipleSeriesPlayground {
  protected readonly orientation = input<SkyChartBarOrientation>('vertical');
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
