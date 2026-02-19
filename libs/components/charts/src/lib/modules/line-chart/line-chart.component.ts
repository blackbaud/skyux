import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';

import { ChartConfiguration } from 'chart.js';

import {
  SkyChartHeadingLevel,
  isSkyChartHeadingLevel,
} from '../chart-shell/chart-heading-level';
import {
  SkyChartHeadingStyle,
  isSkyChartHeadingStyle,
} from '../chart-shell/chart-heading-style';
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
  public readonly headingLevel = input<SkyChartHeadingLevel, unknown>(3, {
    transform: (value: unknown) => {
      const numberValue = numberAttribute(value, 3);
      if (isSkyChartHeadingLevel(numberValue)) {
        return numberValue;
      }

      return 3;
    },
  });

  /**
   * The heading [font style](https://developer.blackbaud.com/skyux/design/styles/typography#headings).
   * @default 3
   */
  public readonly headingStyle = input<SkyChartHeadingStyle, unknown>(3, {
    transform: (value: unknown) => {
      const numberValue = numberAttribute(value, 3);
      if (isSkyChartHeadingStyle(numberValue)) {
        return numberValue;
      }

      return 3;
    },
  });

  /**
   * The text to display as the chart's subtitle.
   */
  public readonly subtitleText = input<string>();

  /**
   * Indicates whether to hide the `headingText`.
   */
  public readonly subtitleHidden = input(false, {
    transform: booleanAttribute,
  });

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
