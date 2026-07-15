import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisMeasure,
  SkyChartBar,
  type SkyChartBarOrientation,
  SkyChartBarSeries,
} from '@skyux/charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisMeasure,
    SkyChartBar,
    SkyChartBarSeries,
  ],
  selector: 'app-chart-bar-grouped-stacked',
  templateUrl: './chart-bar-grouped-stacked-playground.html',
})
export class ChartBarGroupedStackedPlayground {
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
  protected readonly westInStore = [38, 6, 54, 69, 88, 13, 87];
  protected readonly westOnline = [37, 84, 28, 84, 97, 22, 63];
  protected readonly eastInStore = [24, 51, 40, 33, 62, 45, 51];
  protected readonly eastOnline = [55, 30, 47, 58, 41, 66, 39];
}
