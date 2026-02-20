import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { ChartConfiguration } from 'chart.js';

import { SkyChartShellComponent } from '../chart-shell/chart-shell.component';
import { SkyChartJsChart } from '../chartjs-chart';
import { SkyChartJsDirective } from '../chartjs.directive';

import { getChartJsDonutChartConfig } from './donut-chart-config';
import { SkyDonutChartConfig } from './donut-chart-types';

@Component({
  selector: 'sky-donut-chart',
  templateUrl: 'donut-chart.component.html',
  styleUrl: 'donut-chart.component.scss',
  imports: [SkyChartShellComponent, SkyChartJsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDonutChartComponent extends SkyChartJsChart {
  /**
   * The configuration object for a donut chart.
   */
  public readonly config = input.required<SkyDonutChartConfig>();

  protected readonly chartConfiguration = computed(() =>
    this.#getChartConfig(this.config()),
  );
  protected readonly series = computed(() => [this.config().series]);

  #getChartConfig(userConfig: SkyDonutChartConfig): ChartConfiguration {
    const newConfig = getChartJsDonutChartConfig(userConfig, {
      onDataPointClick: (event) => this.dataPointClicked.emit(event),
    });

    return newConfig;
  }
}
