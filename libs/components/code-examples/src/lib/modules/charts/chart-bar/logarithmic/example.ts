import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
} from '@skyux/charts';

/**
 * @title Bar chart with a logarithmic value scale
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar-logarithmic-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
})
export class ChartsChartBarLogarithmicExample {
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
