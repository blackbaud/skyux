import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartLine,
  SkyChartLineSeries,
} from '@skyux/charts';

/**
 * @title Line chart with multiple series
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-line-multiple-series-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
  ],
})
export class ChartsChartLineMultipleSeriesExample {
  protected readonly years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
  protected readonly actual = [10, 20, 15, 25, 22, 30, 28];
  protected readonly target = [12, 18, 20, 22, 26, 28, 32];
}
