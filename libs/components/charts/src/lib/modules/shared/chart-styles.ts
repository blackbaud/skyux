/**
 * SKY UX Chart Styles and Design Tokens
 * Provides runtime-resolved design system values for charts including colors,
 * typography, spacing, and other visual properties.
 * All values are resolved from CSS custom properties at runtime for proper theme support.
 */
export const SkyuxChartStyles = {
  // =============================================================================
  // CHART SERIES COLORS
  // =============================================================================
  /**
   * Chart series colors for multi-series charts
   */
  get series(): string[] {
    const colors = [
      resolveCssVariable('--sky-theme-color-viz-category-1'),
      resolveCssVariable('--sky-theme-color-viz-category-2'),
      resolveCssVariable('--sky-theme-color-viz-category-3'),
      resolveCssVariable('--sky-theme-color-viz-category-4'),
      resolveCssVariable('--sky-theme-color-viz-category-5'),
      resolveCssVariable('--sky-theme-color-viz-category-6'),
      resolveCssVariable('--sky-theme-color-viz-category-7'),
      resolveCssVariable('--sky-theme-color-viz-category-8'),
    ];

    return colors;
  },

  // =============================================================================
  // AXIS (X/Y AXES)
  // =============================================================================

  get axisLineColor(): string {
    const color = resolveCssVariable('--sky-theme-color-viz-axis', '#85888d');
    return color;
  },

  get axisGridLineColor(): string {
    // Hardcoded to specific color instead of theme variable
    return '#d5d6d8';
  },

  get axisTickColor(): string {
    const color = resolveCssVariable('--sky-color-text-default', '#252b33');
    return color;
  },

  get axisTickFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-s', '13px');
    return remToPixels(size);
  },

  get axisTickFontWeight(): number {
    const weight = resolveCssVariable('--sky-font-style-body-s', '400');
    return Number(weight);
  },

  get axisTickPaddingX(): number {
    const space = resolveCssVariable('--sky-space-gap-label-m', '0.5rem');
    return remToPixels(space);
  },

  get axisTickPaddingY(): number {
    const space = resolveCssVariable('--sky-space-gap-label-m', '0.5rem');
    return remToPixels(space);
  },

  get axisTickLengthX(): number {
    return 12;
  },

  get axisTickLengthY(): number {
    return 12;
  },

  get axisTickLengthXHidden(): number {
    return 0;
  },

  get axisTickLengthYHidden(): number {
    return 0;
  },

  get axisTickLength(): number {
    return 12;
  },

  // =============================================================================
  // SCALE TITLES (Axis Labels)
  // =============================================================================

  get scaleTitleFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-s', '13px');
    return remToPixels(size);
  },

  get scaleTitleFontFamily(): string {
    return 'BLKB Sans, Arial, sans-serif';
  },

  get scaleTitleColor(): string {
    const color = resolveCssVariable('--sky-text-color-deemphasized');
    return color;
  },

  get scaleTitlePaddingTop(): number {
    return 0;
  },

  // X-axis title padding (top and bottom)
  get scaleXTitlePaddingTop(): number {
    const space = resolveCssVariable('--sky-space-stacked-0', '0px');
    return remToPixels(space);
  },

  get scaleXTitlePaddingBottom(): number {
    const space = resolveCssVariable('--sky-space-stacked-l', '16px');
    return remToPixels(space);
  },

  // Y-axis title padding (right and left)
  get scaleYTitlePaddingRight(): number {
    const space = resolveCssVariable('--sky-space-inline-0', '0px');
    return remToPixels(space);
  },

  get scaleYTitlePaddingLeft(): number {
    const space = resolveCssVariable('--sky-space-inline-l', '16px');
    return remToPixels(space);
  },

  // =============================================================================
  // BAR/CHART ELEMENTS
  // =============================================================================

  get barBorderColor(): string {
    const color = resolveCssVariable(
      '--sky-color-background-container-base',
      '#ffffff',
    );
    return color;
  },

  get barBorderWidth(): number {
    const width = resolveCssVariable('--sky-border-width-default', '1px');
    return remToPixels(width);
  },

  get barBorderRadius(): number {
    const radius = resolveCssVariable('--sky-border-radius-xs', '2px');
    return remToPixels(radius);
  },

  // =============================================================================
  // LINE CHART ELEMENTS
  // =============================================================================

  get lineTension(): number {
    return 0.2; // Slight curve for smooth lines
  },

  get lineBorderWidth(): number {
    return 2;
  },

  get linePointRadius(): number {
    const size = resolveCssVariable('--sky-size-icon-xxxs', '4px');
    const pixels = remToPixels(size);
    return pixels;
  },

  get linePointHoverRadius(): number {
    return this.linePointRadius + 2; // Slightly larger on hover
  },

  get linePointBorderWidth(): number {
    return 2;
  },

  // =============================================================================
  // TOOLTIP
  // =============================================================================

  get tooltipBackgroundColor(): string {
    const color = resolveCssVariable(
      '--sky-color-background-container-base',
      '#ffffff',
    );
    return color;
  },

  get tooltipBorderColor(): string {
    const color = resolveCssVariable(
      '--sky-color-border-container-base',
      '#c2c4c6',
    );
    return color;
  },

  get tooltipBorderWidth(): number {
    const width = resolveCssVariable(
      '--sky-border-width-container-base',
      '1px',
    );
    const numWidth = parseInt(width);
    return numWidth;
  },

  get tooltipTitleColor(): string {
    const color = resolveCssVariable('--sky-color-text-default', '#252b33');
    return color;
  },

  get tooltipBodyColor(): string {
    const color = resolveCssVariable('--sky-color-text-default', '#252b33');
    return color;
  },

  get tooltipPadding(): number {
    const space = resolveCssVariable('--sky-space-inset-balanced-m', '8px');
    return remToPixels(space);
  },

  get tooltipTitleMarginBottom(): number {
    const space = resolveCssVariable('--sky-space-stacked-s', '8px');
    return remToPixels(space);
  },

  get tooltipBodySpacing(): number {
    const space = resolveCssVariable('--sky-space-stacked-xs', '4px');
    return remToPixels(space);
  },

  get tooltipCaretSize(): number {
    const size = resolveCssVariable('--sky-size-icon-xxs', '8px');
    return remToPixels(size);
  },

  get tooltipTitleFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-m', '15px');
    return remToPixels(size);
  },

  get tooltipTitleFontWeight(): number {
    const weight = resolveCssVariable('--sky-font-style-emphasized', '600');
    return Number(weight);
  },

  get tooltipBodyFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-m', '15px');
    return remToPixels(size);
  },

  get tooltipBodyFontWeight(): number {
    const weight = resolveCssVariable('--sky-font-style-body-m', '400');
    return Number(weight);
  },

  get tooltipFooterFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-m', '15px');
    return remToPixels(size);
  },

  get tooltipFooterFontWeight(): number {
    const weight = resolveCssVariable('--sky-font-style-body-m', '400');
    return Number(weight);
  },

  get tooltipBoxPadding(): number {
    const space = resolveCssVariable('--sky-space-gap-label-s', '4px');
    return remToPixels(space);
  },

  get tooltipShadowColor(): string {
    const shadowVar = resolveCssVariable(
      '--sky-elevation-overlay-100',
      '0 0 5px 0 rgba(0, 0, 0, 0.3);',
    );
    const baseShadowColor =
      extractShadowColor(shadowVar) || 'rgba(0, 0, 0, 0.15)';
    const overrideColor =
      colorToRgbaWithAlpha(baseShadowColor, 0.6) || baseShadowColor;

    return overrideColor;
  },

  get tooltipCornerRadius(): number {
    const space = resolveCssVariable('--sky-border-radius-s', '4px');
    return remToPixels(space);
  },

  // =============================================================================
  // SHARED/GENERAL
  // =============================================================================

  get fontFamily(): string {
    const family = resolveCssVariable(
      '--sky-font-family-primary',
      'Blackbaud Sans, Arial, sans-serif',
    );
    return family;
  },

  get markerColor(): string {
    const color = resolveCssVariable('--sky-theme-color-viz-marker', '#252b33');
    return color;
  },

  // =============================================================================
  // LAYOUT/CHART PADDING
  // =============================================================================

  get chartPadding(): number {
    const space = resolveCssVariable('--sky-space-inset-balanced-none', '4px');
    return remToPixels(space);
  },

  get focusIndicatorColor(): string {
    // TODO: Confirm from UX

    return '#1c84ff';
  },

  get hoverIndicatorBorderWidth(): number {
    const width = resolveCssVariable('--sky-border-width-action-hover', '1px');
    return remToPixels(width);
  },

  get hoverIndicatorBorderColor(): string {
    const color = resolveCssVariable(
      '--sky-color-border-action-tertiary-hover',
      '#2b6bd5',
    );
    return color;
  },

  get hoverIndicatorBackgroundColor(): string {
    const color = resolveCssVariable(
      '--sky-color-background-action-tertiary-hover',
      '#f4f8fd',
    );
    return color;
  },

  get activeIndicatorBorderWidth(): number {
    const width = resolveCssVariable('--sky-border-width-action-active', '2px');
    return remToPixels(width);
  },

  get activeIndicatorBorderColor(): string {
    const color = resolveCssVariable(
      '--sky-color-border-action-tertiary-active',
      '#2b6bd5',
    );
    return color;
  },

  get activeIndicatorBackgroundColor(): string {
    const color = resolveCssVariable(
      '--sky-color-background-action-tertiary-active',
      '#eef3fc',
    );
    return color;
  },

  get focusIndicatorBorderWidth(): number {
    const width = resolveCssVariable('--sky-border-width-action-focus', '2px');
    return remToPixels(width);
  },

  get focusIndicatorBorderColor(): string {
    const color = resolveCssVariable(
      '--sky-color-border-action-tertiary-focus',
      '#2b6bd5',
    );
    return color;
  },

  get focusIndicatorBackgroundColor(): string {
    const color = resolveCssVariable(
      '--sky-color-background-action-tertiary-focus',
      'rgba(0, 0, 0, 0)',
    );
    return color;
  },
};

