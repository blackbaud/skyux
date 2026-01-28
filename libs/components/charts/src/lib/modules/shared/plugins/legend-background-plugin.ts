import { Plugin } from 'chart.js';

import { SkyuxChartStyles } from '../global-chart-config';

/**
 * Creates a Chart.js plugin that draws a background behind the chart legend.
 */
export function createLegendBackgroundPlugin(): Plugin {
  const plugin: Plugin = {
    id: 'sky_legend_background',
    beforeDraw(chart) {
      const { ctx, legend } = chart;
      if (!legend) return;

      const padding = 10;
      const x = legend.left - padding;
      const y = legend.top - padding;
      const width = legend.width + padding * 2;
      const height = legend.height + padding * 2;

      ctx.save();
      ctx.fillStyle = SkyuxChartStyles.legendBackground;
      ctx.fillRect(x, y, width, height);
      ctx.restore();
    },
  };

  return plugin;
}
