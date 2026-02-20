import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { Chart, registerables } from 'chart.js';

import { SkyChartGridModalContext } from '../chart-data-grid-modal/chart-data-grid-modal-context';
import { SkyChartDataGridModalComponent } from '../chart-data-grid-modal/chart-data-grid-modal.component';
import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';
import { SkyChartLegendComponent } from '../chart-legend/chart-legend.component';
import { SkyChartDataPoint, SkyChartSeries } from '../shared/chart-types';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import {
  SKY_CHART_HEADER_ID,
  provideSkyChartHeaderId,
} from './chart-header-id-token';
import {
  DefaultHeadingLevel,
  SkyChartHeadingLevel,
  headingLevelInputTransformer,
} from './chart-heading-level';
import {
  DefaultHeadingStyle,
  SkyChartHeadingStyle,
  headingStyleInputTransformer,
} from './chart-heading-style';

// Register Chart.js components globally
Chart.register(...registerables);

/**
 * Shell component for all chart types. Handles common Chart.js lifecycle,
 * rendering, theme changes, and modal integration.
 */
@Component({
  selector: 'sky-chart-shell',
  templateUrl: './chart-shell.component.html',
  styleUrl: './chart-shell.component.scss',
  imports: [
    SkyChartsResourcesModule,
    SkyDropdownModule,
    SkyChartLegendComponent,
    NgClass,
  ],
  providers: [provideSkyChartHeaderId()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartShellComponent {
  // #region Dependency Injection
  readonly #modalService = inject(SkyModalService);
  protected readonly headerId = inject(SKY_CHART_HEADER_ID);
  // #endregion

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
  public readonly headingLevel = input<SkyChartHeadingLevel, unknown>(
    DefaultHeadingLevel,
    { transform: headingLevelInputTransformer },
  );

  /**
   * The heading [font style](https://developer.blackbaud.com/skyux/design/styles/typography#headings).
   * @default 3
   */
  public readonly headingStyle = input<SkyChartHeadingStyle, unknown>(
    DefaultHeadingStyle,
    { transform: headingStyleInputTransformer },
  );

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

  /**
   * The series data to render in the chart
   */
  public readonly series =
    input.required<SkyChartSeries<SkyChartDataPoint>[]>();

  public readonly legendItems = input<SkyChartLegendItem[]>([]);
  // #endregion

  // #region Output
  public readonly legendItemToggled = output<SkyChartLegendItem>();
  // #endregion

  /** TODO: Figure out chart height */
  public readonly chartHeight = signal<number>(300);

  protected headingClass = computed(
    () => `sky-font-heading-${this.headingLevel()}`,
  );
  protected readonly showLegend = computed(() => this.legendItems().length > 1);

  protected onLegendItemToggled(item: SkyChartLegendItem): void {
    this.legendItemToggled.emit(item);
  }

  protected openChartDataGridModal(): void {
    const modalContext = new SkyChartGridModalContext({
      modalTitle: this.headingText(),
      series: this.series(),
    });

    this.#modalService.open(SkyChartDataGridModalComponent, {
      size: 'large',
      providers: [
        { provide: SkyChartGridModalContext, useValue: modalContext },
      ],
    });
  }
}
