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

import { getChartJsLineChartConfig } from './line-chart-config';
import { SkyLineChartConfig } from './line-chart-types';

@Component({
  selector: 'sky-line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrl: 'line-chart.component.scss',
  imports: [SkyChartShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLineChartComponent {
  // #region Inputs
  public readonly headingText = input.required<string>();
  public readonly chartHeight = input.required<number>();
  public readonly ariaLabel = input<string>();
  public readonly config = input.required<SkyLineChartConfig>();
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
    const newConfig = getChartJsLineChartConfig(userConfig, {
      onDataPointClick: (event) => this.dataPointClicked.emit(event),
    });

    return newConfig;
  }
}
