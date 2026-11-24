import { Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategoryTime,
  SkyChartAxisValue,
  SkyChartLine,
  SkyChartLineSeries,
  type SkyChartLineSeriesValue,
} from '@skyux/charts';

/**
 * @title Line chart with a time axis
 */
@Component({
  selector: 'app-chart-line-time-scale-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategoryTime,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
  ],
})
export class ChartsChartLineTimeScaleExample {
  protected readonly eventDates = [
    '2026-01-17',
    '2026-02-07',
    '2026-02-21',
    '2026-04-11',
    '2026-06-13',
    '2026-06-27',
    '2026-09-19',
    '2026-11-07',
  ];

  protected readonly attendance: SkyChartLineSeriesValue[] = [
    120, 95, 140, 210, 180, 260, 230, 310,
  ];
}
