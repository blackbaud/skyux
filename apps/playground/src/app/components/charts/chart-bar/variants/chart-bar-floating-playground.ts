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
  selector: 'app-chart-bar-floating',
  templateUrl: './chart-bar-floating-playground.html',
})
export class ChartBarFloatingPlayground {
  protected readonly orientation = input<SkyChartBarOrientation>('vertical');
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
