import type { SkyLiveAnnouncerService } from '@skyux/core';
import type { SkyLibResourcesService } from '@skyux/i18n';

import type { ActiveElement, Chart } from 'chart.js';
import { of } from 'rxjs';

import { focusedElementsState } from '../plugin-state/focused-elements-state';

import { createKeyboardNavPlugin } from './keyboard-nav-plugin';

describe('createKeyboardNavPlugin', () => {
  describe('plugin identity', () => {
    it('should have the correct plugin id', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );

      expect(plugin.id).toBe('sky_keyboard_nav');
    });
  });

  describe('afterInit / afterDestroy', () => {
    it('should not throw on afterInit', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart } = createMockChart();

      expect(() => plugin.afterInit?.(chart, {}, {})).not.toThrow();
    });

    it('should remove event listeners on afterDestroy', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, removeEventListenerSpy } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      plugin.afterDestroy?.(chart, {}, {});

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(5);
    });

    it('should not throw on afterDestroy without a prior afterInit', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart } = createMockChart();

      expect(() => plugin.afterDestroy?.(chart, {}, {})).not.toThrow();
    });

    it('should clean up focused elements state on afterDestroy', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      focusedElementsState.set(chart, []);
      plugin.afterDestroy?.(chart, {}, {});

      expect(focusedElementsState.has(chart)).toBeFalse();
    });
  });

  describe('keyboard focus navigation', () => {
    it('should start navigation and focus first element when chart receives keyboard focus', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, tooltipSetActiveElements, chartUpdate } =
        createMockChart();

      plugin.afterInit?.(chart, {}, {});

      dispatchEvent(new FocusEvent('focus'));

      expect(tooltipSetActiveElements).toHaveBeenCalled();
      expect(chartUpdate).toHaveBeenCalledWith('none');
    });

    it('should not start navigation on focus when triggered by mouse click', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart();

      plugin.afterInit?.(chart, {}, {});

      // Simulate mouse-triggered focus: mousedown then focus.
      dispatchEvent(new MouseEvent('mousedown'));
      chartUpdate.calls.reset();
      dispatchEvent(new FocusEvent('focus'));

      expect(chartUpdate).not.toHaveBeenCalled();
    });

    it('should navigate right with ArrowRight key when already navigating', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));

      const state = focusedElementsState.get(chart);
      const initialIndex = state?.[0]?.index ?? 0;

      dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      const newState = focusedElementsState.get(chart);
      expect(newState?.[0]?.index ?? 0).toBe(initialIndex + 1);
    });

    it('should start navigation with ArrowRight key even when not yet navigating', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart();

      plugin.afterInit?.(chart, {}, {});

      dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(chartUpdate).toHaveBeenCalledWith('none');
    });

    it('should end navigation on Tab key', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));
      chartUpdate.calls.reset();

      dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

      expect(chartUpdate).toHaveBeenCalledWith('none');
      expect(focusedElementsState.get(chart)).toEqual([]);
    });

    it('should end navigation on Escape key', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));
      chartUpdate.calls.reset();

      dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(chartUpdate).toHaveBeenCalledWith('none');
      expect(focusedElementsState.get(chart)).toEqual([]);
    });

    it('should end navigation on blur', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));
      chartUpdate.calls.reset();

      dispatchEvent(new FocusEvent('blur'));

      expect(chartUpdate).toHaveBeenCalledWith('none');
      expect(focusedElementsState.get(chart)).toEqual([]);
    });

    it('should end navigation on mousedown', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));
      chartUpdate.calls.reset();

      dispatchEvent(new MouseEvent('mousedown'));

      expect(chartUpdate).toHaveBeenCalledWith('none');
    });

    it('should trigger onClick when Enter is pressed on a focused element', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, onClickSpy } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));

      dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(onClickSpy).toHaveBeenCalled();
    });

    it('should trigger onClick when Space is pressed on a focused element', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, onClickSpy } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));

      dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));

      expect(onClickSpy).toHaveBeenCalled();
    });

    it('should not trigger onClick when Enter keyup fires outside navigation', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, onClickSpy } = createMockChart();

      plugin.afterInit?.(chart, {}, {});

      dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it('should announce position on navigation', () => {
      const liveAnnouncer = createMockLiveAnnouncer();
      const plugin = createKeyboardNavPlugin(
        createMockResources('position announced'),
        liveAnnouncer,
      );
      const { chart, dispatchEvent } = createMockChart();

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));

      expect(liveAnnouncer.announce).toHaveBeenCalledWith('position announced');
    });

    it('should use custom valueLabel callback when provided', () => {
      const liveAnnouncer = createMockLiveAnnouncer();
      const resources = createMockResources();
      const plugin = createKeyboardNavPlugin(resources, liveAnnouncer);
      const valueLabel = jasmine
        .createSpy('valueLabel')
        .and.returnValue('$100');
      const { chart, dispatchEvent } = createMockChart();

      plugin.afterInit?.(chart, {}, { valueLabel });
      dispatchEvent(new FocusEvent('focus'));

      expect(valueLabel).toHaveBeenCalledWith(0, 0);
    });

    it('should use multi-series resource string when chart has multiple datasets', () => {
      const resources = createMockResources();
      const plugin = createKeyboardNavPlugin(
        resources,
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent } = createMockChart({
        datasets: [
          { data: [1, 2, 3], label: 'Series A' },
          { data: [4, 5, 6], label: 'Series B' },
        ],
      });

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));

      expect(resources.getString).toHaveBeenCalledWith(
        'chart.focus_element.multi_series.description',
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
      );
    });

    it('should use single-series resource string when chart has one dataset', () => {
      const resources = createMockResources();
      const plugin = createKeyboardNavPlugin(
        resources,
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent } = createMockChart({
        datasets: [{ data: [1, 2, 3], label: 'Only Series' }],
      });

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));

      expect(resources.getString).toHaveBeenCalledWith(
        'chart.focus_element.single_series.description',
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything(),
      );
    });

    it('should handle charts with no visible datasets gracefully', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart({
        datasets: [{ data: [1, 2], label: 'Hidden', hidden: true }],
      });

      plugin.afterInit?.(chart, {}, {});

      expect(() => dispatchEvent(new FocusEvent('focus'))).not.toThrow();
      expect(chartUpdate).not.toHaveBeenCalled();
    });

    it('should not update chart when ArrowKey is pressed with no focusable elements', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart({
        datasets: [{ data: [1, 2], label: 'Hidden', hidden: true }],
      });

      plugin.afterInit?.(chart, {}, {});

      // ArrowKey triggers #startNavigation (no element found) then #navigate guard fires
      dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(chartUpdate).not.toHaveBeenCalled();
    });

    it('should not trigger onClick when Enter is activated with no focused element', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, onClickSpy } = createMockChart({
        datasets: [{ data: [1, 2], label: 'Hidden', hidden: true }],
      });

      plugin.afterInit?.(chart, {}, {});
      // Start navigation without finding an element
      dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      // Attempt activation — #handleActivation guard fires
      dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(onClickSpy).not.toHaveBeenCalled();
    });

    it('should not call onClick when the chart element cannot be found in metadata', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      // Dataset has data but getDatasetMeta returns empty data array (unrendered chart)
      const { canvas, dispatchEvent, removeEventListenerSpy } =
        createMockCanvas();
      const onClickSpy = jasmine.createSpy('onClick');
      const chart = {
        canvas,
        config: {
          type: 'bar',
          options: { indexAxis: 'x', onClick: onClickSpy },
        },
        data: {
          datasets: [{ data: [1, 2, 3], label: 'S' }],
          labels: ['A', 'B', 'C'],
        },
        tooltip: { setActiveElements: jasmine.createSpy('setActiveElements') },
        update: jasmine.createSpy('update'),
        getDatasetMeta: jasmine
          .createSpy('getDatasetMeta')
          .and.returnValue({ hidden: false, data: [] }),
        isDatasetVisible: jasmine
          .createSpy('isDatasetVisible')
          .and.returnValue(true),
      } as unknown as Chart;

      plugin.afterInit?.(chart, {}, {});
      dispatchEvent(new FocusEvent('focus'));
      // Enter activation: #getActiveElement returns null, onClick is NOT called
      dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(onClickSpy).not.toHaveBeenCalled();

      // Clean up unused spy reference
      void removeEventListenerSpy;
    });

    it('should ignore non-navigation keys when not navigating', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart();

      plugin.afterInit?.(chart, {}, {});

      dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

      expect(chartUpdate).not.toHaveBeenCalled();
    });

    it('should not navigate on Escape key when not navigating', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const { chart, dispatchEvent, chartUpdate } = createMockChart();

      plugin.afterInit?.(chart, {}, {});

      // Escape when not navigating should not crash or update chart.
      expect(() =>
        dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })),
      ).not.toThrow();
      expect(chartUpdate).not.toHaveBeenCalled();
    });
  });

  describe('multiple chart instances', () => {
    it('should manage navigation state independently for each chart', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const mock1 = createMockChart();
      const mock2 = createMockChart();

      plugin.afterInit?.(mock1.chart, {}, {});
      plugin.afterInit?.(mock2.chart, {}, {});

      mock1.dispatchEvent(new FocusEvent('focus'));
      mock1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      // Chart 2 should be unaffected.
      expect(focusedElementsState.get(mock2.chart)).toBeUndefined();
    });

    it('should destroy each chart manager independently', () => {
      const plugin = createKeyboardNavPlugin(
        createMockResources(),
        createMockLiveAnnouncer(),
      );
      const mock1 = createMockChart();
      const mock2 = createMockChart();

      plugin.afterInit?.(mock1.chart, {}, {});
      plugin.afterInit?.(mock2.chart, {}, {});
      plugin.afterDestroy?.(mock1.chart, {}, {});

      expect(mock1.removeEventListenerSpy).toHaveBeenCalledTimes(5);
      expect(mock2.removeEventListenerSpy).not.toHaveBeenCalled();
    });
  });
});

