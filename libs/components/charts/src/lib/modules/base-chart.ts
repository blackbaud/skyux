import { Directive, booleanAttribute, input, output } from '@angular/core';

import {
  DefaultHeadingLevel,
  SkyChartHeadingLevel,
  headingLevelInputTransformer,
} from './chart-shell/chart-heading-level';
import {
  DefaultHeadingStyle,
  SkyChartHeadingStyle,
  headingStyleInputTransformer,
} from './chart-shell/chart-heading-style';
import { SkyChartDataPointClickEvent } from './shared/chart-types';

/**
 * Base class for all chart types.
 * @internal
 */
@Directive()
export abstract class SkyBaseChart {
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
  // #endregion

  // #region Outputs
  public readonly dataPointClicked = output<SkyChartDataPointClickEvent>();
  // #endregion
}
