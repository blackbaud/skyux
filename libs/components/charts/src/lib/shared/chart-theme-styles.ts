/**
 * The resolved, themed styling for a chart, grouped by feature. Chart.js
 * renders to a canvas that cannot read CSS custom properties, so every SKY
 * theme token the library depends on is resolved here — and only here — to a
 * concrete value. This keeps the full set of tokens auditable in one place.
 *
 * When the SKY theme styles are not loaded, strings resolve to empty strings —
 * which Chart.js treats as unset, rendering with its own defaults — and numbers
 * to `NaN`. Every value otherwise has a default defined in the
 * `sky-default-overrides` mixin in `chart.scss`, which applies in every
 * non-modern context; the modern theme supplies the `--sky-*` tokens directly.
 * @internal
 */
export interface SkyChartThemeStyles {
  font: {
    family: string;
    size: number;
    weight: number;
    emphasizedWeight: number;
  };
  text: {
    color: string;
    deemphasizedColor: string;
    lineHeight: number;
  };
  height: {
    /** The minimum chart height, in pixels. */
    min: number;
    /** The maximum chart height, in pixels. */
    max: number;
    /**
     * The default chart height as a CSS `clamp()` expression, used by
     * orientations whose height is not computed from their content.
     */
    default: string;
  };
  axis: {
    lineColor: string;
    gridlineColor: string;
    tickLength: number;
    /**
     * The vertical gap between an axis title and its ticks.
     */
    titleGap: number;
  };
  series: {
    categoricalPalette: string[];
  };
  /**
   * The styling of the tooltip container and its contents.
   */
  tooltip: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    cornerRadius: number;
    inset: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    /**
     * The size of the color-swatch icon beside each tooltip line.
     */
    iconSize: number;
    /**
     * The gap between the color-swatch icon and its text.
     */
    iconGap: number;
    /**
     * The vertical gap between the tooltip title or footer and its body.
     */
    titleGap: number;
    /**
     * The vertical gap between tooltip body lines.
     */
    bodyGap: number;
  };
  bar: {
    borderColor: string;
    borderRadius: number;
    /** Bar-layout sizing for a vertical (column) chart, in pixels. */
    vertical: {
      baseBarThickness: number;
      minBarThickness: number;
      maxBarThickness: number;
    };
    /** Bar-layout sizing for a horizontal chart, in pixels. */
    horizontal: {
      minBarThickness: number;
      maxBarThickness: number;
      minCategoryGap: number;
    };
  };
}

/**
 * Resolves the active SKY theme's chart styling for the given host element.
 * When the SKY theme styles are not loaded, the chart renders un-themed with
 * Chart.js defaults.
 * @internal
 */
