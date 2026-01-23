import { Plugin } from 'chart.js';

import { SkyuxChartStyles } from './global-chart-config';

export function createTooltipPlugin(): Plugin {
  return {} as Plugin;
}

/**
 * Plugin to add box shadow and accent border to tooltips
 * @returns
 */
export function createTooltipShadowPlugin(): Plugin {
  const tooltipShadowPlugin: Plugin = {
    id: 'tooltipShadow',
    beforeTooltipDraw: (chart) => {
      const tooltip = chart.tooltip;
      if (!tooltip || tooltip.opacity === 0) return;

      const ctx = chart.ctx;
      const shadow = SkyuxChartStyles.tooltipShadow;

      // Get tooltip position and dimensions
      const { x, y, width, height } = tooltip;
      const borderRadius = 6;

      ctx.save();

      // Set shadow properties
      ctx.shadowColor = shadow.color;
      ctx.shadowBlur = shadow.blur;
      ctx.shadowOffsetX = shadow.offsetX;
      ctx.shadowOffsetY = shadow.offsetY;

      // Draw the main tooltip background with shadow
      // This will be underneath the Chart.js tooltip content
      ctx.fillStyle = SkyuxChartStyles.tooltipBackgroundColor;
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, borderRadius);
      ctx.fill();

      ctx.restore();
    },
    afterTooltipDraw: (chart) => {
      const tooltip = chart.tooltip;
      if (!tooltip || tooltip.opacity === 0) return;

      const ctx = chart.ctx;
      const accentColor = SkyuxChartStyles.tooltipAccentBorderColor;
      const accentWidth = SkyuxChartStyles.tooltipAccentBorderWidth;

      // Get tooltip position and dimensions
      const { x, y, width, height, caretX, caretY } = tooltip;
      const borderRadius = 6;

      ctx.save();

      // Draw colored caret (20px wide x 8px tall)
      const caretWidth = 20;
      // const caretHeight = 8;
      ctx.fillStyle = accentColor;
      ctx.beginPath();

      if (caretX < x) {
        // Caret on left side (pointing left)
        ctx.moveTo(caretX, caretY);
        ctx.lineTo(x, caretY - caretWidth / 2);
        ctx.lineTo(x, caretY + caretWidth / 2);
      } else if (caretX > x + width) {
        // Caret on right side (pointing right)
        ctx.moveTo(caretX, caretY);
        ctx.lineTo(x + width, caretY - caretWidth / 2);
        ctx.lineTo(x + width, caretY + caretWidth / 2);
      } else if (caretY < y) {
        // Caret on top (pointing up)
        ctx.moveTo(caretX, caretY);
        ctx.lineTo(caretX - caretWidth / 2, y);
        ctx.lineTo(caretX + caretWidth / 2, y);
      } else {
        // Caret on bottom (pointing down)
        ctx.moveTo(caretX, caretY);
        ctx.lineTo(caretX - caretWidth / 2, y + height);
        ctx.lineTo(caretX + caretWidth / 2, y + height);
      }

      ctx.closePath();
      ctx.fill();

      // Draw accent border as a straight line on the inside, only on the side with the caret
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = accentWidth;
      ctx.beginPath();

      const inset = accentWidth / 2;

      if (caretX < x) {
        // Caret on left - draw vertical line on left side
        ctx.moveTo(x + inset, y + borderRadius);
        ctx.lineTo(x + inset, y + height - borderRadius);
      } else if (caretX > x + width) {
        // Caret on right - draw vertical line on right side
        ctx.moveTo(x + width - inset, y + borderRadius);
        ctx.lineTo(x + width - inset, y + height - borderRadius);
      } else if (caretY < y) {
        // Caret on top - draw horizontal line on top side
        ctx.moveTo(x + borderRadius, y + inset);
        ctx.lineTo(x + width - borderRadius, y + inset);
      } else {
        // Caret on bottom - draw horizontal line on bottom side
        ctx.moveTo(x + borderRadius, y + height - inset);
        ctx.lineTo(x + width - borderRadius, y + height - inset);
      }

      ctx.stroke();
      ctx.restore();
    },
  };

  return tooltipShadowPlugin;
}
