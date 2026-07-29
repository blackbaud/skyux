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
 * @title Floating bar chart (value ranges)
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar-floating-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
})
export class ChartsChartBarFloatingExample {
  protected readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  protected readonly temperatureRanges: SkyChartBarSeriesValue[] = [
    [-2, 5],
    [0, 8],
    [4, 14],
    [9, 19],
    [14, 24],
    [18, 28],
  ];
}
