import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { ChartConfiguration } from 'chart.js';

import { SkyBaseChartJsChart } from '../base-chartjs-chart';
import { SkyChartShellComponent } from '../chart-shell/chart-shell.component';
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
export class SkyLineChartComponent extends SkyBaseChartJsChart {
  /**
   * The configuration object for a line chart.
   */
  public readonly config = input.required<SkyLineChartConfig>();

  protected readonly chartConfiguration = computed(() => {
    this.themeVersion(); // Include themeVersion to trigger recalculation on theme changes

    return this.createChartConfiguration();
  });

  protected createChartConfiguration(): ChartConfiguration {
    const config = this.config();
    const chartConfiguration = getChartJsLineChartConfig(config, {
      onDataPointClick: (event) => this.dataPointClicked.emit(event),
    });

    return chartConfiguration;
  }
}
