import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyThemeService } from '@skyux/theme';

import { SkyChartCssUtilsService } from './chart-css-utils.service';

/**
 * Service that provides chart styles derived from the current theme.
 */
@Injectable({ providedIn: 'root' })
export class SkyChartStyleService {
  readonly #cssUtils = inject(SkyChartCssUtilsService);
  readonly #themeSvc = inject(SkyThemeService, { optional: true });

  readonly #themeVersion = signal(0);

  /**
   * Computed styles for charts that are derived from the current theme.
   * The styles are automatically recomputed when the theme changes, ensuring that charts stay up to date with the latest theme settings.
   */
  public readonly styles = computed<SkyChartStyles>(() => {
    // Recompute chart styles when the theme changes
    this.#themeVersion();

    const styles: SkyChartStyles = {
      palettes: this.#palettes(),
      height: this.#height(),
      fontFamily: this.#cssUtils.css(
        '--sky-font-family-primary',
        'Blackbaud Sans, Arial, sans-serif',
      ),
      chartPadding: 0,
      axis: this.#axis(),
      tooltip: this.#tooltip(),
      indicator: this.#indicator(),
      charts: {
        bar: this.#bar(),
        line: this.#line(),
        donut: this.#donut(),
      },
    };

    return styles;
  });

  constructor() {
    /* istanbul ignore else */
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.#themeVersion.update((v) => v + 1));
    }
  }

  #palettes(): SkyChartStyles['palettes'] {
    const categorical = [
      this.#cssUtils.css('--sky-theme-color-viz-category-1'),
      this.#cssUtils.css('--sky-theme-color-viz-category-2'),
      this.#cssUtils.css('--sky-theme-color-viz-category-3'),
      this.#cssUtils.css('--sky-theme-color-viz-category-4'),
      this.#cssUtils.css('--sky-theme-color-viz-category-5'),
      this.#cssUtils.css('--sky-theme-color-viz-category-6'),
      this.#cssUtils.css('--sky-theme-color-viz-category-7'),
      this.#cssUtils.css('--sky-theme-color-viz-category-8'),
    ];

    const sequential = [
      this.#cssUtils.css('--sky-theme-color-viz-sequence-1'),
      this.#cssUtils.css('--sky-theme-color-viz-sequence-2'),
      this.#cssUtils.css('--sky-theme-color-viz-sequence-3'),
      this.#cssUtils.css('--sky-theme-color-viz-sequence-4'),
      this.#cssUtils.css('--sky-theme-color-viz-sequence-5'),
      this.#cssUtils.css('--sky-theme-color-viz-sequence-6'),
      this.#cssUtils.css('--sky-theme-color-viz-sequence-7'),
      this.#cssUtils.css('--sky-theme-color-viz-sequence-8'),
      this.#cssUtils.css('--sky-theme-color-viz-sequence-9'),
      this.#cssUtils.css('--sky-theme-color-viz-sequence-10'),
    ];

    const positiveDiverging = [
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-1'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-2'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-3'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-4'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-5'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-6'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-7'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-8'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-9'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-pos-10'),
    ];

    const negativeDiverging = [
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-1'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-2'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-3'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-4'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-5'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-6'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-7'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-8'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-9'),
      this.#cssUtils.css('--sky-theme-color-viz-diverge-neg-10'),
    ];

    return {
      categorical,
      sequential,
      positiveDiverging,
      negativeDiverging,
    };
  }

  #height(): SkyChartStyles['height'] {
    const min = '11.25rem';
    const max = '25rem';

    return {
      min: this.#cssUtils.remToPx(min),
      max: this.#cssUtils.remToPx(max),
      default: `clamp(${min}, 28vh, ${max})`,
    };
  }

  #axis(): SkyChartStyles['axis'] {
    const border: SkyChartStyles['axis']['border'] = {
      color: this.#cssUtils.css('--sky-color-viz-axis', '#85888d'),
      width: 1,
    };

    const grid: SkyChartStyles['axis']['grid'] = {
      // eslint-disable-next-line @cspell/spellchecker
      color: this.#cssUtils.css('--sky-color-viz-gridline', '#d5d6d8'),
      width: 1,
    };

    const lineHeight = this.#cssUtils.cssMeasured(
      '--sky-font-line_height-body-s',
      '18px',
      'line-height',
    );

    const ticks: SkyChartStyles['axis']['ticks'] = {
      fontSize: this.#cssUtils.cssNumber('--sky-font-size-body-s', '13px'),
      fontWeight: this.#cssUtils.cssNumber('--sky-font-style-body-s', '400'),
      lineHeight: lineHeight,
      color: this.#cssUtils.css('--sky-color-text-default', '#252b33'),
      padding: this.#cssUtils.cssNumber('--sky-space-gap-label-s', '5px'),
      measureLength: this.#cssUtils.cssNumber(
        '--sky-size-chart-tick_length-measure',
        '12px',
      ),
      categoryLength: this.#cssUtils.cssNumber(
        '--sky-size-chart-tick_length-category',
        '0px',
      ),
    };

    const title: SkyChartStyles['axis']['title'] = {
      fontSize: this.#cssUtils.cssNumber('--sky-font-size-body-s', '13px'),
      fontWeight: this.#cssUtils.cssNumber('--sky-font-style-body-s', '400'),
      lineHeight: lineHeight,
      color: this.#cssUtils.css('--sky-text-color-deemphasized', '#686C73'),
      paddingTop: this.#cssUtils.cssNumber('--sky-space-stacked-xs', '5px'),
      paddingBottom: this.#cssUtils.cssNumber('--sky-space-stacked-xs', '5px'),
    };

    return {
      border: border,
      grid: grid,
      ticks: ticks,
      title: title,
    };
  }

  #tooltip(): SkyChartStyles['tooltip'] {
    const shadow = this.#cssUtils.css(
      '--sky-elevation-overlay-simple-100',
      '1px 2px 4px 0 rgba(33, 35, 39, 0.5)',
    );
    const baseShadowColor =
      this.#cssUtils.extractShadowColor(shadow) || 'rgba(0, 0, 0, 0.15)';
    const tooltipShadowColor =
      this.#cssUtils.colorToRgbaWithAlpha(baseShadowColor, 0.6) ||
      baseShadowColor;

    const lineHeight = this.#cssUtils.cssMeasured(
      '--sky-font-line_height-body-m',
      '20px',
      'line-height',
    );

    const tooltip = {
      backgroundColor: this.#cssUtils.css(
        '--sky-color-background-container-base',
        '#ffffff',
      ),
      borderColor: this.#cssUtils.css(
        '--sky-color-border-container-base',
        '#cdcfd2',
      ),
      borderWidth: this.#cssUtils.cssNumber(
        '--sky-border-width-container-base',
        '1px',
      ),
      cornerRadius: this.#cssUtils.cssNumber('--sky-border-radius-s', '3px'),
      padding: {
        top: this.#cssUtils.cssNumber(
          '--sky-comp-chart-tooltip-space-inset-top',
          '8px',
        ),
        right: this.#cssUtils.cssNumber(
          '--sky-comp-chart-tooltip-space-inset-right',
          '8px',
        ),
        bottom: this.#cssUtils.cssNumber(
          '--sky-comp-chart-tooltip-space-inset-bottom',
          '8px',
        ),
        left: this.#cssUtils.cssNumber(
          '--sky-comp-chart-tooltip-space-inset-left',
          '8px',
        ),
      },
      shadow: {
        color: tooltipShadowColor,
        blur: 4,
        offsetX: 1,
        offsetY: 2,
      },
      caret: {
        size: 8,
        padding: 4,
      },
      box: {
        height: this.#cssUtils.cssNumber('--sky-size-icon-xs', '12px'),
        width: this.#cssUtils.cssNumber('--sky-size-icon-xs', '12px'),
        padding: this.#cssUtils.cssNumber('--sky-space-gap-icon-s', '4px'),
      },
      title: {
        fontSize: this.#cssUtils.cssNumber('--sky-font-size-body-m', '15px'),
        fontWeight: this.#cssUtils.cssNumber(
          '--sky-font-style-emphasized',
          '600',
        ),
        lineHeight: lineHeight,
        color: this.#cssUtils.css('--sky-color-text-default', '#212327'),
        marginBottom: this.#cssUtils.cssNumber('--sky-space-stacked-s', '5px'),
      },
      body: {
        fontSize: this.#cssUtils.cssNumber('--sky-font-size-body-m', '15px'),
        fontWeight: this.#cssUtils.cssNumber('--sky-font-style-body-m', '400'),
        lineHeight: lineHeight,
        color: this.#cssUtils.css('--sky-color-text-default', '#212327'),
        bodySpacing: this.#cssUtils.cssNumber('--sky-space-stacked-0', '0'),
      },
      footer: {
        fontSize: this.#cssUtils.cssNumber('--sky-font-size-body-m', '15px'),
        fontWeight: this.#cssUtils.cssNumber('--sky-font-style-body-m', '400'),
        lineHeight: lineHeight,
        color: this.#cssUtils.css('--sky-color-text-default', '#212327'),
        marginTop: this.#cssUtils.cssNumber('--sky-space-stacked-s', '5px'),
      },
    };

    return tooltip;
  }

  #indicator(): SkyChartStyles['indicator'] {
    return {
      padding: 2,
      borderRadius: this.#cssUtils.cssNumber('--sky-border-radius-s', '3px'),
      hover: this.#hoverIndicator(),
      active: this.#activeIndicator(),
      focus: this.#focusIndicator(),
    };
  }

  #hoverIndicator(): SkyChartStyles['indicator']['hover'] {
    return {
      borderWidth: this.#cssUtils.cssNumber(
        '--sky-border-width-action-hover',
        '1px',
      ),
      borderColor: this.#cssUtils.css(
        '--sky-color-border-action-tertiary-hover',
        '#0974A1',
      ),
      backgroundColor: this.#cssUtils.css(
        '--sky-color-background-action-tertiary-hover',
        '#eeeeef',
      ),
    };
  }

  #activeIndicator(): SkyChartStyles['indicator']['active'] {
    return {
      borderWidth: this.#cssUtils.cssNumber(
        '--sky-border-width-action-active',
        '2px',
      ),
      borderColor: this.#cssUtils.css(
        '--sky-color-border-action-tertiary-active',
        '#0974A1',
      ),
      backgroundColor: this.#cssUtils.css(
        '--sky-color-background-action-tertiary-active',
        '#eeeeef',
      ),
    };
  }

  #focusIndicator(): SkyChartStyles['indicator']['focus'] {
    return {
      borderWidth: this.#cssUtils.cssNumber(
        '--sky-border-width-action-focus',
        '2px',
      ),
      borderColor: this.#cssUtils.css(
        '--sky-color-border-action-tertiary-focus',
        '#0974A1',
      ),
      backgroundColor: this.#cssUtils.css(
        '--sky-color-background-action-tertiary-focus',
        '#eeeeef',
      ),
    };
  }

  #bar(): SkyChartStyles['charts']['bar'] {
    return {
      borderColor: this.#cssUtils.css(
        '--sky-color-background-container-base',
        '#ffffff',
      ),
      borderWidth: 1,
      borderRadius: this.#cssUtils.cssNumber('--sky-border-radius-xs', '2px'),
      vertical: {
        maxBarThickness: this.#cssUtils.remToPx('7.5rem'),
      },
      horizontal: {
        minBarThickness: this.#cssUtils.remToPx('0.75rem'),
        maxBarThickness: this.#cssUtils.remToPx('1rem'),
        minCategoryGap: this.#cssUtils.remToPx('0.5rem'),
      },
    };
  }

  #line(): SkyChartStyles['charts']['line'] {
    // eslint-disable-next-line @cspell/spellchecker
    const pointRadius = this.#cssUtils.cssNumber('--sky-size-icon-xxxs', '4px');

    return {
      tension: 0.2, // Slight curve for smooth lines
      borderWidth: 2,
      pointRadius: pointRadius,
      pointHoverRadius: pointRadius + 2, // Slightly larger on hover,
      pointBorderWidth: 2,
    };
  }

  #donut(): SkyChartStyles['charts']['donut'] {
    return {
      borderColor: this.#cssUtils.css(
        '--sky-color-background-container-base',
        '#ffffff',
      ),
      borderWidth: this.#cssUtils.cssNumber(
        '--sky-border-width-default',
        '1px',
      ),
    };
  }
}

