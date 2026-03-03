import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyChartGridModalContext } from '../chart-data-grid-modal/chart-data-grid-modal-context';
import { SkyChartDataGridModalComponent } from '../chart-data-grid-modal/chart-data-grid-modal.component';
import { SkyChartLegendItem } from '../chart-legend/chart-legend-item';
import { SkyChartLegendComponent } from '../chart-legend/chart-legend.component';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';
import {
  DefaultHeadingLevel,
  SkyChartHeadingLevel,
  headingLevelInputTransformer,
} from '../shared/types/chart-heading-level';
import {
  DefaultHeadingStyle,
  SkyChartHeadingStyle,
  headingStyleInputTransformer,
} from '../shared/types/chart-heading-style';

import {
  SKY_CHART_HEADER_ID,
  provideSkyChartHeaderId,
} from './chart-header-id-token';
import { SkyChartService } from './chart.service';

/**
 * Wrapper component that provides heading and subtitle context to nested chart components.
 * Use this as the outer container and place a chart type component (e.g. `sky-bar-chart`) inside it.
 */
@Component({
  selector: 'sky-chart',
  templateUrl: 'chart.component.html',
  styleUrl: 'chart.component.scss',
  imports: [
    SkyChartsResourcesModule,
    SkyDropdownModule,
    SkyChartLegendComponent,
    NgClass,
  ],
  providers: [provideSkyChartHeaderId(), SkyChartService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartComponent {
  // #region Dependency Injection
  protected readonly headerId = inject(SKY_CHART_HEADER_ID);
  readonly #modalService = inject(SkyModalService);
  readonly #chartService = inject(SkyChartService);
  // #endregion

  // #region Inputs
  public readonly headingText = input.required<string>();
  public readonly headingHidden = input(false, { transform: booleanAttribute });
  public readonly headingLevel = input<SkyChartHeadingLevel, unknown>(
    DefaultHeadingLevel,
    { transform: headingLevelInputTransformer },
  );
  public readonly headingStyle = input<SkyChartHeadingStyle, unknown>(
    DefaultHeadingStyle,
    { transform: headingStyleInputTransformer },
  );
  public readonly subtitleText = input<string>();
  public readonly subtitleHidden = input(false, {
    transform: booleanAttribute,
  });
  // #endregion

  protected readonly headingClass = computed(
    () => `sky-font-heading-${this.headingLevel()}`,
  );
  protected readonly legendItems = this.#chartService.legendItems;
  protected readonly showLegend = computed(() => this.legendItems().length > 1);

  protected onLegendItemToggled(item: SkyChartLegendItem): void {
    this.#chartService.toggleLegendItem(item);
  }

  protected openChartDataGridModal(): void {
    const modalContext = new SkyChartGridModalContext({
      modalTitle: this.headingText(),
      series: this.#chartService.series(),
    });

    this.#modalService.open(SkyChartDataGridModalComponent, {
      size: 'large',
      providers: [
        { provide: SkyChartGridModalContext, useValue: modalContext },
      ],
    });
  }
}
