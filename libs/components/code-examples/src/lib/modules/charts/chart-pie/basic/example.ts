import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyChart, SkyChartPie, SkyChartPieSlice } from '@skyux/charts';

/**
 * @title Basic pie chart
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-pie-basic-example',
  templateUrl: './example.html',
  imports: [SkyChart, SkyChartPie, SkyChartPieSlice],
})
export class ChartsChartPieBasicExample {
  protected readonly regions = [
    { name: 'North', sales: 210 },
    { name: 'South', sales: 175 },
    { name: 'East', sales: 310 },
    { name: 'West', sales: 260 },
  ];
}
