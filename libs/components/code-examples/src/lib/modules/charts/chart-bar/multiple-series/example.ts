import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
} from '@skyux/charts';

/**
 * @title Bar chart with multiple series (grouped bars)
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar-multiple-series-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
})
export class ChartsChartBarMultipleSeriesExample {
  protected readonly years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
  protected readonly actual = [10, 20, 15, 25, 22, 30, 28];
  protected readonly target = [12, 18, 20, 22, 26, 28, 32];
}
