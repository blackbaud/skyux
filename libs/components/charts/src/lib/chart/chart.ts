import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type TemplateRef,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyLibResourcesService } from '@skyux/i18n';
import { of, switchMap } from 'rxjs';

import { SkyChartTableService } from '../chart-table/chart-table-service';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';
import { SkyChartControls } from './chart-controls';
import { SkyChartHeading } from './chart-heading';
import {
  DEFAULT_HEADING_LEVEL,
  headingLevelInputTransformer,
  type SkyChartHeadingLevel,
} from './chart-heading-level';
import {
  DEFAULT_HEADING_STYLE,
  headingStyleInputTransformer,
  type SkyChartHeadingStyle,
} from './chart-heading-style';
import { SkyChartSubheading } from './chart-subheading';

/**
 * Provides a consistent heading, subheading, and layout wrapper for a chart.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-chart',
  },
  imports: [
    SkyChartControls,
    SkyChartHeading,
    SkyChartSubheading,
    SkyChartsResourcesModule,
  ],
  providers: [SkyChartTableService],
  selector: 'sky-chart',
  styleUrl: './chart.scss',
  templateUrl: './chart.html',
})
export class SkyChart {
  /**
   * Whether to hide the chart's heading.
   */
  public readonly headingHidden = input(false, { transform: booleanAttribute });

  /**
   * The semantic heading level in the document structure.
   * @default 3
   */
  public readonly headingLevel = input<SkyChartHeadingLevel, unknown>(
    DEFAULT_HEADING_LEVEL,
    {
      transform: headingLevelInputTransformer,
    },
  );

  /**
   * The heading [font style](https://developer.blackbaud.com/skyux/design/styles/typography#headings).
   * @default 3
   */
  public readonly headingStyle = input<SkyChartHeadingStyle, unknown>(
    DEFAULT_HEADING_STYLE,
    {
      transform: headingStyleInputTransformer,
    },
  );

  /**
   * The text to display as the chart's heading.
   */
  public readonly headingText = input.required<string>();

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the chart heading. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application.
   */
  public readonly helpKey = input<string>();

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the chart heading. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   */
  public readonly helpPopoverContent = input<string | TemplateRef<unknown>>();

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is also specified.
   */
  public readonly helpPopoverTitle = input<string>();

  /**
   * The text to display as the chart's subheading.
   */
  public readonly subheadingText = input<string>();

  readonly #resourcesSvc = inject(SkyLibResourcesService);
  readonly #tableSvc = inject(SkyChartTableService);

  // Resolve the plot's descriptive summary into localized text. Each plot type
  // publishes its own resource key and arguments, so the wording can describe
  // that type's shape.
  readonly #summaryText = toSignal(
    toObservable(this.#tableSvc.summary).pipe(
      switchMap((summary) =>
        summary
          ? this.#resourcesSvc.getString(summary.resourceKey, ...summary.args)
          : of(undefined),
      ),
    ),
    { initialValue: undefined },
  );

  protected readonly figureLabel = computed(() => {
    const parts: string[] = [];

    // When the heading is hidden, name the figure with the title (and
    // subheading) so it is not lost. When the heading is visible, it already
    // provides that context, so the title is omitted here to avoid announcing
    // it twice.
    if (this.headingHidden()) {
      const subheadingText = this.subheadingText();

      parts.push(
        subheadingText
          ? `${this.headingText()}, ${subheadingText}`
          : this.headingText(),
      );
    }

    // The descriptive summary (chart type, shape, and that a data table is
    // available) adds information rather than echoing the title, so it is safe
    // to include whether or not the heading is visible.
    const summaryText = this.#summaryText();

    if (summaryText) {
      parts.push(summaryText);
    }

    return parts.length > 0 ? parts.join('. ') : null;
  });
}
