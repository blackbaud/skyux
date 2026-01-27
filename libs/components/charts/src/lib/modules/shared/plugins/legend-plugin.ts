import { ChartType, LegendOptions } from 'chart.js';

import { SkyuxChartStyles } from '../global-chart-config';

export function getLegendPluginOptions(options?: {
  position: 'bottom' | 'right';
}): LegendOptions<ChartType> {
  const legendOptions: Partial<LegendOptions<ChartType>> = {
    display: true,
    position: options?.position ?? 'bottom',
    labels: {
      usePointStyle: true,
      pointStyle: 'circle',
      padding: 12,
      font: {
        size: SkyuxChartStyles.axisTickFontSize,
        family: SkyuxChartStyles.fontFamily,
        weight: SkyuxChartStyles.axisTickFontWeight,
      },
      color: SkyuxChartStyles.axisTickColor,
    } as LegendOptions<ChartType>['labels'],
  };

  // Type assertion is used here because Chart.js defines LegendOptions as all properties required but allows you to set some and fallback to defaults
  return legendOptions as LegendOptions<ChartType>;
}
