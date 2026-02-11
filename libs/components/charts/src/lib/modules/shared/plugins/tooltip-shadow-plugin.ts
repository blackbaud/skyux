import { Plugin } from 'chart.js';

import { SkyuxChartStyles } from '../chart-styles';

/**
 * Plugin to add box shadow and accent border to tooltips
 * @returns
 */
export function createTooltipShadowPlugin(): Plugin {
  const plugins: Plugin = {
    id: 'sky_tooltip_shadow',
    beforeTooltipDraw: (chart) => {
      const tooltip = chart.tooltip;
      if (!tooltip || tooltip.opacity === 0) {
        return;
      }

      const ctx = chart.ctx;

      const { x, y, width, height } = tooltip;
      const borderRadius = 6;

      ctx.save();

      // Temporarily disable clipping to allow shadow to extend beyond tooltip bounds
      ctx.globalCompositeOperation = 'destination-over';

      ctx.fillStyle = SkyuxChartStyles.tooltipBackgroundColor;
      ctx.shadowColor = SkyuxChartStyles.tooltipShadowColor;
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;

      ctx.beginPath();
      ctx.roundRect(x, y, width, height, borderRadius);
      ctx.fill();

      ctx.restore();
    },
  };

  return plugins;
}
