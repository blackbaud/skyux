import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

import { ChartConfiguration } from 'chart.js';

import { SkyChartShellComponent } from '../chart-shell/chart-shell.component';
import { SkyChartDataPointClickEvent } from '../shared/chart-types';

import { getChartJsBarChartConfig } from './bar-chart-config';
import { SkyBarChartConfig } from './bar-chart-types';

@Component({
  selector: 'sky-bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrl: 'bar-chart.component.scss',
  imports: [SkyChartShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyBarChartComponent {
  // #region Inputs
  public readonly headingText = input.required<string>();
  public readonly chartHeight = input.required<number>();
  public readonly ariaLabel = input<string>();
  public readonly config = input.required<SkyBarChartConfig>();
  // #endregion

  // #region Outputs
  public readonly dataPointClicked = output<SkyChartDataPointClickEvent>();
  // #endregion

  protected chartConfiguration = signal<ChartConfiguration | undefined>(
    undefined,
  );
  protected readonly series = computed(() => this.config().series);

  constructor() {
    effect(() => {
      this.config();
      this.refreshChartConfiguration();
    });
  }

  protected refreshChartConfiguration(): void {
    const newConfig = this.#getChartConfig();
    this.chartConfiguration.set(newConfig);
  }

  #getChartConfig(): ChartConfiguration {
    const userConfig = this.config();
    const newConfig = getChartJsBarChartConfig(userConfig, {
      onDataPointClick: (event) => this.dataPointClicked.emit(event),
    });

    return newConfig;
  }
}
