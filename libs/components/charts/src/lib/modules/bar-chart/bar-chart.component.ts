import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';

import { ChartConfiguration } from 'chart.js';

import { SkyBaseChart } from '../base-chart';
import { SkyChartShellComponent } from '../chart-shell/chart-shell.component';

import { getChartJsBarChartConfig } from './bar-chart-config';
import { SkyBarChartConfig } from './bar-chart-types';

@Component({
  selector: 'sky-bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrl: 'bar-chart.component.scss',
  imports: [SkyChartShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyBarChartComponent extends SkyBaseChart {
  // #region Inputs
  public readonly config = input.required<SkyBarChartConfig>();
  // #endregion

  protected chartConfiguration = signal<ChartConfiguration | undefined>(
    undefined,
  );
  protected readonly series = computed(() => this.config().series);

  constructor() {
    super();

    effect(() => {
      const newConfig = this.#getChartConfig(this.config());
      this.chartConfiguration.set(newConfig);
    });
  }

  #getChartConfig(userConfig: SkyBarChartConfig): ChartConfiguration {
    const newConfig = getChartJsBarChartConfig(userConfig, {
      onDataPointClick: (event) => this.dataPointClicked.emit(event),
    });

    return newConfig;
  }
}