// #region Test Helpers
function createMockDataElement(): ActiveElement['element'] {
  return {} as ActiveElement['element'];
}

function createMockCanvas(): {
  canvas: HTMLCanvasElement;
  dispatchEvent: (event: Event) => void;
  removeEventListenerSpy: jasmine.Spy;
} {
  const listeners = new Map<string, EventListener[]>();
  const removeEventListenerSpy = jasmine.createSpy('removeEventListener');
  const canvas = {
    style: { cursor: '' },
    tabIndex: 0,
    addEventListener: (event: string, handler: EventListener): void => {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event)?.push(handler);
    },
    removeEventListener: removeEventListenerSpy,
    dispatchEvent(event: Event): void {
      const handlers = listeners.get(event.type) ?? [];
      handlers.forEach((h) => h(event));
    },
  } as unknown as HTMLCanvasElement;

  return {
    canvas,
    dispatchEvent: canvas.dispatchEvent.bind(canvas),
    removeEventListenerSpy,
  };
}

interface MockChart {
  chart: Chart;
  canvas: HTMLCanvasElement;
  dispatchEvent: (event: Event) => void;
  tooltipSetActiveElements: jasmine.Spy;
  chartUpdate: jasmine.Spy;
  onClickSpy: jasmine.Spy;
  removeEventListenerSpy: jasmine.Spy;
}

