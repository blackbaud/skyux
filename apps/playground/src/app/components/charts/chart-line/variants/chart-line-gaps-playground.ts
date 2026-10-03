import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartLine,
  SkyChartLineSeries,
  type SkyChartLineSeriesValue,
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
  selector: 'app-chart-line-gaps',
  templateUrl: './chart-line-gaps-playground.html',
})
export class ChartLineGapsPlayground {
  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];

  // Null values render as gaps in the line.
  protected readonly donations: SkyChartLineSeriesValue[] = [
    1200,
    1500,
    null,
    1800,
    null,
    2200,
    2500,
  ];
}
