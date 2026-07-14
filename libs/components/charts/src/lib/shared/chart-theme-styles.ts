/**
 * The resolved, themed styling for a chart, grouped by feature. Chart.js
 * renders to a canvas that cannot read CSS custom properties, so every SKY
 * theme token the library depends on is resolved here — and only here — to a
 * concrete value. This keeps the full set of tokens auditable in one place.
 *
 * When the SKY theme styles are not loaded, strings resolve to empty strings
 * and numbers to `undefined`; Chart.js treats both as unset and renders with
 * its own defaults, and `resolveChartThemeStyles` warns.
 * @internal
 */
export interface SkyChartThemeStyles {
  /**
   * The typography shared by chart text.
   */
  font: {
    family: string;

    /**
     * The size of body text, used in the legend and tooltips.
     */
    size: number | undefined;
    weight: number | undefined;
    emphasizedWeight: number | undefined;

    /**
     * The size of small text, used for axis ticks and titles.
     */
    smallSize: number | undefined;
    smallWeight: number | undefined;

    /**
     * The line height of chart text, as a multiple of the font size.
     */
    lineHeight: number;
  };

  /**
   * The text colors shared by chart text.
   */
  text: {
    color: string;
    deemphasizedColor: string;
  };

  /**
   * The styling of the axis lines, gridlines, ticks, and titles.
   */
  axis: {
    lineColor: string;
    gridlineColor: string;
    tickLength: number | undefined;

    /**
     * The vertical gap between an axis title and its ticks.
     */
    titleGap: number | undefined;
  };

  /**
   * The styling of plotted series.
   */
  series: {
    /**
     * The categorical data-visualization palette that series cycle through.
     */
    categoricalPalette: string[];
  };

  /**
   * The styling of the tooltip container and its contents.
   */
  tooltip: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number | undefined;
    cornerRadius: number | undefined;
    inset: {
      top: number | undefined;
      right: number | undefined;
      bottom: number | undefined;
      left: number | undefined;
    };

    /**
     * The size of the color-swatch icon beside each tooltip line.
     */
    iconSize: number | undefined;

    /**
     * The gap between the color-swatch icon and its text.
     */
    iconGap: number | undefined;

    /**
     * The vertical gap between the tooltip title or footer and its body.
     */
    titleGap: number | undefined;

    /**
     * The vertical gap between tooltip body lines.
     */
    bodyGap: number | undefined;
  };

  /**
   * The styling of bar chart bars.
   */
  bar: {
    borderColor: string;
    borderRadius: number | undefined;
  };
}

/**
 * Resolves the active SKY theme's chart styling from resolved CSS styles.
 * Calls `warn` when the SKY theme styles are not loaded, in which case the
 * chart renders un-themed with Chart.js defaults.
 * @internal
 */
