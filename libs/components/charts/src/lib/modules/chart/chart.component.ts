import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
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

import { SkyChartService } from './chart.service';

/**
 * Wrapper component that provides heading and subtitle context to nested chart components.
 * Use this as the outer container and place a chart type component (e.g. `sky-chart-bar`) inside it.
 */
@Component({
  selector: 'sky-chart',
  templateUrl: 'chart.component.html',
  styleUrl: 'chart.component.scss',
  imports: [
    SkyChartsResourcesModule,
    SkyDropdownModule,
    SkyHelpInlineModule,
    SkyChartLegendComponent,
  ],
  providers: [SkyChartService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartComponent {
  // #region Dependency Injection
  readonly #modalService = inject(SkyModalService);
  readonly #chartService = inject(SkyChartService);
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
   * Indicates whether to hide the `subtitleText`.
   */
  public readonly subtitleHidden = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The content of the help popover. When specified along with `headingText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the chart heading. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `headingText` is also specified.
   */
  public helpPopoverContent = input<
    string | TemplateRef<unknown> | undefined
  >();

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is also specified.
   */
  public helpPopoverTitle = input<string | undefined>();

  /**
   * A help key that identifies the global help content to display. When specified along with `headingText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the chart heading. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `headingText` is also specified.
   */
  public helpKey = input<string | undefined>();
  // #endregion

  protected readonly includeHeaderMargin = computed(() => {
    const headingVisible = !!this.headingText() && !this.headingHidden();
    const subtitleVisible = !!this.subtitleText() && !this.subtitleHidden();
    return headingVisible || subtitleVisible;
  });
  protected readonly headingClass = computed(
    () => `sky-font-heading-${this.headingStyle()}`,
  );
  protected readonly legendItems = this.#chartService.legendItems;
  protected readonly showLegend = computed(() => this.legendItems().length > 1);

  constructor() {
    effect(() => this.#chartService.headingText.set(this.headingText()));
  }

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
