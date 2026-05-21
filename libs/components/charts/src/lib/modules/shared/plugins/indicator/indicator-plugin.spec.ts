import { ActiveElement, Chart, PointElement } from 'chart.js';

import type {
  SkyChartIndicatorStateStyles,
  SkyChartStyleService,
  SkyChartStyles,
} from '../../services/chart-style.service';
import { focusedElementsState } from '../plugin-state/focused-elements-state';

import { createIndicatorPlugin } from './indicator-plugin';

describe('createIndicatorPlugin', () => {
  describe('plugin identity', () => {
    it('should have the correct plugin id', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());

      expect(plugin.id).toBe('sky_indicator');
    });
  });

  describe('afterInit', () => {
    it('should register all required event listeners on the canvas', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas } = createMockChart();

      plugin.afterInit?.(chart, {}, {});

      const registeredEvents = canvas.addEventListener.calls
        .allArgs()
        .map((args) => args[0] as string);

      expect(registeredEvents).toContain('pointerdown');
      expect(registeredEvents).toContain('pointerup');
      expect(registeredEvents).toContain('pointerleave');
      expect(registeredEvents).toContain('pointercancel');
      expect(registeredEvents).toContain('keydown');
      expect(registeredEvents).toContain('keyup');
      expect(registeredEvents).toContain('blur');
    });
  });

  describe('afterDestroy', () => {
    it('should remove all registered event listeners from the canvas', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      const listenerCount = canvas.addEventListener.calls.count();

      plugin.afterDestroy?.(chart, {}, {});

      expect(canvas.removeEventListener).toHaveBeenCalledTimes(listenerCount);
    });

    it('should not throw when called without a prior afterInit', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart } = createMockChart();

      expect(() => plugin.afterDestroy?.(chart, {}, {})).not.toThrow();
    });
  });

  describe('afterEvent', () => {
    it('should set cursor to pointer when hovering over a clickable element', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, getActiveElements } = createMockChart();
      const element = createMockPointElement(100, 100);

      getActiveElements.and.returnValue([element]);

      plugin.afterEvent?.(
        chart,
        {
          event: { type: 'mousemove' },
          inChartArea: true,
          changed: false,
        } as never,
        { dataPointsClickEnabled: true },
      );

      expect(canvas.style.cursor).toBe('pointer');
    });

    it('should set cursor to default when hovering but data points are not clickable', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);

      plugin.afterEvent?.(
        chart,
        {
          event: { type: 'mousemove' },
          inChartArea: true,
          changed: false,
        } as never,
        { dataPointsClickEnabled: false },
      );

      expect(canvas.style.cursor).toBe('default');
    });

    it('should set cursor to default when no elements are hovered', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas } = createMockChart();

      plugin.afterEvent?.(
        chart,
        {
          event: { type: 'mousemove' },
          inChartArea: true,
          changed: false,
        } as never,
        { dataPointsClickEnabled: true },
      );

      expect(canvas.style.cursor).toBe('default');
    });

    it('should not change the cursor for non-mousemove events', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas } = createMockChart();
      canvas.style.cursor = 'pointer';

      plugin.afterEvent?.(
        chart,
        {
          event: { type: 'click' },
          inChartArea: true,
          changed: false,
        } as never,
        { dataPointsClickEnabled: true },
      );

      expect(canvas.style.cursor).toBe('pointer');
    });
  });

  describe('pointer pressed state', () => {
    it('should set pressed elements and redraw on pointerdown with active elements', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new PointerEvent('pointerdown'));

      expect(draw).toHaveBeenCalled();
    });

    it('should not redraw on pointerdown when no elements are active', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw } = createMockChart();

      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new PointerEvent('pointerdown'));

      expect(draw).not.toHaveBeenCalled();
    });

    it('should clear pressed state and redraw on pointerup', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new PointerEvent('pointerdown'));
      draw.calls.reset();

      canvas.dispatchEvent(new PointerEvent('pointerup'));

      expect(draw).toHaveBeenCalled();
    });

    it('should not redraw on pointerup when no pressed state exists', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw } = createMockChart();

      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new PointerEvent('pointerup'));

      expect(draw).not.toHaveBeenCalled();
    });

    it('should clear pressed state on pointerleave', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new PointerEvent('pointerdown'));
      draw.calls.reset();

      canvas.dispatchEvent(new PointerEvent('pointerleave'));

      expect(draw).toHaveBeenCalled();
    });

    it('should clear pressed state on pointercancel', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new PointerEvent('pointerdown'));
      draw.calls.reset();

      canvas.dispatchEvent(new PointerEvent('pointercancel'));

      expect(draw).toHaveBeenCalled();
    });
  });

  describe('keyboard pressed state', () => {
    it('should set pressed elements on keydown with the Space key', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(draw).toHaveBeenCalled();
    });

    it('should set pressed elements on keydown with the Enter key', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(draw).toHaveBeenCalled();
    });

    it('should not set pressed elements on keydown with non-activation keys', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      expect(draw).not.toHaveBeenCalled();
    });

    it('should not set pressed elements on repeated keydown events', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', repeat: true }),
      );

      expect(draw).not.toHaveBeenCalled();
    });

    it('should prefer focused elements over hovered elements on keydown', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();
      const focusedElement = createMockPointElement(200, 200);

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      focusedElementsState.set(chart, [focusedElement]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(draw).toHaveBeenCalled();

      focusedElementsState.delete(chart);
    });

    it('should clear pressed state on keyup with an activation key', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      draw.calls.reset();

      canvas.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));

      expect(draw).toHaveBeenCalled();
    });

    it('should not clear pressed state on keyup with non-activation keys', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      draw.calls.reset();

      canvas.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));

      expect(draw).not.toHaveBeenCalled();
    });

    it('should clear pressed state on blur', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, draw, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      canvas.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      draw.calls.reset();

      canvas.dispatchEvent(new FocusEvent('blur'));

      expect(draw).toHaveBeenCalled();
    });
  });

  describe('beforeDatasetsDraw', () => {
    it('should draw the hover indicator fill when elements are hovered and data points are clickable', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, ctx, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);

      plugin.beforeDatasetsDraw?.(chart, {} as never, {
        dataPointsClickEnabled: true,
      });

      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should not draw hover indicator when data points are not clickable', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, ctx, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);

      plugin.beforeDatasetsDraw?.(chart, {} as never, {
        dataPointsClickEnabled: false,
      });

      expect(ctx.fill).not.toHaveBeenCalled();
    });

    it('should draw the focus indicator fill when elements are in the focused state', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, ctx, getActiveElements } = createMockChart();
      const focusedElement = createMockPointElement(100, 100);

      getActiveElements.and.returnValue([]);
      focusedElementsState.set(chart, [focusedElement]);

      plugin.beforeDatasetsDraw?.(chart, {} as never, {
        dataPointsClickEnabled: false,
      });

      expect(ctx.fill).toHaveBeenCalled();

      focusedElementsState.delete(chart);
    });

    it('should not draw when there are no active or focused elements', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, ctx } = createMockChart();

      plugin.beforeDatasetsDraw?.(chart, {} as never, {
        dataPointsClickEnabled: true,
      });

      expect(ctx.fill).not.toHaveBeenCalled();
    });

    it('should draw the active indicator fill when pressed state is set', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, canvas, ctx, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);
      plugin.afterInit?.(chart, {}, {});

      // Set pressed state via pointerdown.
      canvas.dispatchEvent(new PointerEvent('pointerdown'));
      ctx.fill.calls.reset();

      plugin.beforeDatasetsDraw?.(chart, {} as never, {
        dataPointsClickEnabled: true,
      });

      // Both hover and active states draw, so fill is called twice.
      expect(ctx.fill).toHaveBeenCalledTimes(2);
    });
  });

  describe('afterDatasetsDraw', () => {
    it('should draw the hover indicator stroke when elements are hovered and data points are clickable', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, ctx, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);

      plugin.afterDatasetsDraw?.(
        chart,
        {} as never,
        { dataPointsClickEnabled: true },
        false,
      );

      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should not draw hover stroke when data points are not clickable', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, ctx, getActiveElements } = createMockChart();

      getActiveElements.and.returnValue([createMockPointElement(100, 100)]);

      plugin.afterDatasetsDraw?.(
        chart,
        {} as never,
        { dataPointsClickEnabled: false },
        false,
      );

      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should draw the focus indicator stroke when elements are in the focused state', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, ctx, getActiveElements } = createMockChart();
      const focusedElement = createMockPointElement(100, 100);

      getActiveElements.and.returnValue([]);
      focusedElementsState.set(chart, [focusedElement]);

      plugin.afterDatasetsDraw?.(
        chart,
        {} as never,
        { dataPointsClickEnabled: false },
        false,
      );

      expect(ctx.stroke).toHaveBeenCalled();

      focusedElementsState.delete(chart);
    });

    it('should not draw when there are no active or focused elements', () => {
      const plugin = createIndicatorPlugin(createMockStyleService());
      const { chart, ctx } = createMockChart();

      plugin.afterDatasetsDraw?.(
        chart,
        {} as never,
        { dataPointsClickEnabled: true },
        false,
      );

      expect(ctx.stroke).not.toHaveBeenCalled();
    });
  });
});

