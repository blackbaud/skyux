import { Chart, ChartDataset, ChartType, Plugin } from 'chart.js';

import { isDatasetType, isDonutChart } from '../../chart-helpers';
import { SkyChartStyleService } from '../../services/chart-style.service';

/**
 * Creates a ChartJS plugin that automatically applies SKY UX color palette to chart datasets.
 *
 * @returns Plugin that auto-colors datasets based on the specified mode
 */
export function createAutoColorPlugin(
  styleService: SkyChartStyleService,
): Plugin<ChartType> {
  const plugin: Plugin<ChartType> = {
    id: 'sky_auto_color',
    beforeUpdate(chart): boolean | void {
      // Get styles at runtime to ensure colors are up to date with current theme
      const styles = styleService.styles();

      // Today only the Categorical Palette is supported but this can be extended in the future to support different palettes
      const colors = styles.palettes.categorical;

      // For donut charts, always apply colors in 'data' mode
      if (isDonutChart(chart)) {
        applyDataMode(chart, colors);
      } else {
        applyDatasetMode(chart, colors);
      }
    },
  };

  return plugin;
}

/**
 * Applies colors in 'dataset' mode - each `dataset` (series) gets a unique color.
 * @param chart The chart instance
 * @param colors The color palette to apply to the datasets
 */
function applyDatasetMode(chart: Chart, colors: string[]): void {
  const datasets = chart.data.datasets;

  datasets.forEach((dataset, datasetIndex) => {
    const color = colors[datasetIndex % colors.length];
    setDatasetColors(chart, dataset, color);
  });
}

/**
 * Applies colors in 'data' mode - each `dataset.data` (series datapoint) gets a unique color.
 * @param chart The chart instance
 * @param colors The color palette to apply to the datasets
 */
function applyDataMode(chart: Chart, colors: string[]): void {
  const datasets = chart.data.datasets;

  datasets.forEach((dataset) => {
    const backgroundColors: string[] = [];

    for (let i = 0; i < dataset.data.length; i++) {
      const color = colors[i % colors.length];
      backgroundColors.push(color);
    }

    setDatasetColors(chart, dataset, backgroundColors);
  });
}

/**
 * Sets the colors on the given dataset based on the chart type.
 * @param chart The chart instance
 * @param dataset The dataset to update
 * @param backgroundColor The background color(s) to apply to the dataset
 */
function setDatasetColors(
  chart: Chart,
  dataset: ChartDataset,
  backgroundColor: string | string[],
): void {
  dataset.backgroundColor = backgroundColor;
  dataset.hoverBackgroundColor = backgroundColor;

  if (isDatasetType(chart, dataset, 'line')) {
    dataset.borderColor = backgroundColor;
    dataset.pointBackgroundColor = backgroundColor;
  }
}
