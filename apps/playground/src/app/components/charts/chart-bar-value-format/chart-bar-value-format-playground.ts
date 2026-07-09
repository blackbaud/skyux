import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartSeries,
} from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyBoxModule,
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartSeries,
    SkyPageModule,
  ],
  selector: 'app-chart-bar-value-format',
  templateUrl: './chart-bar-value-format-playground.html',
})
export default class ChartBarValueFormatPlayground {
  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  protected readonly acquisitions = [10, 20, 15, 25, 22, 30, 28];
  protected readonly revenue = [1000, 2200, 1800, 2600, 2400, 3100, 2900];

  // Percent values are fractional, so 0.25 displays as 25%.
  protected readonly conversionRate = [0.1, 0.14, 0.12, 0.18, 0.16, 0.22, 0.2];
}
