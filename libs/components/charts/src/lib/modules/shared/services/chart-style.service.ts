import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyAppWindowRef } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

/**
 * Service that provides chart styles derived from the current theme.
 */
@Injectable({ providedIn: 'root' })
export class SkyChartStyleService {
  readonly #skyAppWindowRef = inject(SkyAppWindowRef);
  readonly #document = inject(DOCUMENT);
  readonly #themeSvc = inject(SkyThemeService, { optional: true });

  readonly #themeVersion = signal(0);

  /**
   * Computed styles for charts that are derived from the current theme.
   * The styles are automatically recomputed when the theme changes, ensuring that charts stay up to date with the latest theme settings.
   */
  public readonly styles = computed<SkyChartStyles>(() => {
    // Recompute chart styles when the theme changes
    this.#themeVersion();

    return {
      series: this.#series(),
      fontFamily: this.#css(
        '--sky-font-family-primary',
        'Blackbaud Sans, Arial, sans-serif',
      ),
      chartPadding: 0,
      axis: this.#axis(),
      scale: this.#scale(),
      tooltip: this.#tooltip(),
      hoverIndicator: this.#hoverIndicator(),
      activeIndicator: this.#activeIndicator(),
      focusIndicator: this.#focusIndicator(),
      charts: {
        bar: this.#bar(),
        line: this.#line(),
        donut: this.#donut(),
      },
    };
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
      this.#css('--sky-theme-color-viz-category-1'),
      this.#css('--sky-theme-color-viz-category-2'),
      this.#css('--sky-theme-color-viz-category-3'),
      this.#css('--sky-theme-color-viz-category-4'),
      this.#css('--sky-theme-color-viz-category-5'),
      this.#css('--sky-theme-color-viz-category-6'),
      this.#css('--sky-theme-color-viz-category-7'),
      this.#css('--sky-theme-color-viz-category-8'),
    ];

