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
 * Resolves the active SKY theme's chart styling for the given host element.
 * Calls `warn` when the SKY theme styles are not loaded, in which case the
 * chart renders un-themed with Chart.js defaults.
 * @internal
 */
export function resolveChartThemeStyles(
  host: HTMLElement,
  warn: (message: string) => void,
): SkyChartThemeStyles {
  const styles = getComputedStyle(host);

  // Custom properties keep `calc()` expressions unevaluated (for example, the
  // SKY line-height tokens are authored as `calc(20/15)`). The probe assigns
  // those raw values to a standard property, which the browser evaluates, and
  // reads the resolved value back. It is created lazily — only for values the
  // fast path cannot parse — and torn down once resolution finishes.
  const probe = createTokenProbe(host);

  try {
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
        size: readNumber(styles, probe, '--sky-font-size-body-m'),
        weight: readNumber(styles, probe, '--sky-font-style-body-m'),
        emphasizedWeight: readNumber(
          styles,
          probe,
          '--sky-font-style-emphasized',
        ),
        smallSize: readNumber(styles, probe, '--sky-font-size-body-s'),
        smallWeight: readNumber(styles, probe, '--sky-font-style-body-s'),
        lineHeight: readLineHeight(styles, probe),
      },
      text: {
        color: readString(styles, '--sky-color-text-default'),
        deemphasizedColor: readString(styles, '--sky-color-text-deemphasized'),
      },
      axis: {
        lineColor: readString(styles, '--sky-color-viz-axis'),
        gridlineColor: readString(styles, '--sky-color-viz-gridline'),
        tickLength: readNumber(
          styles,
          probe,
          '--sky-size-chart-tick_length-measure',
        ),
        titleGap: readNumber(styles, probe, '--sky-space-stacked-xs'),
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
        borderWidth: readNumber(
          styles,
          probe,
          '--sky-border-width-container-base',
        ),
        cornerRadius: readNumber(styles, probe, '--sky-border-radius-s'),
        inset: {
          top: readNumber(
            styles,
            probe,
            '--sky-comp-chart-tooltip-space-inset-top',
          ),
          right: readNumber(
            styles,
            probe,
            '--sky-comp-chart-tooltip-space-inset-right',
          ),
          bottom: readNumber(
            styles,
            probe,
            '--sky-comp-chart-tooltip-space-inset-bottom',
          ),
          left: readNumber(
            styles,
            probe,
            '--sky-comp-chart-tooltip-space-inset-left',
          ),
        },
        iconSize: readNumber(styles, probe, '--sky-size-icon-xs'),
        iconGap: readNumber(styles, probe, '--sky-space-gap-icon-s'),
        titleGap: readNumber(styles, probe, '--sky-space-stacked-s'),
        bodyGap: readNumber(styles, probe, '--sky-space-stacked-0'),
      },
      bar: {
        borderColor: readString(
          styles,
          '--sky-color-background-container-base',
        ),
        borderRadius: readNumber(styles, probe, '--sky-border-radius-xs'),
      },
    };
  } finally {
    probe.destroy();
  }
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
 * override — as a number, converting `rem` values to pixels using the root
 * font size. Values the fast path cannot parse (such as `calc()` lengths) are
 * resolved through the probe. Chart.js requires numbers and treats `undefined`
 * as unset, so a missing or unresolvable value returns `undefined` — never
 * `NaN`, which would poison Chart.js's layout arithmetic.
 */
function readNumber(
  styles: CSSStyleDeclaration,
  probe: SkyChartTokenProbe,
  property: string,
): number | undefined {
  const raw = readString(styles, property);

  if (raw === '') {
    return undefined;
  }

  const value = Number.parseFloat(raw);

  if (!Number.isNaN(value)) {
    return raw.endsWith('rem')
      ? value *
          Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
      : value;
  }

  // A non-numeric literal such as a `calc()` length; resolve it via the probe.
  return probe.resolveLength(raw);
}

/**
 * The body-m line height as a multiple of its font size, matching the
 * `--sky-font-line_height-body-m` token's calculated value (`calc(20/15)`).
 * Used when the token is unset or cannot be resolved.
 */
const DEFAULT_BODY_LINE_HEIGHT = 20 / 15;

/**
 * Reads the body-m line height as a multiple of the font size. The SKY
 * line-height tokens are `calc()` expressions that `getComputedStyle` leaves
 * unevaluated on custom properties, so the token is resolved through the probe.
 * Falls back to the body-m value when the token is unset or cannot be resolved.
 */
function readLineHeight(
  styles: CSSStyleDeclaration,
  probe: SkyChartTokenProbe,
): number {
  const raw = readString(styles, '--sky-font-line_height-body-m');
  const value = raw === '' ? undefined : probe.resolveNumber(raw);

  return value ?? DEFAULT_BODY_LINE_HEIGHT;
}

/**
 * Resolves raw CSS value expressions — including `calc()` — that
 * `getComputedStyle` leaves unevaluated on custom properties. Each raw value
 * is assigned to a standard property whose type matches it (a length via
 * `padding-left`, a number via `flex-grow`) on a hidden, off-layout element;
 * the browser evaluates it, and the resolved value is read back.
 */
interface SkyChartTokenProbe {
  /** Resolves a length expression to pixels, or `undefined` when invalid. */
  resolveLength(value: string): number | undefined;

  /** Resolves a numeric expression to a number, or `undefined` when invalid. */
  resolveNumber(value: string): number | undefined;

  /** Removes the probe element if it was created. */
  destroy(): void;
}

/**
 * Creates a {@link SkyChartTokenProbe} bound to `host`. The probe element is
 * created on first use — so resolving only fast-path values costs nothing —
 * and inherits `host`'s theme context.
 */
function createTokenProbe(host: HTMLElement): SkyChartTokenProbe {
  let element: HTMLElement | undefined;

  function probeElement(): HTMLElement {
    if (!element) {
      element = document.createElement('span');
      element.style.position = 'absolute';
      element.style.width = '0';
      element.style.height = '0';
      element.style.overflow = 'hidden';
      element.style.visibility = 'hidden';
      host.appendChild(element);
    }

    return element;
  }

  // Assigns the raw value to a carrier property the browser evaluates, then
  // reads the resolved value back. An invalid value is rejected by the CSSOM,
  // leaving the carrier empty, which signals it could not be resolved.
  function resolveWith(
    carrier: 'paddingLeft' | 'flexGrow',
    value: string,
  ): number | undefined {
    const el = probeElement();

    el.style[carrier] = '';
    el.style[carrier] = value;

    return el.style[carrier] === ''
      ? undefined
      : Number.parseFloat(getComputedStyle(el)[carrier]);
  }

  return {
    resolveLength: (value): number | undefined =>
      resolveWith('paddingLeft', value),
    resolveNumber: (value): number | undefined =>
      resolveWith('flexGrow', value),
    destroy: (): void => element?.remove(),
  };
}
