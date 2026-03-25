import { TooltipOptions } from 'chart.js';

import { SkyChartStyles } from '../services/chart-style.service';
import { DeepPartial } from '../types/deep-partial-type';

/**
 * Get default tooltip options for Chart.JS Tooltips
 */
export function getTooltipPluginOptions(
  styles: SkyChartStyles,
): DeepPartial<TooltipOptions> {
  // Default tooltip interaction options
  // - These defaults allow for a more forgiving UX as the tooltip will appear when the user is near a data point, even when not directly intersecting it.
  // - This is especially helpful for touch devices or when dealing with small data points.
  const interaction: DeepPartial<TooltipOptions> = {
    mode: 'index',
    intersect: false,
  };

  const options: DeepPartial<TooltipOptions> = {
    enabled: true,
    position: 'average',
    displayColors: true,
    usePointStyle: true,
    ...interaction,
    ...getTypographyStyles(styles),
    ...getSizingAndSpacingStyles(styles),
    ...getElementColors(styles),
  };

  return options;
}

function getTypographyStyles(
  styles: SkyChartStyles,
): DeepPartial<TooltipOptions> {
  const title: DeepPartial<TooltipOptions> = {
    titleColor: styles.tooltip.title.color,
    titleFont: {
      family: styles.fontFamily,
      size: styles.tooltip.title.fontSize,
      weight: styles.tooltip.title.fontWeight,
      lineHeight: styles.tooltip.title.lineHeight,
    },
  };

  const body: DeepPartial<TooltipOptions> = {
    bodyColor: styles.tooltip.body.color,
    bodyFont: {
      family: styles.fontFamily,
      size: styles.tooltip.body.fontSize,
      weight: styles.tooltip.body.fontWeight,
      lineHeight: styles.tooltip.body.lineHeight,
    },
  };

  const footer: DeepPartial<TooltipOptions> = {
    footerColor: styles.tooltip.footer.color,
    footerFont: {
      family: styles.fontFamily,
      size: styles.tooltip.footer.fontSize,
      weight: styles.tooltip.footer.fontWeight,
      lineHeight: styles.tooltip.footer.lineHeight,
    },
  };

  return { ...title, ...footer, ...body };
}

function getSizingAndSpacingStyles(
  styles: SkyChartStyles,
): DeepPartial<TooltipOptions> {
  return {
    // Container
    padding: styles.tooltip.padding,
    cornerRadius: styles.tooltip.cornerRadius,
    borderWidth: styles.tooltip.borderWidth,
    // Caret
    caretSize: styles.tooltip.caret.size,
    caretPadding: styles.tooltip.caret.padding,
    // Icon
    boxHeight: styles.tooltip.box.height,
    boxWidth: styles.tooltip.box.width,
    boxPadding: styles.tooltip.box.padding,
    multiKeyBackground: 'transparent', // Removes the colored box behind the icon
    // Text Spacing
    titleMarginBottom: styles.tooltip.title.marginBottom,
    bodySpacing: styles.tooltip.body.bodySpacing,
    footerMarginTop: styles.tooltip.footer.marginTop,
  };
}

function getElementColors(styles: SkyChartStyles): DeepPartial<TooltipOptions> {
  return {
    backgroundColor: styles.tooltip.backgroundColor,
    borderColor: styles.tooltip.borderColor,
  };
}
