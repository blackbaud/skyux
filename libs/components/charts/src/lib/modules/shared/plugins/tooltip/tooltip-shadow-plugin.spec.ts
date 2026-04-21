import { Chart, type ChartType, Plugin, type TooltipModel } from 'chart.js';

import {
  SkyChartStyleService,
  SkyChartStyles,
} from '../../services/chart-style.service';

import { createTooltipShadowPlugin } from './tooltip-shadow-plugin';

describe('createTooltipShadowPlugin', () => {
  function setupTest(
    tooltipStyleOverrides: Partial<SkyChartStyles['tooltip']> = {},
  ): {
    plugin: Plugin;
    styleService: SkyChartStyleService;
  } {
    const styleService = createMockStyleService(tooltipStyleOverrides);
    const plugin = createTooltipShadowPlugin(styleService);
    return { plugin, styleService };
  }

  describe('plugin identity', () => {
    it('should have the correct plugin id', () => {
      const { plugin } = setupTest();
      expect(plugin.id).toBe('sky_tooltip_shadow');
    });
  });

  describe('beforeTooltipDraw', () => {
    it('should not draw when tooltip is not present', () => {
      const { plugin } = setupTest();
      const { chart, ctx } = createMockChart(null);

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should not draw when tooltip opacity is 0', () => {
      const { plugin } = setupTest();
      const { chart, ctx } = createMockChart({
        opacity: 0,
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      });

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should save and restore the canvas context when drawing', () => {
      const { plugin } = setupTest();
      const { chart, ctx } = createMockChart({
        opacity: 1,
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      });

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });

    it('should set composite operation to "destination-over"', () => {
      const { plugin } = setupTest();
      const { chart, ctx } = createMockChart({
        opacity: 1,
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      });

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      expect(ctx.globalCompositeOperation).toBe('destination-over');
    });

    it('should apply the tooltip background color to fillStyle', () => {
      const backgroundColor = '#f0f0f0';
      const { plugin } = setupTest({ backgroundColor });
      const { chart, ctx } = createMockChart({
        opacity: 1,
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      });

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      expect(ctx.fillStyle).toBe(backgroundColor);
    });

    it('should apply shadow styles from the style service', () => {
      const shadow = {
        color: 'rgba(10, 20, 30, 0.6)',
        blur: 8,
        offsetX: 2,
        offsetY: 4,
      };
      const { plugin } = setupTest({ shadow });
      const { chart, ctx } = createMockChart({
        opacity: 1,
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      });

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      expect(ctx.shadowColor).toBe(shadow.color);
      expect(ctx.shadowBlur).toBe(shadow.blur);
      expect(ctx.shadowOffsetX).toBe(shadow.offsetX);
      expect(ctx.shadowOffsetY).toBe(shadow.offsetY);
    });

    it('should call roundRect with tooltip bounds and corner radius', () => {
      const cornerRadius = 6;
      const { plugin } = setupTest({ cornerRadius });
      const { chart, ctx } = createMockChart({
        opacity: 1,
        x: 15,
        y: 25,
        width: 120,
        height: 60,
      });

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      expect(ctx.roundRect).toHaveBeenCalledWith(15, 25, 120, 60, cornerRadius);
    });

    it('should call beginPath and fill when drawing the shadow', () => {
      const { plugin } = setupTest();
      const { chart, ctx } = createMockChart({
        opacity: 1,
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      });

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should read styles from the service on every draw call', () => {
      const { plugin, styleService } = setupTest();
      const { chart } = createMockChart({
        opacity: 1,
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      });

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      plugin.beforeTooltipDraw?.(chart, beforeTooltipDrawArgs, {});

      expect(styleService.styles).toHaveBeenCalledTimes(2);
    });
  });
});

// #region Test Helpers
const beforeTooltipDrawArgs = {
  tooltip: {} as TooltipModel<ChartType>,
  cancelable: true,
} as const;

interface MockCtx {
  save: jasmine.Spy;
  restore: jasmine.Spy;
  beginPath: jasmine.Spy;
  fill: jasmine.Spy;
  roundRect: jasmine.Spy;
  globalCompositeOperation: string;
  fillStyle: string;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

function createMockChart(
  tooltip: {
    opacity: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null,
): { chart: Chart; ctx: MockCtx } {
  const ctx: MockCtx = {
    save: jasmine.createSpy('save'),
    restore: jasmine.createSpy('restore'),
    beginPath: jasmine.createSpy('beginPath'),
    fill: jasmine.createSpy('fill'),
    roundRect: jasmine.createSpy('roundRect'),
    globalCompositeOperation: '',
    fillStyle: '',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  };

  return {
    chart: { ctx, tooltip } as unknown as Chart,
    ctx,
  };
}

function createMockStyleService(
  tooltipOverrides: Partial<SkyChartStyles['tooltip']> = {},
): SkyChartStyleService {
  const defaultTooltip: Pick<
    SkyChartStyles['tooltip'],
    'backgroundColor' | 'cornerRadius' | 'shadow'
  > = {
    backgroundColor: '#ffffff',
    cornerRadius: 4,
    shadow: { color: 'rgba(0,0,0,0.15)', blur: 4, offsetX: 1, offsetY: 2 },
  };

  return {
    styles: jasmine.createSpy('styles').and.returnValue({
      tooltip: { ...defaultTooltip, ...tooltipOverrides },
    }),
  } as unknown as SkyChartStyleService;
}
// #endregion