function createMockChart(
  options: {
    datasets?: { data: unknown[]; label?: string; hidden?: boolean }[];
    labels?: string[];
    type?: string;
    onClick?: jasmine.Spy;
  } = {},
): MockChart {
  const datasets = options.datasets ?? [{ data: [1, 2, 3], label: 'Series A' }];
  const labels = options.labels ?? ['Cat 1', 'Cat 2', 'Cat 3'];
  const type = options.type ?? 'bar';

  const { canvas, dispatchEvent, removeEventListenerSpy } = createMockCanvas();
  const tooltipSetActiveElements = jasmine.createSpy('setActiveElements');
  const chartUpdate = jasmine.createSpy('update');
  const onClickSpy = options.onClick ?? jasmine.createSpy('onClick');

  const getDatasetMeta = jasmine
    .createSpy('getDatasetMeta')
    .and.callFake((i: number) => ({
      hidden: datasets[i]?.hidden ?? false,
      data: datasets[i]?.data.map(() => createMockDataElement()) ?? [],
    }));

  const isDatasetVisible = jasmine
    .createSpy('isDatasetVisible')
    .and.callFake((i: number) => !datasets[i]?.hidden);

  const chart = {
    canvas,
    config: {
      type,
      options: {
        indexAxis: 'x',
        onClick: onClickSpy,
      },
    },
    data: { datasets, labels },
    tooltip: { setActiveElements: tooltipSetActiveElements },
    update: chartUpdate,
    getDatasetMeta,
    isDatasetVisible,
  } as unknown as Chart;

  return {
    chart,
    canvas,
    dispatchEvent,
    tooltipSetActiveElements,
    chartUpdate,
    onClickSpy,
    removeEventListenerSpy,
  };
}

function createMockResources(message = 'announced'): SkyLibResourcesService {
  return {
    getString: jasmine.createSpy('getString').and.returnValue(of(message)),
  } as unknown as SkyLibResourcesService;
}

function createMockLiveAnnouncer(): SkyLiveAnnouncerService {
  return {
    announce: jasmine.createSpy('announce'),
  } as unknown as SkyLiveAnnouncerService;
}
// #endregion
