import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
} from '@skyux/charts';

/**
 * @title Bar chart with grouped, stacked series
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar-grouped-stacked-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
})
export class ChartsChartBarGroupedStackedExample {
  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  protected readonly westInStore = [38, 6, 54, 69, 88, 13, 87];
  protected readonly westOnline = [37, 84, 28, 84, 97, 22, 63];
  protected readonly eastInStore = [24, 51, 40, 33, 62, 45, 51];
  protected readonly eastOnline = [55, 30, 47, 58, 41, 66, 39];
}
