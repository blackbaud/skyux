import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartLine,
  SkyChartLineSeries,
} from '@skyux/charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
  ],
  selector: 'app-chart-line-logarithmic',
  templateUrl: './chart-line-logarithmic-playground.html',
})
export class ChartLineLogarithmicPlayground {
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
