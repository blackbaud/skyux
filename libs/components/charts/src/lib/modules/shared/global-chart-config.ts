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
    return color || '#85888d'; // Fallback to gray-500
  },

  get axisGridLineColor(): string {
    const color = resolveCssVariable('--sky-theme-color-viz-gridline');
    // console.log('SKY UX Axis Grid Line Color:', color);
    return color || '#e0e1e2'; // Fallback to gray-200
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

  get axisTickFontWeight(): string {
    const weight = resolveCssVariable('--sky-font-style-body-s');
    // console.log('SKY UX Axis Tick Font Weight:', weight);
    return weight || '400'; // Fallback
  },

  get axisTickPadding(): number {
    const space = resolveCssVariable('--sky-space-gap-label-m');
    // console.log('SKY UX Axis Tick Padding:', space);
    return remToPixels(space || '0.5rem'); // Fallback to 8px
  },

  // =============================================================================
  // BAR/CHART ELEMENTS
  // =============================================================================

  get barBorderColor(): string {
    const color = resolveCssVariable('--sky-color-background-container-base');
    // console.log('SKY UX Bar Border Color:', color);
    return color || '#ffffff'; // Fallback to white
  },

  get barBorderRadius(): number {
    const radius = resolveCssVariable('--sky-border-radius-small');
    // console.log('SKY UX Bar Border Radius:', radius);
    return remToPixels(radius || '4px'); // Fallback
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
    const color = resolveCssVariable('--sky-color-background-container-dimmed');
    // console.log('SKY UX Tooltip Background Color:', color);
    return color || '#ffffff'; // Fallback to white
  },

  get tooltipBorderColor(): string {
    const color = resolveCssVariable('--sky-theme-color-viz-axis');
    // console.log('SKY UX Tooltip Border Color:', color);
    return color || '#c2c4c6'; // Fallback to gray-300
  },

  get tooltipAccentBorderColor(): string {
    const color = resolveCssVariable('--sky-color-border-info');
    // console.log('SKY UX Tooltip Accent Border Color:', color);
    return color || '#00b4f1'; // Fallback to info blue
  },

  get tooltipAccentBorderWidth(): number {
    const width = resolveCssVariable('--sky-border-width-accent');
    // console.log('SKY UX Tooltip Accent Border Width:', width);
    return remToPixels(width || '3px'); // Fallback
  },

  get tooltipTitleColor(): string {
    const color = resolveCssVariable('--sky-color-text-heading');
    // console.log('SKY UX Tooltip Title Color:', color);
    return color || '#252b33'; // Fallback to gray-900
  },

  get tooltipBodyColor(): string {
    const color = resolveCssVariable('--sky-color-text-default');
    // console.log('SKY UX Tooltip Body Color:', color);
    return color || '#252b33'; // Fallback to gray-900
  },

  get tooltipPadding(): number {
    const space = resolveCssVariable('--sky-space-inset-balanced-l');
    // console.log('SKY UX Tooltip Padding:', space);
    return remToPixels(space || '16px'); // Fallback
  },

  get tooltipTitleMarginBottom(): number {
    const space = resolveCssVariable('--sky-space-stacked-l');
    // console.log('SKY UX Tooltip Title Margin Bottom:', space);
    return remToPixels(space || '12px'); // Fallback
  },

  get tooltipBodySpacing(): number {
    const space = resolveCssVariable('--sky-space-stacked-s');
    // console.log('SKY UX Tooltip Body Spacing:', space);
    return remToPixels(space || '4px'); // Fallback
  },

  get tooltipCaretSize(): number {
    const size = resolveCssVariable('--sky-size-icon-xxs');
    // console.log('SKY UX Tooltip Caret Size:', size);
    return remToPixels(size || '8px'); // Fallback
  },

  get tooltipTitleFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-heading-4');
    // console.log('SKY UX Tooltip Title Font Size:', size);
    return remToPixels(size || '15px'); // Fallback
  },

  get tooltipTitleFontWeight(): string {
    const weight = resolveCssVariable('--sky-font-style-heading-4');
    // console.log('SKY UX Tooltip Title Font Weight:', weight);
    return weight || '600'; // Fallback
  },

  get tooltipBodyFontSize(): number {
    const size = resolveCssVariable('--sky-font-size-body-m');
    // console.log('SKY UX Tooltip Body Font Size:', size);
    return remToPixels(size || '15px'); // Fallback
  },

  get tooltipBodyFontWeight(): string {
    const weight = resolveCssVariable('--sky-font-style-body-m');
    // console.log('SKY UX Tooltip Body Font Weight:', weight);
    return weight || '400'; // Fallback
  },

  get tooltipBoxPadding(): number {
    const space = resolveCssVariable('--sky-space-gap-label-xs');
    // console.log('SKY UX Tooltip Box Padding:', space);
    return remToPixels(space || '4px'); // Fallback
  },
  get tooltipShadow(): {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  } {
    const shadow = resolveCssVariable('--sky-elevation-overlay-100');
    // console.log('SKY UX Tooltip Shadow:', shadow);

    // Parse box-shadow format: "0px 2px 4px 0px rgba(0, 0, 0, 0.15)"
    // Format: offset-x offset-y blur-radius spread-radius color
    const match = shadow.match(
      /(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px\s+[\d.]+px\s+(.+)/,
    );

    if (match) {
      return {
        offsetX: parseFloat(match[1]),
        offsetY: parseFloat(match[2]),
        blur: parseFloat(match[3]),
        color: match[4].trim(),
      };
    }

    // Fallback values
    return {
      offsetX: 0,
      offsetY: 2,
      blur: 4,
      color: 'rgba(0, 0, 0, 0.15)',
    };
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
};
