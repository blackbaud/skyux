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
  selector: 'app-chart-line-value-format',
  templateUrl: './chart-line-value-format-playground.html',
})
export class ChartLineValueFormatPlayground {
  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  protected readonly revenue = [1000, 2200, 1800, 2600, 2400, 3100, 2900];

  // Percent values are fractional, so 0.25 displays as 25%.
  protected readonly conversionRate = [0.1, 0.14, 0.12, 0.18, 0.16, 0.22, 0.2];
}
