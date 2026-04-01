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
      series: this.#series(),
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

  #series(): string[] {
    const colors = [
      this.#cssUtils.css('--sky-theme-color-viz-category-1'),
      this.#cssUtils.css('--sky-theme-color-viz-category-2'),
      this.#cssUtils.css('--sky-theme-color-viz-category-3'),
      this.#cssUtils.css('--sky-theme-color-viz-category-4'),
      this.#cssUtils.css('--sky-theme-color-viz-category-5'),
      this.#cssUtils.css('--sky-theme-color-viz-category-6'),
      this.#cssUtils.css('--sky-theme-color-viz-category-7'),
      this.#cssUtils.css('--sky-theme-color-viz-category-8'),
    ];

    return colors;
  }

  #axis(): SkyChartStyles['axis'] {
    const border: SkyChartStyles['axis']['border'] = {
      color: this.#cssUtils.css('--sky-color-viz-axis', '#85888d'),
      width: 1,
    };

    const grid: SkyChartStyles['axis']['grid'] = {
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
      '--sky-elevation-overlay-simple-100', // 1px 2px 4px 0 rgba(33, 44, 63, 0.5)
      '1px 2px 4px 0 rgba(33, 35, 39, 0.5)',
    );
    // prettier-ignore
    const baseShadowColor = this.#cssUtils.extractShadowColor(shadow) || 'rgba(0, 0, 0, 0.15)';
    // prettier-ignore
    const tooltipShadowColor = this.#cssUtils.colorToRgbaWithAlpha(baseShadowColor, 0.6) || baseShadowColor;

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
      padding: 2, // TODO: Confirm if there is a CSS Property we should use. Also 1 + Radius can feel cramped. Might want to increase to 2.
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
    };
  }

  #line(): SkyChartStyles['charts']['line'] {
    // eslint-disable-next-line @cspell/spellchecker -- this icon size is valid in our design system
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
  series: string[];
  fontFamily: string;
  chartPadding: number;
  axis: {
    border: {
      color: string;
      width: number;
    };
    grid: {
      color: string;
      width: number;
    };
    ticks: {
      fontSize: number;
      fontWeight: number;
      lineHeight: string;
      color: string;
      padding: number;
      measureLength: number;
      categoryLength: number;
    };
    title: {
      fontSize: number;
      fontWeight: number;
      lineHeight: string;
      color: string;
      paddingTop: number;
      paddingBottom: number;
    };
  };
  tooltip: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    cornerRadius: number;
    padding: { top: number; right: number; bottom: number; left: number };
    shadow: {
      color: string;
      blur: number;
      offsetX: number;
      offsetY: number;
    };
    caret: {
      padding: number;
      size: number;
    };
    box: {
      height: number;
      width: number;
      padding: number;
    };
    title: {
      fontSize: number;
      fontWeight: number;
      lineHeight: string;
      color: string;
      marginBottom: number;
    };
    body: {
      fontSize: number;
      fontWeight: number;
      lineHeight: string;
      color: string;
      bodySpacing: number;
    };
    footer: {
      fontSize: number;
      fontWeight: number;
      lineHeight: string;
      color: string;
      marginTop: number;
    };
  };
  indicator: {
    padding: number;
    borderRadius: number;
    hover: {
      borderWidth: number;
      borderColor: string;
      backgroundColor: string;
    };
    active: {
      borderWidth: number;
      borderColor: string;
      backgroundColor: string;
    };
    focus: {
      borderWidth: number;
      borderColor: string;
      backgroundColor: string;
    };
  };
  charts: {
    bar: {
      borderColor: string;
      borderWidth: number;
      borderRadius: number;
    };
    line: {
      tension: number;
      borderWidth: number;
      pointRadius: number;
      pointHoverRadius: number;
      pointBorderWidth: number;
    };
    donut: {
      borderColor: string;
      borderWidth: number;
    };
  };
}