// #region Test Helpers
interface MockCtx {
  save: jasmine.Spy;
  restore: jasmine.Spy;
  beginPath: jasmine.Spy;
  closePath: jasmine.Spy;
  fill: jasmine.Spy;
  stroke: jasmine.Spy;
  arc: jasmine.Spy;
  roundRect: jasmine.Spy;
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
}

interface MockCanvas {
  style: { cursor: string };
  addEventListener: jasmine.Spy;
  removeEventListener: jasmine.Spy;
  dispatchEvent: (event: Event) => void;
}

function createMockCtx(): MockCtx {
  return {
    save: jasmine.createSpy('save'),
    restore: jasmine.createSpy('restore'),
    beginPath: jasmine.createSpy('beginPath'),
    closePath: jasmine.createSpy('closePath'),
    fill: jasmine.createSpy('fill'),
    stroke: jasmine.createSpy('stroke'),
    arc: jasmine.createSpy('arc'),
    roundRect: jasmine.createSpy('roundRect'),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  };
}

function createMockCanvas(): MockCanvas {
  const listeners = new Map<string, EventListener[]>();

  return {
    style: { cursor: '' },
    addEventListener: jasmine
      .createSpy('addEventListener')
      .and.callFake((event: string, handler: EventListener) => {
        if (!listeners.has(event)) {
          listeners.set(event, []);
        }
        listeners.get(event)?.push(handler);
      }),
    removeEventListener: jasmine.createSpy('removeEventListener'),
    dispatchEvent(event: Event): void {
      const handlers = listeners.get(event.type) ?? [];
      handlers.forEach((h) => h(event));
    },
  };
}

