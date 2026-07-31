import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

import { ChartLineAsyncPlayground } from './variants/chart-line-async-playground';
import { ChartLineBasicPlayground } from './variants/chart-line-basic-playground';
import { ChartLineGapsPlayground } from './variants/chart-line-gaps-playground';
import { ChartLineLogarithmicPlayground } from './variants/chart-line-logarithmic-playground';
import { ChartLineMultipleSeriesPlayground } from './variants/chart-line-multiple-series-playground';
import { ChartLineValueFormatPlayground } from './variants/chart-line-value-format-playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartLineAsyncPlayground,
    ChartLineBasicPlayground,
    ChartLineGapsPlayground,
    ChartLineLogarithmicPlayground,
    ChartLineMultipleSeriesPlayground,
    ChartLineValueFormatPlayground,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyPageModule,
  ],
  selector: 'app-chart-line',
  templateUrl: './chart-line-playground.html',
})
export default class ChartLinePlayground {}