    return colors;
  }

  #axis(): SkyChartStyles['axis'] {
    const border: SkyChartStyles['axis']['border'] = {
      color: this.#css('--sky-theme-color-viz-axis', '#85888d'),
      width: 1,
    };

    const grid: SkyChartStyles['axis']['grid'] = {
      color: '#d5d6d8', // Hardcoded to specific color instead of theme variable
      width: 1,
    };

    const ticks: SkyChartStyles['axis']['ticks'] = {
      color: this.#css('--sky-color-text-default', '#252b33'),
      fontSize: this.#cssRemToPx('--sky-font-size-body-s', '13px'),
      fontWeight: this.#cssNumber('--sky-font-style-body-s', '400'),
      paddingX: this.#cssRemToPx('--sky-space-gap-label-m', '0.5rem'),
      paddingY: this.#cssRemToPx('--sky-space-gap-label-m', '0.5rem'),
      lengthX: 12,
      lengthY: 12,
      lengthXHidden: 0,
      lengthYHidden: 0,
      length: 12,
    };

    return {
      border: border,
      grid: grid,
      ticks: ticks,
    };
  }

  #scale(): SkyChartStyles['scale'] {
    return {
      titleFontSize: this.#cssRemToPx('--sky-font-size-body-s', '13px'),
      titleFontFamily: 'BLKB Sans, Arial, sans-serif',
      titleColor: this.#css('--sky-text-color-deemphasized'),
      titlePaddingTop: 0,
      titleXPaddingTop: this.#cssRemToPx('--sky-space-stacked-0', '0px'),
      titleXPaddingBottom: this.#cssRemToPx('--sky-space-stacked-l', '16px'),
      titleYPaddingRight: this.#cssRemToPx('--sky-space-inline-0', '0px'),
      titleYPaddingLeft: this.#cssRemToPx('--sky-space-inline-l', '16px'),
    };
  }

  #tooltip(): SkyChartStyles['tooltip'] {
    const shadowVar = this.#css(
      '--sky-elevation-overlay-100',
      '0 0 5px 0 rgba(0, 0, 0, 0.3);',
    );
    const baseShadowColor =
      this.#extractShadowColor(shadowVar) || 'rgba(0, 0, 0, 0.15)';
    const tooltipShadowColor =
      this.#colorToRgbaWithAlpha(baseShadowColor, 0.6) || baseShadowColor;

    return {
      backgroundColor: this.#css(
        '--sky-color-background-container-base',
        '#ffffff',
      ),
      borderColor: this.#css('--sky-color-border-container-base', '#c2c4c6'),
      borderWidth: this.#cssInt('--sky-border-width-container-base', '1px'),
      titleColor: this.#css('--sky-color-text-default', '#252b33'),
      bodyColor: this.#css('--sky-color-text-default', '#252b33'),
      padding: this.#cssRemToPx('--sky-space-inset-balanced-m', '8px'),
      titleMarginBottom: this.#cssRemToPx('--sky-space-stacked-s', '8px'),
      bodySpacing: this.#cssRemToPx('--sky-space-stacked-xs', '4px'),
      caretSize: this.#cssRemToPx('--sky-size-icon-xxs', '8px'),
      titleFontSize: this.#cssRemToPx('--sky-font-size-body-m', '15px'),
      titleFontWeight: this.#cssNumber('--sky-font-style-emphasized', '600'),
      bodyFontSize: this.#cssRemToPx('--sky-font-size-body-m', '15px'),
      bodyFontWeight: this.#cssNumber('--sky-font-style-body-m', '400'),
      footerFontSize: this.#cssRemToPx('--sky-font-size-body-m', '15px'),
      footerFontWeight: this.#cssNumber('--sky-font-style-body-m', '400'),
      boxPadding: this.#cssRemToPx('--sky-space-gap-label-s', '4px'),
      shadowColor: tooltipShadowColor,
      cornerRadius: this.#cssRemToPx('--sky-border-radius-s', '4px'),
    };
  }

  #hoverIndicator(): SkyChartStyles['hoverIndicator'] {
    return {
      borderWidth: this.#cssRemToPx('--sky-border-width-action-hover', '1px'),
      borderColor: this.#css(
        '--sky-color-border-action-tertiary-hover',
        '#2b6bd5',
      ),
      backgroundColor: this.#css(
        '--sky-color-background-action-tertiary-hover',
        '#f4f8fd',
      ),
    };
  }

  #activeIndicator(): SkyChartStyles['activeIndicator'] {
    return {
      borderWidth: this.#cssRemToPx('--sky-border-width-action-active', '2px'),
      borderColor: this.#css(
        '--sky-color-border-action-tertiary-active',
        '#2b6bd5',
      ),
      backgroundColor: this.#css(
        '--sky-color-background-action-tertiary-active',
        '#eef3fc',
      ),
    };
  }

  #focusIndicator(): SkyChartStyles['focusIndicator'] {
    return {
      color: '#1c84ff', // TODO: Confirm with UX
      borderWidth: this.#cssRemToPx('--sky-border-width-action-focus', '2px'),
      borderColor: this.#css(
        '--sky-color-border-action-tertiary-focus',
        '#2b6bd5',
      ),
      backgroundColor: this.#css(
        '--sky-color-background-action-tertiary-focus',
        'rgba(0, 0, 0, 0)',
      ),
    };
  }

  #bar(): SkyChartStyles['charts']['bar'] {
    return {
      borderColor: this.#css(
        '--sky-color-background-container-base',
        '#ffffff',
      ),
      borderWidth: this.#cssRemToPx('--sky-border-width-default', '1px'),
      borderRadius: this.#cssRemToPx('--sky-border-radius-xs', '2px'),
    };
  }

  #line(): SkyChartStyles['charts']['line'] {
    // eslint-disable-next-line @cspell/spellchecker -- this icon size is valid in our design system
    const pointRadius = this.#cssRemToPx('--sky-size-icon-xxxs', '4px');

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
      borderColor: this.#css(
        '--sky-color-background-container-base',
        '#ffffff',
      ),
      borderWidth: this.#cssRemToPx('--sky-border-width-default', '1px'),
    };
  }

  // #region Private
  /**
   * Resolve a CSS custom property value with an optional fallback
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/var
   *
   * @param varName Required. The variable name (must start with two dashes)
   * @param cssFallback Optional. The fallback value (used if the variable is not found)
   * @returns The resolved CSS variable value, or the fallback if not found. Returns empty string if neither is found.
   */
  #css(varName: `--${string}`, cssFallback?: string): string {
    // Try to get from body first (where theme classes are typically applied)
    let value = this.#skyAppWindowRef.nativeWindow
      .getComputedStyle(this.#document.body)
      .getPropertyValue(varName)
      .trim();

    // Fallback to document element
    if (!value) {
      value = this.#skyAppWindowRef.nativeWindow
        .getComputedStyle(this.#document.documentElement)
        .getPropertyValue(varName)
        .trim();
    }

    if (value === '') {
      if (!cssFallback) {
        console.warn(
          `CSS custom property not found and default was not provided`,
          varName,
        );
        return '';
      } else {
        return cssFallback;
      }
    }

    return value;
  }

  /**
   * Resolves a CSS property that is expected to be in rem units and converts it to pixels.
   * @param varName
   * @param cssFallback
   * @remarks Chart.js requires pixel values, not rem units
   * @returns
   */
  #cssRemToPx(varName: `--${string}`, cssFallback?: string): number {
    const remValue = this.#css(varName, cssFallback);

    const remMatch = remValue.match(/([\d.]+)rem/);
    if (remMatch) {
      const rem = parseFloat(remMatch[1]);

      // get #root font size (typically 16px)
      const defaultFontSize = 16;
      const rootFontSize =
        parseFloat(
          this.#skyAppWindowRef.nativeWindow.getComputedStyle(
            this.#document.documentElement,
          ).fontSize,
        ) || defaultFontSize;

      return rem * rootFontSize;
    }

    // Try to parse as pixels
    return parseInt(remValue) || 0;
  }

  /**
   * Resolves a CSS property that is expected to be a number/float.
   * @param varName
   * @param cssFallback
   * @returns
   */
  #cssNumber(varName: `--${string}`, cssFallback?: string): number {
    const value = this.#css(varName, cssFallback);
    return Number(value);
  }

  /**
   * Resolves a CSS property that is expected to be an integer number.
   * @param varName
   * @param cssFallback
   * @returns
   */
  #cssInt(varName: `--${string}`, cssFallback?: string): number {
    const value = this.#css(varName, cssFallback);
    return parseInt(value) || 0;
  }

  /**
   * Convert rem values to pixels
   * Chart.js requires pixel values, not rem units
   */

  #extractShadowColor(shadowValue: string): string | null {
    const rgbaMatch = shadowValue.match(
      /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)/,
    );
    if (rgbaMatch) {
      return rgbaMatch[0];
    }

    const hexMatch = shadowValue.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})/);
    if (hexMatch) {
      return hexMatch[0];
    }

    return null;
  }

  #colorToRgbaWithAlpha(color: string, alpha: number): string | null {
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
    }

    const hexMatch = color.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (hexMatch) {
      const hex =
        hexMatch[1].length === 3
          ? hexMatch[1]
              .split('')
              .map((char) => char + char)
              .join('')
          : hexMatch[1];
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return null;
  }
  // #endregion
}

