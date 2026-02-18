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

  // Chart series colors for multi-series charts
  // Uses SKY UX visualization category colors resolved from CSS custom properties
  // Always start with category 1 and increment for each additional series
  get series(): string[] {
    return getCategoryColors();
  },

  // =============================================================================
  // AXIS (X/Y AXES)
  // =============================================================================

  get axisLineColor(): string {
    const color = resolveCssVariable('--sky-theme-color-viz-axis');
    // console.log('SKY UX Axis Line Color:', color);
    return color || '#85888d'; // Fallback to gray-250
  },

  get axisGridLineColor(): string {
    // Hardcoded to specific color instead of theme variable
    return '#d5d6d8';
  },

  get axisTickColor(): string {
    const color = resolveCssVariable('--sky-color-text-default');
    // console.log('SKY UX Axis Tick Color:', color);
    return color || '#252b33'; // Fallback to gray-900
  },

  get axisTickFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-s');
    // console.log('SKY UX Axis Tick Font Size:', size);
    return remToPixels(size || '13px'); // Fallback
  },

  get axisTickFontWeight(): number {
    const weight = resolveCssVariable('--sky-font-style-body-s');
    // console.log('SKY UX Axis Tick Font Weight:', weight);
    return Number(weight) || 400; // Fallback
  },

  get axisTickPaddingX(): number {
    const space = resolveCssVariable('--sky-space-gap-label-m');
    // console.log('SKY UX Axis Tick Padding (X):', space);
    return remToPixels(space || '0.5rem'); // Fallback to 8px
  },

  get axisTickPaddingY(): number {
    const space = resolveCssVariable('--sky-space-gap-label-m');
    // console.log('SKY UX Axis Tick Padding (Y):', space);
    return remToPixels(space || '0.5rem'); // Fallback to 8px
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

  // =============================================================================
  // LEGEND
  // =============================================================================
  get legendBackground(): string {
    const family = resolveCssVariable(
      '--sky-background-color-container-default',
    );
    return family || '#ffffff';
  },

  get legendTextColor(): string {
    return resolveCssVariableToHex('--sky-color-text-deemphasized');
  },

  // Legend label styling for chart style demonstrations
  get legendLabelFontSize(): number {
    return 13;
  },

  get legendLabelFontWeight(): string {
    return '400';
  },

  get legendLabelFontFamily(): string {
    return 'BLKB Sans, Arial, sans-serif';
  },

  get legendLabelColor(): string {
    return '#51555C';
  },

  get legendPointSize(): number {
    const size = resolveCssVariable('--sky-size-icon-xs');
    // console.log('SKY UX Legend Point Size:', size);
    return remToPixels(size || '12px'); // Fallback
  },

  get legendLabelsPadding(): number {
    const space = resolveCssVariable('--sky-space-gap-action_group-l');
    // console.log('SKY UX Legend Labels Padding:', space);
    return remToPixels(space || '8px'); // Fallback
  },

  get legendFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-s');
    // console.log('SKY UX Legend Font Size:', size);
    return remToPixels(size || '13px'); // Fallback
  },

  get legendFontWeight(): number {
    const weight = resolveCssVariable('--sky-font-style-body-s');
    // console.log('SKY UX Legend Font Weight:', weight);
    return Number(weight) || 400; // Fallback
  },

  get legendFontFamily(): string {
    const family = resolveCssVariable('--sky-font-family-primary');
    // console.log('SKY UX Legend Font Family:', family);
    return family || 'Blackbaud Sans, Arial, sans-serif'; // Fallback
  },

  get legendFontLineHeight(): string {
    const lineHeight = resolveCssVariable('--sky-font-line_height-body-s');
    // console.log('SKY UX Legend Font Line Height:', lineHeight);
    return lineHeight || '1.5'; // Fallback
  },

  // =============================================================================
  // SCALE TITLES (Axis Labels)
  // =============================================================================

  get scaleTitleFontSize(): number {
    return 13;
  },

  get scaleTitleFontFamily(): string {
    return 'BLKB Sans, Arial, sans-serif';
  },

  get scaleTitleColor(): string {
    return resolveCssVariableToHex('--sky-color-text-deemphasized');
  },

  get scaleTitlePaddingTop(): number {
    return 0;
  },

  // X-axis title padding (top and bottom)
  get scaleXTitlePaddingTop(): number {
    const space = resolveCssVariable('--sky-space-stacked-0');
    // console.log('SKY UX Scale X Title Padding Top:', space);
    return remToPixels(space || '0px'); // Fallback
  },

  get scaleXTitlePaddingBottom(): number {
    const space = resolveCssVariable('--sky-space-stacked-l');
    // console.log('SKY UX Scale X Title Padding Bottom:', space);
    return remToPixels(space || '16px'); // Fallback
  },

  // Y-axis title padding (right and left)
  get scaleYTitlePaddingRight(): number {
    const space = resolveCssVariable('--sky-space-inline-0');
    // console.log('SKY UX Scale Y Title Padding Right:', space);
    return remToPixels(space || '0px'); // Fallback
  },

  get scaleYTitlePaddingLeft(): number {
    const space = resolveCssVariable('--sky-space-inline-l');
    // console.log('SKY UX Scale Y Title Padding Left:', space);
    return remToPixels(space || '16px'); // Fallback
  },

  // =============================================================================
  // BAR/CHART ELEMENTS
  // =============================================================================

  get barBorderColor(): string {
    const color = resolveCssVariable('--sky-color-background-container-base');
    // console.log('SKY UX Bar Border Color:', color);
    return color || '#ffffff'; // Fallback to white
  },

  get barBorderWidth(): number {
    const width = resolveCssVariable('--sky-border-width-default');
    // console.log('SKY UX Bar Border Width:', width);
    return remToPixels(width || '1px'); // Fallback
  },

  get barBorderRadius(): number {
    const radius = resolveCssVariable('--sky-border-radius-xs');
    // console.log('SKY UX Bar Border Radius:', radius);
    return remToPixels(radius || '2px'); // Fallback
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
    const size = resolveCssVariable('--sky-size-icon-xxxs');
    // console.log('SKY UX Line Point Radius:', size);
    return remToPixels(size || '4px'); // Fallback
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
    const color = resolveCssVariable('--sky-color-background-container-base');
    // console.log('SKY UX Tooltip Background Color:', color);
    return color || '#ffffff'; // Fallback to white
  },

  get tooltipBorderColor(): string {
    const color = resolveCssVariable('--sky-color-border-container-base');
    // console.log('SKY UX Tooltip Border Color:', color);
    return color || '#c2c4c6'; // Fallback to gray-300
  },

  get tooltipBorderWidth(): number {
    const width = resolveCssVariable('--sky-border-width-container-base');
    // console.log('SKY UX Tooltip Border Width:', width);
    // Convert border width string (like "1px") to number
    const numWidth = parseInt(width) || 1;
    return numWidth; // Fallback to 1px
  },

  get tooltipTitleColor(): string {
    const color = resolveCssVariable('--sky-color-text-default');
    // console.log('SKY UX Tooltip Title Color:', color);
    return color || '#252b33'; // Fallback to gray-900
  },

  get tooltipBodyColor(): string {
    const color = resolveCssVariable('--sky-color-text-default');
    // console.log('SKY UX Tooltip Body Color:', color);
    return color || '#252b33'; // Fallback to gray-900
  },

  get tooltipPadding(): number {
    const space = resolveCssVariable('--sky-space-inset-balanced-m');
    // console.log('SKY UX Tooltip Padding:', space);
    return remToPixels(space || '8px'); // Fallback
  },

  get tooltipTitleMarginBottom(): number {
    const space = resolveCssVariable('--sky-space-stacked-s');
    // console.log('SKY UX Tooltip Title Margin Bottom:', space);
    return remToPixels(space || '8px'); // Fallback
  },

  get tooltipBodySpacing(): number {
    const space = resolveCssVariable('--sky-space-stacked-xs');
    // console.log('SKY UX Tooltip Body Spacing:', space);
    return remToPixels(space || '4px'); // Fallback
  },

  get tooltipCaretSize(): number {
    const size = resolveCssVariable('--sky-size-icon-xxs');
    // console.log('SKY UX Tooltip Caret Size:', size);
    return remToPixels(size || '8px'); // Fallback
  },

  get tooltipTitleFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-m');
    // console.log('SKY UX Tooltip Title Font Size:', size);
    return remToPixels(size || '15px'); // Fallback
  },

  get tooltipTitleFontWeight(): number {
    const weight = resolveCssVariable('--sky-font-style-emphasized');
    // console.log('SKY UX Tooltip Title Font Weight:', weight);
    return Number(weight) || 600; // Fallback
  },

  get tooltipBodyFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-m');
    // console.log('SKY UX Tooltip Body Font Size:', size);
    return remToPixels(size || '15px'); // Fallback
  },

  get tooltipBodyFontWeight(): number {
    const weight = resolveCssVariable('--sky-font-style-body-m');
    // console.log('SKY UX Tooltip Body Font Weight:', weight);
    return Number(weight) || 400; // Fallback
  },

  get tooltipFooterFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-m');
    return remToPixels(size || '15px'); // Fallback
  },

  get tooltipFooterFontWeight(): number {
    const weight = resolveCssVariable('--sky-font-style-body-m');
    return Number(weight) || 400; // Fallback
  },

  get tooltipBoxPadding(): number {
    const space = resolveCssVariable('--sky-space-gap-label-s');
    // console.log('SKY UX Tooltip Box Padding:', space);
    return remToPixels(space || '4px'); // Fallback
  },

  get tooltipShadowColor(): string {
    const shadowVar = resolveCssVariable('--sky-elevation-overlay-100');
    const baseShadowColor =
      extractShadowColor(shadowVar) || 'rgba(0, 0, 0, 0.15)';
    const overrideColor =
      colorToRgbaWithAlpha(baseShadowColor, 0.6) || baseShadowColor;

    return overrideColor;
  },

  get tooltipCornerRadius(): number {
    const space = resolveCssVariable('--sky-border-radius-s');
    return remToPixels(space || '4px'); // Fallback
  },

  // =============================================================================
  // SHARED/GENERAL
  // =============================================================================

  get fontFamily(): string {
    const family = resolveCssVariable('--sky-font-family-primary');
    // console.log('SKY UX Font Family:', family);
    return family || 'Blackbaud Sans, Arial, sans-serif'; // Fallback
  },

  get markerColor(): string {
    const color = resolveCssVariable('--sky-theme-color-viz-marker');
    return color || '#252b33'; // Fallback to gray-900
  },

  // =============================================================================
  // LAYOUT/CHART PADDING
  // =============================================================================

  get chartPadding(): number {
    const space = resolveCssVariable('--sky-space-inset-balanced-none');
    // console.log('SKY UX Chart Padding:', space);
    return remToPixels(space || '4px'); // Fallback to 4px
  },

  get focusIndicatorColor(): string {
    // TODO: Confirm from UX
    return '#1c84ff';
  },
};

// #region Private helper functions

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

/**
 * Resolve CSS custom property value
 * Checks both document body and document element for theme classes
 */
function resolveCssVariable(varName: string): string {
  if (typeof document === 'undefined') {
    return ''; // Return empty for SSR
  }

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

  return value || '';
}

/**
 * Convert CSS color value (rgb, rgba, or hex) to hex format
 */
function colorToHex(color: string): string {
  // If already hex, return as-is
  if (color.startsWith('#')) {
    return color;
  }

  // Handle rgb/rgba format
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  // Fallback to original color
  return color;
}

/**
 * Resolve CSS custom property and convert to hex value
 */
function resolveCssVariableToHex(varName: string): string {
  const colorValue = resolveCssVariable(varName);
  return colorToHex(colorValue);
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

/**
 * Get SKY UX visualization category colors
 * Resolves CSS custom properties at runtime
 */
function getCategoryColors(): string[] {
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

  // console.debug('SKY UX Chart Series Colors:', colors);

  return colors;
}

// #endregion
