import { TooltipOptions } from 'chart.js';

import { SkyuxChartStyles } from '../chart-styles';
import { DeepPartial } from '../types/deep-partial-type';

export function getTooltipPluginOptions(): DeepPartial<TooltipOptions> {
  return {
    enabled: true,
    mode: 'index',
    intersect: false,
    cornerRadius: SkyuxChartStyles.tooltipCornerRadius,
    backgroundColor: SkyuxChartStyles.tooltipBackgroundColor,
    titleColor: SkyuxChartStyles.tooltipTitleColor,
    bodyColor: SkyuxChartStyles.tooltipBodyColor,
    borderColor: SkyuxChartStyles.tooltipBorderColor,
    borderWidth: SkyuxChartStyles.tooltipBorderWidth,
    padding: SkyuxChartStyles.tooltipPadding,
    displayColors: true,
    multiKeyBackground: 'transparent',
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
    footerFont: {
      family: SkyuxChartStyles.fontFamily,
      size: SkyuxChartStyles.tooltipFooterFontSize,
      weight: SkyuxChartStyles.tooltipFooterFontWeight,
    },
  };
}
