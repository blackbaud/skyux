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

import { getChartJsBarChartConfig } from './bar-chart-config';
import { SkyBarChartConfig } from './bar-chart-types';

@Component({
  selector: 'sky-bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrl: 'bar-chart.component.scss',
  imports: [SkyChartShellComponent, SkyChartJsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyBarChartComponent extends SkyBaseChartJsChart {
  /**
   * The configuration object for a bar chart.
   */
  public readonly config = input.required<SkyBarChartConfig>();

  protected readonly chartConfiguration = computed(() => {
    this.themeVersion(); // Include themeVersion to trigger recalculation on theme changes

    return this.createChartConfiguration();
  });

  /**
   * Generates the Chart.js configuration for the bar chart.
   * This method is called automatically when the `config` input changes or when the theme changes.
   *
   * @returns The Chart.js configuration object
   */
  protected createChartConfiguration(): ChartConfiguration {
    const config = this.config();
    const chartConfiguration = getChartJsBarChartConfig(config, {
      onDataPointClick: (event) => this.dataPointClicked.emit(event),
    });

    return chartConfiguration;
  }
}
