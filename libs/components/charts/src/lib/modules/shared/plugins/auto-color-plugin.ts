import { Chart, ChartType, Plugin } from 'chart.js';

import { SkyuxChartStyles } from '../global-chart-config';

interface SkyAutoColorConfig {
  mode?: 'dataset' | 'label';
  enabled?: boolean;
}

/**
 * Creates a ChartJS plugin that automatically applies SKY UX color palette to chart datasets.
 * Cycles through the 8 visualization category colors defined in SkyuxChartStyles.series.
 *
 * @returns Plugin that auto-colors datasets based on the specified mode
 */
export function createAutoColorPlugin(): Plugin<ChartType, SkyAutoColorConfig> {
  return {
    id: 'skyAutoColor',
    beforeUpdate(chart, args, options): boolean | void {
      const { mode = 'dataset', enabled = true } = options;

      if (!enabled) {
        return;
      }

      // Get SKY UX visualization colors
      const colors = SkyuxChartStyles.series;

      // Always use label mode for pie and doughnut charts
      // Access type through config with proper typing
      const chartConfig = chart.config as { type: string };
      const shouldUseLabelMode =
        mode === 'label' || ['pie', 'doughnut'].includes(chartConfig.type);

      if (shouldUseLabelMode) {
        // In label mode, each data point (label) gets a different color
        applyLabelMode(chart, colors);
      } else {
        // In dataset mode (default), each dataset gets a different color
        applyDatasetMode(chart, colors);
      }
    },
  };
}

/**
 * Applies colors in dataset mode - each dataset gets a unique color.
 * This is the default mode for multi-series charts like bar charts with multiple series.
 */
function applyDatasetMode(chart: Chart, colors: string[]): void {
  const datasets = chart.data.datasets;

  datasets.forEach((dataset, datasetIndex) => {
    // Skip if the dataset already has a background color explicitly set
    if (dataset.backgroundColor && !Array.isArray(dataset.backgroundColor)) {
      return;
    }

    // Get color for this dataset (cycle through available colors)
    const color = colors[datasetIndex % colors.length];

    // Apply color to the dataset
    dataset.backgroundColor = color;
    dataset.borderColor = color;
  });
}

/**
 * Applies colors in label mode - each data point within a dataset gets a unique color.
 * This is useful for pie/doughnut charts where each segment should have a different color.
 */
function applyLabelMode(chart: Chart, colors: string[]): void {
  const datasets = chart.data.datasets;

  datasets.forEach((dataset) => {
    // Skip if the dataset already has array of background colors explicitly set
    if (
      Array.isArray(dataset.backgroundColor) &&
      dataset.backgroundColor.length > 0
    ) {
      return;
    }

    const dataLength = Array.isArray(dataset.data) ? dataset.data.length : 0;

    if (dataLength === 0) {
      return;
    }

    // Create array of colors, one for each data point
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];

    for (let i = 0; i < dataLength; i++) {
      const color = colors[i % colors.length];
      backgroundColors.push(color);
      borderColors.push(color);
    }

    // Apply color arrays to the dataset
    dataset.backgroundColor = backgroundColors;
    dataset.borderColor = borderColors;
  });
}
