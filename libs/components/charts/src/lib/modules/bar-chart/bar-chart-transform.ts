import {
  ChartConfiguration,
  ChartOptions,
  TooltipItem,
  TooltipOptions,
} from 'chart.js';

import { SkyBarChartConfig, SkyChartAxisConfig } from '../shared/chart-types';
import { SkyuxChartStyles } from '../shared/global-chart-config';
import { createTooltipShadowPlugin } from '../shared/plugins';

import { getSkyuxBarChartConfig } from './bar-chart-config';

/**
 * Transforms a consumer-friendly SkyBarChartConfig into a ChartJS ChartConfiguration.
 * This function encapsulates all ChartJS implementation details and provides
 * a clean mapping from the public API to the internal representation.
 */
export function transformToChartJsConfig(
  config: SkyBarChartConfig,
): ChartConfiguration<'bar'> {
  const orientation = config.orientation || 'vertical';
  const isHorizontal = orientation === 'horizontal';

  // Determine which axis is which based on orientation
  const categoryAxisKey = isHorizontal ? 'y' : 'x';
  const valueAxisKey = isHorizontal ? 'x' : 'y';

  // Build scales configuration
  const scales = buildScalesConfig(
    categoryAxisKey,
    valueAxisKey,
    config.categoryAxis,
    config.valueAxis,
  );

  // Build ChartJS options
  const chartOptions = getSkyuxBarChartConfig({
    indexAxis: isHorizontal ? 'y' : 'x',
    scales,
    plugins: {
      title: config.title ? { display: true, text: config.title } : undefined,
      subtitle: config.subtitle
        ? { display: true, text: config.subtitle }
        : undefined,
      tooltip: {
        callbacks: buildTooltipCallbacks(config, isHorizontal),
      },
    },
    onClick: (e, elements, chart) => {
      if (elements.length === 0) {
        return;
      }

      const seriesIndex = elements[0]?.datasetIndex;
      const dataIndex = elements[0]?.index;

      const dataset = chart.data.datasets[seriesIndex];
      const dataValue = dataset.data[dataIndex];

      const category = dataset.label;
      const value = dataValue;

      console.log('Clicked', {
        seriesIndex,
        dataIndex,
        category,
        value,
      });
    },
  });

  // Get SKY UX visualization category colors for the series
  const seriesColors = SkyuxChartStyles.series;

  // Build datasets from series
  const datasets = config.series.map((series, index) => ({
    label: series.label,
    data: series.data,
    backgroundColor: seriesColors[index % seriesColors.length] || '#06a39e',
  }));

  // Plugin to add box shadow and accent border to tooltips
  const tooltipShadowPlugin = createTooltipShadowPlugin();

  return {
    type: 'bar',
    data: {
      labels: config.categories,
      datasets,
    },
    options: chartOptions,
    plugins: [tooltipShadowPlugin],
  };
}

/**
 * Builds the scales configuration for ChartJS based on axis settings.
 */
function buildScalesConfig(
  categoryAxisKey: 'x' | 'y',
  valueAxisKey: 'x' | 'y',
  categoryAxisConfig?: SkyChartAxisConfig,
  valueAxisConfig?: SkyChartAxisConfig,
): Partial<ChartOptions<'bar'>['scales']> {
  const scales: Partial<ChartOptions<'bar'>['scales']> = {};

  // Configure category axis
  scales[categoryAxisKey] = {};

  // Configure value axis
  scales[valueAxisKey] = {
    beginAtZero: valueAxisConfig?.beginAtZero ?? true,
  };

  return scales;
}

/**
 * Builds tooltip callbacks that use pre-formatted labels from series data.
 */
function buildTooltipCallbacks(
  config: SkyBarChartConfig,
  isHorizontal: boolean,
): Partial<TooltipOptions['callbacks']> {
  return {
    label: (tooltipItem: TooltipItem<'bar'>): string => {
      // console.log('label callback', tooltipItem);
      const seriesLabel = tooltipItem.dataset.label || '';
      const dataIndex = tooltipItem.dataIndex;

      // Check if the series has pre-formatted tooltip labels
      const series = config.series[tooltipItem.datasetIndex];
      if (series?.tooltipLabels && series.tooltipLabels[dataIndex]) {
        return `${seriesLabel}: ${series.tooltipLabels[dataIndex]}`;
      }

      // Fall back to default numeric formatting
      const value =
        (isHorizontal ? tooltipItem.parsed.x : tooltipItem.parsed.y) || 0;
      return `${seriesLabel}: ${value.toLocaleString()}`;
    },
  };
}
