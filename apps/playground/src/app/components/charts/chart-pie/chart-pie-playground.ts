import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { type SkyChartPieDisplayMode } from '@skyux/charts';
import { SkyToggleSwitchModule } from '@skyux/forms';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

import { ChartPieAsyncPlayground } from './variants/chart-pie-async-playground';
import { ChartPieBasicPlayground } from './variants/chart-pie-basic-playground';
import { ChartPieValueFormatPlayground } from './variants/chart-pie-value-format-playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartPieAsyncPlayground,
    ChartPieBasicPlayground,
    ChartPieValueFormatPlayground,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyPageModule,
    SkyToggleSwitchModule,
  ],
  selector: 'app-chart-pie',
  templateUrl: './chart-pie-playground.html',
})
export default class ChartPiePlayground {
  protected readonly isDonut = signal(false);
  protected readonly displayMode = computed<SkyChartPieDisplayMode>(() =>
    this.isDonut() ? 'donut' : 'pie',
  );
}
