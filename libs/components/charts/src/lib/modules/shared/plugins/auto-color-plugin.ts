import { Chart, ChartDataset, ChartType, Plugin } from 'chart.js';

import { SkyuxChartStyles } from '../chart-styles';

/**
 * Creates a ChartJS plugin that automatically applies SKY UX color palette to chart datasets.
 *
 * @returns Plugin that auto-colors datasets based on the specified mode
 */
export function createAutoColorPlugin(): Plugin<ChartType> {
  const plugin: Plugin = {
    id: 'sky_auto_color',
    beforeUpdate(chart): boolean | void {
      const colorMode = deriveMode(chart);
      const colors = SkyuxChartStyles.series;

      if (colorMode === 'data') {
        applyDataMode(chart, colors);
      } else {
        applyDatasetMode(chart, colors);
      }
    },
  };

  return plugin;
}

function getChartType(chart: Chart): string {
  const chartConfig = chart.config as { type: string };
  return chartConfig.type;
}

function deriveMode(chart: Chart): SkyAutoColorMode {
  const chartType = getChartType(chart);

  // For pie and doughnut charts, use 'data' mode to assign a color to each segment
  if (
    chart.data.datasets.length === 1 ||
    chartType === 'pie' ||
    chartType === 'doughnut'
  ) {
    return 'data';
  }

  // For multi-series charts use 'dataset' mode
  if (chart.data.datasets.length > 1) {
    return 'dataset';
  }

  return 'dataset';
}

/** Sets the background and border colors for a dataset */
function setDatasetColors(
  dataset: ChartDataset,
  backgroundColor: string[],
  chartType: string,
): void {
  if (chartType === 'line') {
    dataset.backgroundColor = backgroundColor;
    dataset.borderColor = backgroundColor;
    (dataset as ChartDataset<'line'>).pointBackgroundColor = backgroundColor;
  } else {
    dataset.backgroundColor = backgroundColor;
    dataset.borderColor = SkyuxChartStyles.barBorderColor;
  }
}

/** Applies colors in 'dataset' mode - each `dataset` gets a unique color. */
function applyDatasetMode(chart: Chart, colors: string[]): void {
  const chartType = getChartType(chart);
  const datasets = chart.data.datasets;

  datasets.forEach((dataset, datasetIndex) => {
    const color = colors[datasetIndex % colors.length];
    setDatasetColors(dataset, [color], chartType);
  });
}

/** Applies colors in 'data' mode - each `dataset.data` index gets a unique color */
function applyDataMode(chart: Chart, colors: string[]): void {
  const chartType = getChartType(chart);
  const datasets = chart.data.datasets;

  datasets.forEach((dataset) => {
    const backgroundColors: string[] = [];

    for (let i = 0; i < dataset.data.length; i++) {
      const color = colors[i % colors.length];
      backgroundColors.push(color);
    }

    setDatasetColors(dataset, backgroundColors, chartType);
  });
}

/**
 * In 'dataset' mode, a new color is picked for each dataset.
 * In 'data' mode, an array of colors, equivalent to the length of data is provided for each dataset.
 */
type SkyAutoColorMode = 'dataset' | 'data';
