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

import { getChartJsLineChartConfig } from './line-chart-config';
import { SkyLineChartConfig } from './line-chart-types';

@Component({
  selector: 'sky-line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrl: 'line-chart.component.scss',
  imports: [SkyChartShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLineChartComponent extends SkyBaseChart {
  // #region Inputs
  public readonly config = input.required<SkyLineChartConfig>();
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

  #getChartConfig(userConfig: SkyLineChartConfig): ChartConfiguration {
    const newConfig = getChartJsLineChartConfig(userConfig, {
      onDataPointClick: (event) => this.dataPointClicked.emit(event),
    });

    return newConfig;
  }
}