// #region Private helper functions

/**
 * Resolve a CSS custom property value with an optional fallback
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/var
 *
 * @param varName Required. The variable name (must start with two dashes)
 * @param fallbackValue Optional. The fallback value (used if the variable is not found)
 * @returns The resolved CSS variable value, or the fallback if not found. Returns empty string if neither is found.
 */
function resolveCssVariable(varName: string, fallbackValue?: string): string {
  // Try to get from body first (where theme classes are typically applied)
  let value = window
    .getComputedStyle(document.body)
    .getPropertyValue(varName)
    .trim();

  // Fallback to document element
  if (!value) {
    value = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }

  if (value === '') {
    if (!fallbackValue) {
      console.warn(
        `CSS custom property not found and default was not provided`,
        varName,
      );
      return '';
    } else {
      return fallbackValue;
    }
  }

  return value;
}

/**
 * Convert rem values to pixels
 * Chart.js requires pixel values, not rem units
 */
function remToPixels(remValue: string): number {
  const remMatch = remValue.match(/([\d.]+)rem/);
  if (remMatch) {
    const rem = parseFloat(remMatch[1]);
    // Get root font size (typically 16px)
    const rootFontSize =
      typeof document !== 'undefined'
        ? parseFloat(window.getComputedStyle(document.documentElement).fontSize)
        : 16;
    return rem * rootFontSize;
  }

  // Try to parse as pixels
  return parseInt(remValue) || 0;
}

function extractShadowColor(shadowValue: string): string | null {
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

function colorToRgbaWithAlpha(color: string, alpha: number): string | null {
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