/** Defines the structure of chart styles */
export interface SkyChartStyles {
  series: string[];
  chartPadding: number;
  fontFamily: string;
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
      color: string;
      fontSize: number;
      fontWeight: number;
      paddingX: number;
      paddingY: number;
      lengthX: number;
      lengthY: number;
      lengthXHidden: number;
      lengthYHidden: number;
      length: number;
    };
  };
  scale: {
    titleFontSize: number;
    titleFontFamily: string;
    titleColor: string;
    titlePaddingTop: number;
    titleXPaddingTop: number;
    titleXPaddingBottom: number;
    titleYPaddingRight: number;
    titleYPaddingLeft: number;
  };
  tooltip: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    titleColor: string;
    bodyColor: string;
    padding: number;
    titleMarginBottom: number;
    bodySpacing: number;
    caretSize: number;
    titleFontSize: number;
    titleFontWeight: number;
    bodyFontSize: number;
    bodyFontWeight: number;
    footerFontSize: number;
    footerFontWeight: number;
    boxPadding: number;
    shadowColor: string;
    cornerRadius: number;
  };
  hoverIndicator: {
    borderWidth: number;
    borderColor: string;
    backgroundColor: string;
  };
  activeIndicator: {
    borderWidth: number;
    borderColor: string;
    backgroundColor: string;
  };
  focusIndicator: {
    color: string;
    borderWidth: number;
    borderColor: string;
    backgroundColor: string;
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