export function resolveChartThemeStyles(
  host: HTMLElement,
): SkyChartThemeStyles {
  const styles = getComputedStyle(host);

  // Custom properties keep `calc()` expressions unevaluated (for example, the
  // SKY line-height tokens are authored as `calc(20/15)`). The probe assigns
  // those raw values to a standard property, which the browser evaluates, and
  // reads the resolved value back. It is created lazily — only for values the
  // fast path cannot parse — and torn down once resolution finishes.
  const probe = createTokenProbe(host);

  // `rem` conversions share one root font-size read; see `remToPx`.
  const rootFontSize = Number.parseFloat(
    getComputedStyle(host.ownerDocument.documentElement).fontSize,
  );

  try {
    // The chart's height bounds are authored once, as custom properties on
    // the `sky-chart` host (see `chart.scss`), so the plot heights resolved
    // here always match the loading state's reserved height. Plots must
    // render inside `sky-chart` (enforced by `SkyChartPlot`), so the
    // properties are always in scope; like the theme tokens, they only fail
    // to resolve in a genuinely broken setup.
    const minHeight = readNumber(
      styles,
      probe,
      '--sky-chart-height-min',
      rootFontSize,
    );

    const maxHeight = readNumber(
      styles,
      probe,
      '--sky-chart-height-max',
      rootFontSize,
    );

    const viewportHeight = readString(styles, '--sky-chart-height-viewport');

    return {
      font: {
        family: readString(styles, '--sky-font-family-primary'),
        size: readNumber(styles, probe, '--sky-font-size-body-s', rootFontSize),
        weight: readNumber(
          styles,
          probe,
          '--sky-font-style-body-s',
          rootFontSize,
        ),
        emphasizedWeight: readNumber(
          styles,
          probe,
          '--sky-font-style-emphasized',
          rootFontSize,
        ),
      },
      text: {
        color: readString(styles, '--sky-color-text-default'),
        deemphasizedColor: readString(styles, '--sky-color-text-deemphasized'),
        lineHeight: readLineHeight(styles, probe),
      },
      height: {
        min: minHeight,
        max: maxHeight,
        default: `clamp(${minHeight}px, ${viewportHeight}, ${maxHeight}px)`,
      },
      axis: {
        lineColor: readString(styles, '--sky-color-viz-axis'),
        gridlineColor: readString(styles, '--sky-color-viz-gridline'),
        tickLength: readNumber(
          styles,
          probe,
          '--sky-size-chart-tick_length-measure',
          rootFontSize,
        ),
        titleGap: readNumber(
          styles,
          probe,
          '--sky-space-stacked-xs',
          rootFontSize,
        ),
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
          rootFontSize,
        ),
        cornerRadius: readNumber(
          styles,
          probe,
          '--sky-border-radius-s',
          rootFontSize,
        ),
        inset: {
          top: readNumber(
            styles,
            probe,
            '--sky-comp-chart-tooltip-space-inset-top',
            rootFontSize,
          ),
          right: readNumber(
            styles,
            probe,
            '--sky-comp-chart-tooltip-space-inset-right',
            rootFontSize,
          ),
          bottom: readNumber(
            styles,
            probe,
            '--sky-comp-chart-tooltip-space-inset-bottom',
            rootFontSize,
          ),
          left: readNumber(
            styles,
            probe,
            '--sky-comp-chart-tooltip-space-inset-left',
            rootFontSize,
          ),
        },
        iconSize: readNumber(styles, probe, '--sky-size-icon-xs', rootFontSize),
        iconGap: readNumber(
          styles,
          probe,
          '--sky-space-gap-icon-s',
          rootFontSize,
        ),
        titleGap: readNumber(
          styles,
          probe,
          '--sky-space-stacked-s',
          rootFontSize,
        ),
        bodyGap: readNumber(
          styles,
          probe,
          '--sky-space-stacked-0',
          rootFontSize,
        ),
      },
      bar: {
        borderColor: readString(
          styles,
          '--sky-color-background-container-base',
        ),
        borderRadius: readNumber(
          styles,
          probe,
          '--sky-border-radius-xs',
          rootFontSize,
        ),
        vertical: {
          baseBarThickness: remToPx('2rem', rootFontSize),
          minBarThickness: remToPx('0.75rem', rootFontSize),
          maxBarThickness: remToPx('7.5rem', rootFontSize),
        },
        horizontal: {
          minBarThickness: remToPx('0.75rem', rootFontSize),
          maxBarThickness: remToPx('1rem', rootFontSize),
          minCategoryGap: remToPx('0.5rem', rootFontSize),
        },
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
 * Chart.js renders un-themed rather than broken.
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
 * resolved through the probe. Every token has a default defined in the
 * `sky-default-overrides` mixin in `chart.scss`, so a value only fails to
 * resolve — returning `NaN` — in a genuinely broken theme.
 */
function readNumber(
  styles: CSSStyleDeclaration,
  probe: SkyChartTokenProbe,
  property: string,
  rootFontSize: number,
): number {
  const raw = readString(styles, property);

  if (raw === '') {
    return Number.NaN;
  }

  const value = Number.parseFloat(raw);

  if (!Number.isNaN(value)) {
    return raw.endsWith('rem') ? remToPx(raw, rootFontSize) : value;
  }

  // A non-numeric literal such as a `calc()` length; resolve it via the probe.
  return probe.resolveLength(raw) ?? Number.NaN;
}

/**
 * Converts a `rem` length to pixels using the document root font size. `rem` is
 * defined relative to the root element (never the host), so the root font size
 * is the correct reference — resolved once per `resolveChartThemeStyles` call
 * and shared by every conversion. Chart.js reasons in pixels when it lays out
 * a canvas, so `rem`-based sizing has to be resolved before it reaches the
 * chart.
 */
function remToPx(rem: string, rootFontSize: number): number {
  return Number.parseFloat(rem) * rootFontSize;
}

/**
 * Reads the body-s line height as a multiple of the font size. A plain
 * numeric value (such as the default theme's override) parses directly; the
 * modern theme's token is a `calc()` expression that `getComputedStyle`
 * leaves unevaluated on custom properties, so it is resolved through the
 * probe. Its default is defined in the `sky-default-overrides` mixin in
 * `chart.scss`, so it only fails to resolve — returning `NaN` — in a
 * genuinely broken theme.
 */
function readLineHeight(
  styles: CSSStyleDeclaration,
  probe: SkyChartTokenProbe,
): number {
  const raw = readString(styles, '--sky-font-line_height-body-s');

  if (raw === '') {
    return Number.NaN;
  }

  const value = Number.parseFloat(raw);

  if (!Number.isNaN(value)) {
    return value;
  }

  // A non-numeric expression such as `calc(20/15)`; resolve it via the probe.
  return probe.resolveNumber(raw) ?? Number.NaN;
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
