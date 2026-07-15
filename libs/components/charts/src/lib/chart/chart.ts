import {
  booleanAttribute,
  Component,
  computed,
  input,
  type TemplateRef,
} from '@angular/core';

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
 * @preview
 *
 * Provides a consistent heading, subheading, and layout wrapper for a chart.
 */
@Component({
  host: {
    class: 'sky-chart',
  },
  imports: [SkyChartControls, SkyChartHeading, SkyChartSubheading],
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
   * Whether to hide the chart's subheading.
   */
  public readonly subheadingHidden = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The text to display as the chart's subheading.
   */
  public readonly subheadingText = input<string>();

  protected readonly figureLabel = computed(() => {
    const subheadingText = this.subheadingText();

    return subheadingText
      ? `${this.headingText()}, ${subheadingText}`
      : this.headingText();
  });
}
