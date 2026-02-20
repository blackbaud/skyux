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

import { getChartJsBarChartConfig } from './bar-chart-config';
import { SkyBarChartConfig } from './bar-chart-types';

@Component({
  selector: 'sky-bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrl: 'bar-chart.component.scss',
  imports: [SkyChartShellComponent, SkyChartJsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyBarChartComponent extends SkyChartJsChart {
  /**
   * The configuration object for a bar chart.
   */
  public readonly config = input.required<SkyBarChartConfig>();

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
