import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
} from '@skyux/charts';

/**
 * @title Stacked bar chart
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar-stacked-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
})
export class ChartsChartBarStackedExample {
  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  protected readonly online = [38, 6, 54, 69, 88, 13, 87];
  protected readonly inStore = [37, 84, 28, 84, 97, 22, 63];
  protected readonly phone = [86, 4, 7, 85, 8, 51, 30];
}