export function resolveChartThemeStyles(
  styles: CSSStyleDeclaration,
  warn: (message: string) => void,
): SkyChartThemeStyles {
  // Every SKY theme resolves `--sky-color-text-default` — the modern theme
  // defines it and the charts stylesheets provide a default-theme override —
  // so its absence means the SKY UX theme styles are not loaded at all (or a
  // custom modern brand omits the tokens).
  if (!readString(styles, '--sky-color-text-default')) {
    warn(
      "The SKY UX theme's CSS custom properties could not be resolved, so " +
        'the chart renders un-themed. Verify that the SKY UX theme styles ' +
        'are loaded.',
    );
  }

  return {
    font: {
      family: readString(styles, '--sky-font-family-primary'),
      size: readNumber(styles, '--sky-font-size-body-m'),
      weight: readNumber(styles, '--sky-font-style-body-m'),
      emphasizedWeight: readNumber(styles, '--sky-font-style-emphasized'),
      smallSize: readNumber(styles, '--sky-font-size-body-s'),
      smallWeight: readNumber(styles, '--sky-font-style-body-s'),

      // Line height cannot be read from the theme yet: the SKY line-height
      // tokens are authored as `calc()` expressions (`--sky-font-
      // line_height-body-m` is `calc(20/15)`), which `getComputedStyle`
      // never evaluates for custom properties. Until the tokens are emitted
      // as evaluated numbers, hardcode the token's calculated value.
      lineHeight: 20 / 15,
    },
    text: {
      color: readString(styles, '--sky-color-text-default'),
      deemphasizedColor: readString(styles, '--sky-color-text-deemphasized'),
    },
    axis: {
      lineColor: readString(styles, '--sky-color-viz-axis'),
      gridlineColor: readString(styles, '--sky-color-viz-gridline'),
      tickLength: readNumber(styles, '--sky-size-chart-tick_length-measure'),
      titleGap: readNumber(styles, '--sky-space-stacked-xs'),
    },
    series: {
      categoricalPalette: Array.from({ length: 8 }, (_, index) =>
        readString(styles, `--sky-color-viz-category-${index + 1}`),
      ),
    },
    tooltip: {
      backgroundColor: readString(
        styles,
        '--sky-color-background-container-base',
      ),
      borderColor: readString(styles, '--sky-color-border-container-base'),
      borderWidth: readNumber(styles, '--sky-border-width-container-base'),
      cornerRadius: readNumber(styles, '--sky-border-radius-s'),
      inset: {
        top: readNumber(styles, '--sky-comp-chart-tooltip-space-inset-top'),
        right: readNumber(styles, '--sky-comp-chart-tooltip-space-inset-right'),
        bottom: readNumber(
          styles,
          '--sky-comp-chart-tooltip-space-inset-bottom',
        ),
        left: readNumber(styles, '--sky-comp-chart-tooltip-space-inset-left'),
      },
      iconSize: readNumber(styles, '--sky-size-icon-xs'),
      iconGap: readNumber(styles, '--sky-space-gap-icon-s'),
      titleGap: readNumber(styles, '--sky-space-stacked-s'),
      bodyGap: readNumber(styles, '--sky-space-stacked-0'),
    },
    bar: {
      borderColor: readString(styles, '--sky-color-background-container-base'),
      borderRadius: readNumber(styles, '--sky-border-radius-xs'),
    },
  };
}

/**
 * Derives the default-theme override property for a SKY theme token. The
 * modern theme's `--sky-*` tokens are not defined in the SKY UX default
 * theme, so `sky-chart` provides `--sky-override-chart-*` values scoped to
 * the default theme (see `chart.scss`). The override wins when present,
 * matching the `var(--sky-override-x, var(--sky-x))` convention used in
 * component CSS.
 */
function overrideProperty(property: string): string {
  return `--sky-override-chart-${property.slice('--sky-'.length)}`;
}

/**
 * Reads a CSS custom property — preferring its default-theme override —
 * returning an empty string when neither is set. An empty string reaching
 * Chart.js renders un-themed rather than broken, and
 * `resolveChartThemeStyles` warns when that happens.
 */
function readString(styles: CSSStyleDeclaration, property: string): string {
  return (
    styles.getPropertyValue(overrideProperty(property)).trim() ||
    styles.getPropertyValue(property).trim()
  );
}

/**
 * Reads a numeric CSS custom property — preferring its default-theme
 * override — and returns it as a number, converting `rem` values to pixels
 * using the root font size. Chart.js requires numbers (font sizes, lengths,
 * padding), and treats `undefined` as unset, so a value that is missing or
 * not a number resolves to `undefined` — never `NaN`, which would poison
 * Chart.js's layout arithmetic.
 */
function readNumber(
  styles: CSSStyleDeclaration,
  property: string,
): number | undefined {
  const raw =
    styles.getPropertyValue(overrideProperty(property)).trim() ||
    styles.getPropertyValue(property).trim();
  const value = Number.parseFloat(raw);

  if (Number.isNaN(value)) {
    return undefined;
  }

  if (raw.endsWith('rem')) {
    return (
      value *
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }

  return value;
}