function createMockChart(): {
  chart: Chart;
  canvas: MockCanvas;
  ctx: MockCtx;
  draw: jasmine.Spy;
  getActiveElements: jasmine.Spy;
} {
  const canvas = createMockCanvas();
  const ctx = createMockCtx();
  const draw = jasmine.createSpy('draw');
  const getActiveElements = jasmine
    .createSpy('getActiveElements')
    .and.returnValue([]);

  const chart = {
    canvas,
    ctx,
    draw,
    getActiveElements,
    data: { datasets: [{ data: [1] }] },
    config: { type: 'line', options: {} },
    chartArea: {
      left: 0,
      top: 0,
      right: 400,
      bottom: 300,
      width: 400,
      height: 300,
    },
  } as unknown as Chart;

  return { chart, canvas, ctx, draw, getActiveElements };
}

function createMockPointElement(
  x: number,
  y: number,
  radius = 4,
): ActiveElement {
  return {
    element: {
      getProps: () => ({ x, y }),
      options: { radius },
    } as unknown as PointElement,
    datasetIndex: 0,
    index: 0,
  } as ActiveElement;
}

function createMockStyleService(): SkyChartStyleService {
  const stateStyles: SkyChartIndicatorStateStyles = {
    borderWidth: 1,
    borderColor: '#border',
    backgroundColor: '#bg',
  };
  const indicator: SkyChartStyles['indicator'] = {
    padding: 4,
    borderRadius: 3,
    hover: {
      ...stateStyles,
      borderColor: '#hover-border',
      backgroundColor: '#hover-bg',
    },
    active: {
      ...stateStyles,
      borderColor: '#active-border',
      backgroundColor: '#active-bg',
    },
    focus: {
      ...stateStyles,
      borderColor: '#focus-border',
      backgroundColor: '#focus-bg',
    },
  };

  return {
    styles: jasmine.createSpy('styles').and.returnValue({ indicator }),
  } as unknown as SkyChartStyleService;
}
// #endregion
