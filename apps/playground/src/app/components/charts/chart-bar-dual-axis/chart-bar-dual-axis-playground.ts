import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartBar,
  SkyChartCategoryAxis,
  SkyChartSeries,
  SkyChartValueAxis,
} from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyBoxModule,
    SkyChart,
    SkyChartBar,
    SkyChartCategoryAxis,
    SkyChartSeries,
    SkyChartValueAxis,
    SkyPageModule,
  ],
  selector: 'app-chart-bar-dual-axis',
  templateUrl: './chart-bar-dual-axis-playground.html',
})
export default class ChartBarDualAxisPlayground {
  protected readonly years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
  protected readonly acquisitions = [10, 20, 15, 25, 22, 30, 28];
  protected readonly revenue = [1000, 2200, 1800, 2600, 2400, 3100, 2900];
}