/** Defines the structure of chart styles */
export interface SkyChartStyles {
  /** Color palettes for charts. */
  palettes: {
    /** Use the categorical palette to differentiate categories and data. */
    categorical: string[];
    /** Use the sequential palette to indicate different magnitudes within a range. */
    sequential: string[];
    /** Use the positive diverging palette to indicate positive values that diverge from a critical midpoint. */
    positiveDiverging: string[];
    /** Use the negative diverging palette to indicate negative values that diverge from a critical midpoint. */
    negativeDiverging: string[];
  };
  /** Height constraints for charts. */
  height: {
    /** The minimum height for charts in pixels. */
    min: number;
    /** The maximum height for charts in pixels. */
    max: number;
    /** The default CSS height value for charts. */
    default: string;
  };
  /** The font family applied to all chart text. */
  fontFamily: string;
  /** The inner padding applied around all chart content. */
  chartPadding: number;
  /** Styles for chart axes. */
  axis: {
    /** Styles for axis border lines. */
    border: {
      /** The CSS color of the axis border. */
      color: string;
      /** The pixel width of the axis border. */
      width: number;
    };
    /** Styles for the chart grid lines. */
    grid: {
      /** The CSS color of the grid lines. */
      color: string;
      /** The pixel width of the grid lines. */
      width: number;
    };
    /** Styles for axis tick labels. */
    ticks: {
      /** The font size in pixels for tick labels. */
      fontSize: number;
      /** The font weight for tick labels. */
      fontWeight: number;
      /** The line height for tick labels. */
      lineHeight: string;
      /** The CSS color of tick label text. */
      color: string;
      /** The spacing in pixels between tick marks and their labels. */
      padding: number;
      /** The pixel length of measure (value) axis tick marks. */
      measureLength: number;
      /** The pixel length of category axis tick marks. */
      categoryLength: number;
    };
    /** Styles for axis title labels. */
    title: {
      /** The font size in pixels for axis titles. */
      fontSize: number;
      /** The font weight for axis titles. */
      fontWeight: number;
      /** The line height for axis titles. */
      lineHeight: string;
      /** The CSS color of axis title text. */
      color: string;
      /** The top padding in pixels above the axis title. */
      paddingTop: number;
      /** The bottom padding in pixels below the axis title. */
      paddingBottom: number;
    };
  };
  /** Styles for chart tooltips. */
  tooltip: {
    /** The CSS background color of the tooltip. */
    backgroundColor: string;
    /** The CSS border color of the tooltip. */
    borderColor: string;
    /** The pixel width of the tooltip border. */
    borderWidth: number;
    /** The corner radius in pixels of the tooltip. */
    cornerRadius: number;
    /** The inner padding of the tooltip in pixels. */
    padding: { top: number; right: number; bottom: number; left: number };
    /** The drop shadow applied to the tooltip. */
    shadow: {
      /** The CSS color of the shadow. */
      color: string;
      /** The shadow blur radius in pixels. */
      blur: number;
      /** The horizontal shadow offset in pixels. */
      offsetX: number;
      /** The vertical shadow offset in pixels. */
      offsetY: number;
    };
    /** Styles for the tooltip pointer caret. */
    caret: {
      /** The spacing in pixels between the caret and the tooltip edge. */
      padding: number;
      /** The size of the caret in pixels. */
      size: number;
    };
    /** Styles for the color swatch box shown next to each dataset label. */
    box: {
      /** The height of the color swatch in pixels. */
      height: number;
      /** The width of the color swatch in pixels. */
      width: number;
      /** The spacing in pixels between the color swatch and the label text. */
      padding: number;
    };
    /** Styles for the tooltip title section. */
    title: {
      /** The font size in pixels for the tooltip title. */
      fontSize: number;
      /** The font weight for the tooltip title. */
      fontWeight: number;
      /** The line height for the tooltip title. */
      lineHeight: string;
      /** The CSS color of the tooltip title text. */
      color: string;
      /** The bottom margin in pixels below the title. */
      marginBottom: number;
    };
    /** Styles for the tooltip body section. */
    body: {
      /** The font size in pixels for tooltip body text. */
      fontSize: number;
      /** The font weight for tooltip body text. */
      fontWeight: number;
      /** The line height for tooltip body text. */
      lineHeight: string;
      /** The CSS color of tooltip body text. */
      color: string;
      /** The vertical spacing in pixels between body lines. */
      bodySpacing: number;
    };
    /** Styles for the tooltip footer section. */
    footer: {
      /** The font size in pixels for the tooltip footer. */
      fontSize: number;
      /** The font weight for the tooltip footer. */
      fontWeight: number;
      /** The line height for the tooltip footer. */
      lineHeight: string;
      /** The CSS color of tooltip footer text. */
      color: string;
      /** The top margin in pixels above the footer. */
      marginTop: number;
    };
  };
  /** Styles for the focus/hover/active indicator drawn around chart elements. */
  indicator: {
    /** The inner spacing in pixels between the indicator border and the element it surrounds. */
    padding: number;
    /** The corner radius in pixels of the indicator border box. */
    borderRadius: number;
    /** Indicator styles applied on hover. */
    hover: SkyChartIndicatorStateStyles;
    /** Indicator styles applied when an element is active (pressed). */
    active: SkyChartIndicatorStateStyles;
    /** Indicator styles applied when an element has keyboard focus. */
    focus: SkyChartIndicatorStateStyles;
  };
  /** Styles specific to each chart type. */
  charts: {
    /** Styles for bar charts. */
    bar: {
      /** The CSS color of the bar border. */
      borderColor: string;
      /** The pixel width of the bar border. */
      borderWidth: number;
      /** The corner radius in pixels of each bar. */
      borderRadius: number;
      /** Styles specific to vertical bar charts. */
      vertical: {
        /** The maximum bar thickness in pixels for vertical bar charts. */
        maxBarThickness: number;
      };
      /** Styles specific to horizontal bar charts. */
      horizontal: {
        /** The minimum gap in pixels between category groups. */
        minCategoryGap: number;
        /** The minimum bar thickness in pixels for horizontal bar charts. */
        minBarThickness: number;
        /** The maximum bar thickness in pixels for horizontal bar charts. */
        maxBarThickness: number;
      };
    };
    /** Styles for line charts. */
    line: {
      /** The Bezier tension applied to line segments (0 = straight, 1 = maximum curve). */
      tension: number;
      /** The pixel width of the line stroke. */
      borderWidth: number;
      /** The radius in pixels of data point markers. */
      pointRadius: number;
      /** The radius in pixels of data point markers on hover. */
      pointHoverRadius: number;
      /** The pixel width of the data point marker border. */
      pointBorderWidth: number;
    };
    /** Styles for donut charts. */
    donut: {
      /** The CSS color of the slice border. */
      borderColor: string;
      /** The pixel width of the slice border. */
      borderWidth: number;
    };
  };
}

/** Visual styles applied to an indicator in an interaction state (hover, active, or focus).*/
export interface SkyChartIndicatorStateStyles {
  /** The pixel width of the indicator border. */
  borderWidth: number;
  /** The CSS color of the indicator border. */
  borderColor: string;
  /** The CSS background color of the indicator. */
  backgroundColor: string;
}
