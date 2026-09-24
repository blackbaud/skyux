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
  selector: 'app-chart-pie-value-format',
  templateUrl: './chart-pie-value-format-playground.html',
})
export class ChartPieValueFormatPlayground {
  protected readonly displayMode = input<SkyChartPieDisplayMode>('pie');
  protected readonly channels = [
    { label: 'In store', value: 125000.5 },
    { label: 'Online', value: 243500.75 },
    { label: 'Phone', value: 58250.25 },
  ];
}
