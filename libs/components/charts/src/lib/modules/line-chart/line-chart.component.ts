import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
} from '@angular/core';

import { ChartConfiguration } from 'chart.js';

import { SkyChartShellComponent } from '../chart-shell/chart-shell.component';
import { SkyChartJsChart } from '../chartjs-chart';
import { SkyChartJsDirective } from '../chartjs.directive';

import { getChartJsLineChartConfig } from './line-chart-config';
import { SkyLineChartConfig } from './line-chart-types';

@Component({
  selector: 'sky-line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrl: 'line-chart.component.scss',
  imports: [SkyChartShellComponent, SkyChartJsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLineChartComponent extends SkyChartJsChart {
  /**
   * The configuration object for a line chart.
   */
  public readonly config = input.required<SkyLineChartConfig>();

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
