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

import { ChartBarAsyncPlayground } from './variants/chart-bar-async-playground';
import { ChartBarBasicPlayground } from './variants/chart-bar-basic-playground';
import { ChartBarFloatingMultipleSeriesPlayground } from './variants/chart-bar-floating-multiple-series-playground';
import { ChartBarFloatingPlayground } from './variants/chart-bar-floating-playground';
import { ChartBarGroupedStackedPlayground } from './variants/chart-bar-grouped-stacked-playground';
import { ChartBarHiddenLabelsPlayground } from './variants/chart-bar-hidden-labels-playground';
import { ChartBarLogarithmicPlayground } from './variants/chart-bar-logarithmic-playground';
import { ChartBarMultipleSeriesPlayground } from './variants/chart-bar-multiple-series-playground';
import { ChartBarStackedPlayground } from './variants/chart-bar-stacked-playground';
import { ChartBarValueBoundsPlayground } from './variants/chart-bar-value-bounds-playground';
import { ChartBarValueFormatPlayground } from './variants/chart-bar-value-format-playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartBarAsyncPlayground,
    ChartBarBasicPlayground,
    ChartBarFloatingMultipleSeriesPlayground,
    ChartBarFloatingPlayground,
    ChartBarGroupedStackedPlayground,
    ChartBarHiddenLabelsPlayground,
    ChartBarLogarithmicPlayground,
    ChartBarMultipleSeriesPlayground,
    ChartBarStackedPlayground,
    ChartBarValueBoundsPlayground,
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
