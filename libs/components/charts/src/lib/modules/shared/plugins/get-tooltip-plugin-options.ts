import { TooltipOptions } from 'chart.js';

import { SkyChartStyles } from '../services/chart-style.service';
import { DeepPartial } from '../types/deep-partial-type';

/**
 * Get default tooltip options for Chart.JS Tooltips
 */
export function getTooltipPluginOptions(
  styles: SkyChartStyles,
): DeepPartial<TooltipOptions> {
  return {
    enabled: true,
    mode: 'index',
    intersect: false,
    cornerRadius: styles.tooltip.cornerRadius,
    backgroundColor: styles.tooltip.backgroundColor,
    titleColor: styles.tooltip.titleColor,
    bodyColor: styles.tooltip.bodyColor,
    borderColor: styles.tooltip.borderColor,
    borderWidth: styles.tooltip.borderWidth,
    padding: styles.tooltip.padding,
    displayColors: true,
    multiKeyBackground: 'transparent',
    bodySpacing: styles.tooltip.bodySpacing,
    titleMarginBottom: styles.tooltip.titleMarginBottom,
    caretSize: styles.tooltip.caretSize,
    boxPadding: styles.tooltip.boxPadding,
    caretPadding: 4,
    usePointStyle: true,
    titleFont: {
      family: styles.fontFamily,
      size: styles.tooltip.titleFontSize,
      weight: styles.tooltip.titleFontWeight,
    },
    bodyFont: {
      family: styles.fontFamily,
      size: styles.tooltip.bodyFontSize,
      weight: styles.tooltip.bodyFontWeight,
    },
    footerFont: {
      family: styles.fontFamily,
      size: styles.tooltip.footerFontSize,
      weight: styles.tooltip.footerFontWeight,
    },
  };
}
