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
  selector: 'app-chart',
  templateUrl: './chart-playground.html',
})
export default class ChartPlayground {}
