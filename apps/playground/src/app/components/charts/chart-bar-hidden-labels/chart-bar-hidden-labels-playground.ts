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
  selector: 'app-chart-bar-hidden-labels',
  templateUrl: './chart-bar-hidden-labels-playground.html',
})
export default class ChartBarHiddenLabelsPlayground {
  protected readonly years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
  protected readonly acquisitions = [10, 20, 15, 25, 22, 30, 28];
}
