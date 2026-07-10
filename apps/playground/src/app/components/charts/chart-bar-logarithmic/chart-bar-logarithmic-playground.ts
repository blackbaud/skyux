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
  selector: 'app-chart-bar-logarithmic',
  templateUrl: './chart-bar-logarithmic-playground.html',
})
export default class ChartBarLogarithmicPlayground {
  protected readonly orientation = input<SkyChartBarOrientation>('vertical');
  protected readonly categories = [
    'Cat-1',
    'Cat-2',
    'Cat-3',
    'Cat-4',
    'Cat-5',
    'Cat-6',
    'Cat-7',
    'Cat-8',
    'Cat-9',
    'Cat-10',
    'Cat-11',
    'Cat-12',
    'Cat-13',
  ];
  protected readonly values = [
    1, 1.1, 1.9, 2.1, 4.9, 5.1, 9, 11, 90, 110, 900, 1100, 9000,
  ];
}
