import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

import { ChartConfiguration } from 'chart.js';

import { SkyChartHeadingLevel } from '../chart-shell/chart-heading-level';
import { SkyChartHeadingStyle } from '../chart-shell/chart-heading-style';
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
  /**
   * The text to display as the chart's heading.
   */
  public readonly headingText = input.required<string>();

  /**
   * Indicates whether to hide the `headingText`.
   */
  public readonly headingHidden = input(false, { transform: booleanAttribute });

  /**
   * The semantic heading level in the document structure. The default is 3.
   * @default 3
   */
  public readonly headingLevel = input<SkyChartHeadingLevel>(3);

  /**
   * The heading [font style](https://developer.blackbaud.com/skyux/design/styles/typography#headings).
   * @default 3
   */
  public readonly headingStyle = input<SkyChartHeadingStyle>(3);

  /**
   * Indicates whether to hide the `headingText`.
   */
  public readonly subtitleHidden = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The text to display as the chart's subtitle.
   */
  public readonly subtitleText = input<string>();

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
