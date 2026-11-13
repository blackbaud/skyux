import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyChart, SkyChartPie, SkyChartPieSlice } from '@skyux/charts';

/**
 * @title Donut chart
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-pie-donut-example',
  templateUrl: './example.html',
  imports: [SkyChart, SkyChartPie, SkyChartPieSlice],
})
export class ChartsChartPieDonutExample {
  protected readonly channels = [
    { name: 'In store', revenue: 412500 },
    { name: 'Online', revenue: 618200 },
    { name: 'Phone', revenue: 175300 },
  ];
}
