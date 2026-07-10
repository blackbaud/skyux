import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { type SkyChartBarOrientation } from '@skyux/charts';
import { SkyToggleSwitchModule } from '@skyux/forms';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

import ChartBarBasicPlayground from '../chart-bar-basic/chart-bar-basic-playground';
import ChartBarDualAxisPlayground from '../chart-bar-dual-axis/chart-bar-dual-axis-playground';
import ChartBarHiddenLabelsPlayground from '../chart-bar-hidden-labels/chart-bar-hidden-labels-playground';
import ChartBarLogarithmicPlayground from '../chart-bar-logarithmic/chart-bar-logarithmic-playground';
import ChartBarMultipleSeriesPlayground from '../chart-bar-multiple-series/chart-bar-multiple-series-playground';
import ChartBarStackedPlayground from '../chart-bar-stacked/chart-bar-stacked-playground';
import ChartBarValueFormatPlayground from '../chart-bar-value-format/chart-bar-value-format-playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartBarBasicPlayground,
    ChartBarDualAxisPlayground,
    ChartBarHiddenLabelsPlayground,
    ChartBarLogarithmicPlayground,
    ChartBarMultipleSeriesPlayground,
    ChartBarStackedPlayground,
    ChartBarValueFormatPlayground,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyPageModule,
    SkyToggleSwitchModule,
  ],
  selector: 'app-chart-bar',
  templateUrl: './chart-bar-playground.html',
})
export default class ChartBarPlayground {
  protected readonly isHorizontal = signal(false);
  protected readonly orientation = computed<SkyChartBarOrientation>(() =>
    this.isHorizontal() ? 'horizontal' : 'vertical',
  );
}
