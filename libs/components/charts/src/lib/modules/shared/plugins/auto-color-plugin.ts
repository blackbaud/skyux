import { Chart, ChartDataset, ChartType, Plugin } from 'chart.js';

import { isDatasetType } from '../chart-helpers';
import {
  SkyChartStyleService,
  SkyChartStyles,
} from '../services/chart-style.service';

/**
 * Creates a ChartJS plugin that automatically applies SKY UX color palette to chart datasets.
 *
 * @returns Plugin that auto-colors datasets based on the specified mode
 */
export function createAutoColorPlugin(
  styleService: SkyChartStyleService,
): Plugin<ChartType> {
  const plugin: Plugin = {
    id: 'sky_auto_color',
    beforeUpdate(chart): boolean | void {
      // Get styles at runtime to ensure colors are up to date with current theme
      const styles = styleService.styles();

      const hasMultipleDatasets = chart.data.datasets.length > 1;

      if (hasMultipleDatasets) {
        applyDatasetMode(chart, styles);
      } else {
        applyDataMode(chart, styles);
      }
    },
  };

  return plugin;
}

/** Sets the background and border colors for a dataset */
function setDatasetColors(
  chart: Chart,
  dataset: ChartDataset,
  backgroundColor: string[],
): void {
  if (isDatasetType(chart, dataset, 'bar')) {
    dataset.backgroundColor = backgroundColor;
  } else if (isDatasetType(chart, dataset, 'line')) {
    dataset.backgroundColor = backgroundColor;
    dataset.borderColor = backgroundColor;
    dataset.pointBackgroundColor = backgroundColor;
  } else {
    dataset.backgroundColor = backgroundColor;
  }
}

/** Applies colors in 'dataset' mode - each `dataset` (series) gets a unique color. */
function applyDatasetMode(chart: Chart, styles: SkyChartStyles): void {
  const datasets = chart.data.datasets;
  const colors = styles.series;

  datasets.forEach((dataset, datasetIndex) => {
    const color = colors[datasetIndex % colors.length];
    setDatasetColors(chart, dataset, [color]);
  });
}

/** Applies colors in 'data' mode - each `dataset.data` (series datapoint) gets a unique color. */
function applyDataMode(chart: Chart, styles: SkyChartStyles): void {
  const datasets = chart.data.datasets;
  const colors = styles.series;

  datasets.forEach((dataset) => {
    const backgroundColors: string[] = [];

    for (let i = 0; i < dataset.data.length; i++) {
      const color = colors[i % colors.length];
      backgroundColors.push(color);
    }

    setDatasetColors(chart, dataset, backgroundColors);
  });
}
