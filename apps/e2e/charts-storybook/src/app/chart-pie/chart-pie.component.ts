import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartPie,
  type SkyChartPieDisplayMode,
  SkyChartPieSlice,
} from '@skyux/charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkyChart, SkyChartPie, SkyChartPieSlice],
  selector: 'app-chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss'],
})
export class ChartPieComponent {
  public displayMode: SkyChartPieDisplayMode = 'pie';

  protected readonly regions = [
    { name: 'North', sales: 210 },
    { name: 'South', sales: 175 },
    { name: 'East', sales: 310 },
    { name: 'West', sales: 260 },
  ];

  protected readonly channels = [
    { name: 'In store', revenue: 412500 },
    { name: 'Online', revenue: 618200 },
    { name: 'Phone', revenue: 175300 },
  ];
}
