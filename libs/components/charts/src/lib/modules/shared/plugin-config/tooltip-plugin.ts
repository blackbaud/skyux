import { TooltipOptions } from 'chart.js';

import { SkyuxChartStyles } from '../global-chart-config';

export function getTooltipPluginOptions(): Partial<TooltipOptions> {
  return {
    enabled: true,
    mode: 'index',
    intersect: false,
    backgroundColor: SkyuxChartStyles.tooltipBackgroundColor,
    titleColor: SkyuxChartStyles.tooltipTitleColor,
    bodyColor: SkyuxChartStyles.tooltipBodyColor,
    borderColor: 'transparent',
    borderWidth: 0,
    padding: SkyuxChartStyles.tooltipPadding,
    displayColors: true, // Hide default caret since we draw our own colored one
    multiKeyBackground: 'transparent', // multiKeyBackground sets caret color
    bodySpacing: SkyuxChartStyles.tooltipBodySpacing,
    titleMarginBottom: SkyuxChartStyles.tooltipTitleMarginBottom,
    caretSize: SkyuxChartStyles.tooltipCaretSize,
    boxPadding: SkyuxChartStyles.tooltipBoxPadding,
    caretPadding: 4,
    usePointStyle: true,
    titleFont: {
      family: SkyuxChartStyles.fontFamily,
      size: SkyuxChartStyles.tooltipTitleFontSize,
      weight: SkyuxChartStyles.tooltipTitleFontWeight,
    },
    bodyFont: {
      family: SkyuxChartStyles.fontFamily,
      size: SkyuxChartStyles.tooltipBodyFontSize,
      weight: SkyuxChartStyles.tooltipBodyFontWeight,
    },
  };
}
