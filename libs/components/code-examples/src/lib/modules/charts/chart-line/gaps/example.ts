import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartLine,
  SkyChartLineSeries,
  type SkyChartLineSeriesValue,
} from '@skyux/charts';

/**
 * @title Line chart with gaps for missing values
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-line-gaps-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
  ],
})
export class ChartsChartLineGapsExample {
  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];

  // Null values render as gaps in the line and as empty cells in the
  // accessible data table.
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
