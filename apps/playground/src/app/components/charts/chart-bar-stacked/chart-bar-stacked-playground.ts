import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  type SkyChartBarOrientation,
  SkyChartSeries,
} from '@skyux/charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartSeries,
  ],
  selector: 'app-chart-bar-stacked',
  templateUrl: './chart-bar-stacked-playground.html',
})
export default class ChartBarStackedPlayground {
  protected readonly orientation = input<SkyChartBarOrientation>('vertical');
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
