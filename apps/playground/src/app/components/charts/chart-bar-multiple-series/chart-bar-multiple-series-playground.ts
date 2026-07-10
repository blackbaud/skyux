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
  selector: 'app-chart-bar-multiple-series',
  templateUrl: './chart-bar-multiple-series-playground.html',
})
export default class ChartBarMultipleSeriesPlayground {
  protected readonly orientation = input<SkyChartBarOrientation>('vertical');
  protected readonly years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
  protected readonly actual = [10, 20, 15, 25, 22, 30, 28];
  protected readonly target = [12, 18, 20, 22, 26, 28, 32];
}
