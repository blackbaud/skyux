import { ChartType, LegendOptions } from 'chart.js';

import { SkyuxChartStyles } from '../chart-styles';

export function getLegendPluginOptions(options?: {
  position: 'bottom' | 'right';
}): LegendOptions<ChartType> {
  const legendOptions: Partial<LegendOptions<ChartType>> = {
    display: true,
    position: options?.position ?? 'bottom',
    labels: {
      usePointStyle: true,
      pointStyle: 'circle',
      boxWidth: SkyuxChartStyles.legendPointSize,
      boxHeight: SkyuxChartStyles.legendPointSize,
      padding: SkyuxChartStyles.legendLabelsPadding,
      font: {
        size: SkyuxChartStyles.axisTickFontSize,
        family: SkyuxChartStyles.fontFamily,
        weight: SkyuxChartStyles.axisTickFontWeight,
        lineHeight: SkyuxChartStyles.legendFontLineHeight,
      },
      color: SkyuxChartStyles.legendLabelColor,
    } as LegendOptions<ChartType>['labels'],
  };

  // Type assertion is used here because Chart.js defines LegendOptions as all properties required but allows you to set some and fallback to defaults
  return legendOptions as LegendOptions<ChartType>;
}
