import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { SkyIdService } from '@skyux/core';
import { SkyChartHeading } from './chart-heading';
import { SkyChartSubheading } from './chart-subheading';
import {
  DEFAULT_HEADING_LEVEL,
  headingLevelInputTransformer,
  type SkyChartHeadingLevel,
} from './utils/heading-level';
import {
  DEFAULT_HEADING_STYLE,
  headingStyleInputTransformer,
  type SkyChartHeadingStyle,
} from './utils/heading-style';

/**
 * @preview
 *
 * Provides a consistent heading, subheading, and layout wrapper for a chart.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-chart',
  },
  imports: [SkyChartHeading, SkyChartSubheading],
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
   * The text to display as the chart's subheading.
   */
  public readonly subheadingText = input<string>();

  protected readonly headingId = inject(SkyIdService).generateId();
}
