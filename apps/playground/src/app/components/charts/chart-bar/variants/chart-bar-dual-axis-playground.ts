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
  selector: 'app-chart-bar-dual-axis',
  templateUrl: './chart-bar-dual-axis-playground.html',
})
export class ChartBarDualAxisPlayground {
  protected readonly orientation = input<SkyChartBarOrientation>('vertical');
  protected readonly years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
  protected readonly acquisitions = [10, 20, 15, 25, 22, 30, 28];
  protected readonly revenue = [1000, 2200, 1800, 2600, 2400, 3100, 2900];
}
