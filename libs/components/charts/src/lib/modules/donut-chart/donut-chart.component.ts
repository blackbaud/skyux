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

import { getChartJsDonutChartConfig } from './donut-chart-config';
import { SkyDonutChartConfig } from './donut-chart-types';

@Component({
  selector: 'sky-donut-chart',
  templateUrl: 'donut-chart.component.html',
  styleUrl: 'donut-chart.component.scss',
  imports: [SkyChartShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDonutChartComponent extends SkyBaseChart {
  // #region Inputs
  public readonly config = input.required<SkyDonutChartConfig>();
  // #endregion

  protected chartConfiguration = signal<ChartConfiguration | undefined>(
    undefined,
  );
  protected readonly series = computed(() => [this.config().series]);

  constructor() {
    super();

    effect(() => {
      const newConfig = this.#getChartConfig(this.config());
      this.chartConfiguration.set(newConfig);
    });
  }

  #getChartConfig(userConfig: SkyDonutChartConfig): ChartConfiguration {
    const newConfig = getChartJsDonutChartConfig(userConfig, {
      onDataPointClick: (event) => this.dataPointClicked.emit(event),
    });

    return newConfig;
  }
}
