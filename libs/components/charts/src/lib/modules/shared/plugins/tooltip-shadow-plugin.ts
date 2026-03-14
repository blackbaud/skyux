import { Plugin } from 'chart.js';

import { SkyChartStyleService } from '../services/chart-style.service';

/**
 * Plugin to add box shadow and accent border to tooltips
 * @returns
 */
export function createTooltipShadowPlugin(
  styleService: SkyChartStyleService,
): Plugin {
  const plugins: Plugin = {
    id: 'sky_tooltip_shadow',
    beforeTooltipDraw: (chart) => {
      const tooltip = chart.tooltip;
      if (!tooltip || tooltip.opacity === 0) {
        return;
      }

      // Get styles at runtime to ensure colors are up to date with current theme
      const styles = styleService.styles();

      const ctx = chart.ctx;
      const { x, y, width, height } = tooltip;
      const borderRadius = styles.tooltip.cornerRadius;

      ctx.save();

      // Temporarily disable clipping to allow shadow to extend beyond tooltip bounds
      ctx.globalCompositeOperation = 'destination-over';

      ctx.fillStyle = styles.tooltip.backgroundColor;
      ctx.shadowColor = styles.tooltip.shadow.color;
      ctx.shadowBlur = styles.tooltip.shadow.blur;
      ctx.shadowOffsetX = styles.tooltip.shadow.offsetX;
      ctx.shadowOffsetY = styles.tooltip.shadow.offsetY;

      ctx.beginPath();
      ctx.roundRect(x, y, width, height, borderRadius);
      ctx.fill();

      ctx.restore();
    },
  };

  return plugins;
}
