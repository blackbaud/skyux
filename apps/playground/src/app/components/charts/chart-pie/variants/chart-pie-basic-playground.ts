import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  SkyChart,
  SkyChartPie,
  type SkyChartPieDisplayMode,
  SkyChartPieSlice,
} from '@skyux/charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChart, SkyChartPie, SkyChartPieSlice],
  selector: 'app-chart-pie-basic',
  templateUrl: './chart-pie-basic-playground.html',
})
export class ChartPieBasicPlayground {
  protected readonly displayMode = input<SkyChartPieDisplayMode>('pie');
  protected readonly regions = [
    { label: 'North', value: 250 },
    { label: 'South', value: 180 },
    { label: 'East', value: 320 },
    { label: 'West', value: 210 },
  ];
}
