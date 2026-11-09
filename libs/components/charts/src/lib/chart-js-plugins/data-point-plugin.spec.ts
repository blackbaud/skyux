import { expect } from '@skyux-sdk/testing';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
} from 'chart.js';

import {
  getElementGeometry,
  type SkyChartJsDataPointIndex,
} from './data-point-geometry';
import {
  createDataPointPlugin,
  type SkyChartJsDataPointPlugin,
} from './data-point-plugin';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

// Each state gets a distinct border color so a ring's state is observable.
const RING_STYLES: Record<string, string> = {
  radius: '4px',
  'hover-border-width': '1px',
  'hover-border-color': '#ff0000',
  'hover-background-color': '#eeeeef',
  'focus-border-width': '2px',
  'focus-border-color': '#008000',
  'focus-background-color': 'transparent',
  'active-border-width': '3px',
  'active-border-color': '#0000ff',
  'active-background-color': 'transparent',
};

interface RingProbe {
  bounds: number[];
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
}

describe('Data point plugin', () => {
  let container: HTMLDivElement;
  let chart: Chart;
  let dataPointPlugin: SkyChartJsDataPointPlugin;
  let clickable: boolean;
  let onUpdate: jasmine.Spy;
  let onClick: jasmine.Spy;

  // Records each ring drawn on the canvas, with the styles it was filled and
  // stroked with. Chart.js itself never calls roundRect for bar charts, so
  // every call is a ring.
  function spyOnRings(): RingProbe[] {
    const rings: RingProbe[] = [];
    const proto = CanvasRenderingContext2D.prototype;
    const { roundRect, fill, stroke } = proto;
    let pending: RingProbe | undefined;

    spyOn(proto, 'roundRect').and.callFake(function (
      this: CanvasRenderingContext2D,
      ...args: Parameters<CanvasRenderingContext2D['roundRect']>
    ) {
      pending = { bounds: args.slice(0, 4) as number[] };
      rings.push(pending);
      roundRect.apply(this, args);
    });

    spyOn(proto, 'fill').and.callFake(function (
      this: CanvasRenderingContext2D,
      ...args: []
    ) {
      if (pending) {
        pending.fillStyle = String(this.fillStyle);
        pending = undefined;
      }

      fill.apply(this, args as unknown as [Path2D]);
    });

    spyOn(proto, 'stroke').and.callFake(function (
      this: CanvasRenderingContext2D,
      ...args: []
    ) {
      if (pending) {
        pending.strokeStyle = String(this.strokeStyle);
        pending.lineWidth = this.lineWidth;
        pending = undefined;
      }

      stroke.apply(this, args as unknown as [Path2D]);
    });

    return rings;
  }

  function getCenter(dataPoint: SkyChartJsDataPointIndex): {
    x: number;
    y: number;
  } {
    const bounds = getElementGeometry(
      chart.getDatasetMeta(dataPoint.datasetIndex).data[dataPoint.index],
    );

    return {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    };
  }

  // Chart.js only reports pointer events inside the plot area, and the
  // top-left corner of this chart's plot area is empty.
  function getEmptyPlotPosition(): { x: number; y: number } {
    return { x: chart.chartArea.left + 2, y: chart.chartArea.top + 2 };
  }

  // Chart.js throttles canvas events to the next animation frame.
  async function dispatchCanvasEvent(
    type: 'click' | 'mousemove' | 'mouseout' | 'pointerdown' | 'pointerup',
    position = { x: 0, y: 0 },
  ): Promise<void> {
    const rect = chart.canvas.getBoundingClientRect();

    chart.canvas.dispatchEvent(
      new MouseEvent(type, {
        bubbles: true,
        clientX: rect.left + position.x,
        clientY: rect.top + position.y,
      }),
    );

    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  async function hover(dataPoint: SkyChartJsDataPointIndex): Promise<void> {
    await dispatchCanvasEvent('mousemove', getCenter(dataPoint));
  }

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '300px';

    for (const [name, value] of Object.entries(RING_STYLES)) {
      container.style.setProperty(`--sky-chart-data-point-ring-${name}`, value);
    }

    document.body.appendChild(container);

    clickable = true;
    onUpdate = jasmine.createSpy('onUpdate');
    onClick = jasmine.createSpy('onClick');
    dataPointPlugin = createDataPointPlugin({
      isClickable: () => clickable,
      onUpdate,
      onClick,
    });

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['a', 'b', 'c'],
        datasets: [{ label: 'First', data: [1, 2, 3] }],
      },
      options: {
        animation: false,
        maintainAspectRatio: false,
        events: ['mousemove', 'mouseout', 'click', 'pointerdown', 'pointerup'],
      },
      plugins: [dataPointPlugin.plugin],
    });
  });

  afterEach(() => {
    chart.destroy();
    container.remove();
  });

  it('should report each layout', () => {
    expect(onUpdate).toHaveBeenCalledWith(chart);

    onUpdate.calls.reset();
    chart.update();

    expect(onUpdate).toHaveBeenCalledOnceWith(chart);
  });

  describe('focus', () => {
    it('should show the tooltip for the focused data point', () => {
      dataPointPlugin.setFocusedDataPoint({ datasetIndex: 0, index: 1 });

      expect(chart.tooltip?.getActiveElements()).toEqual([
        jasmine.objectContaining({ datasetIndex: 0, index: 1 }),
      ]);
      expect(chart.getActiveElements()).toEqual([
        jasmine.objectContaining({ datasetIndex: 0, index: 1 }),
      ]);
    });

    it('should list every series in the tooltip when the tooltip is shared, like a hover', () => {
      chart.data.datasets.push({ label: 'Second', data: [4, 5, 6] });
      chart.options.plugins = { tooltip: { mode: 'index', intersect: false } };
      chart.update();

      dataPointPlugin.setFocusedDataPoint({ datasetIndex: 0, index: 1 });

      expect(chart.tooltip?.getActiveElements()).toEqual([
        jasmine.objectContaining({ datasetIndex: 0, index: 1 }),
        jasmine.objectContaining({ datasetIndex: 1, index: 1 }),
      ]);
      // The default hover mode highlights only the data point itself.
      expect(chart.getActiveElements()).toEqual([
        jasmine.objectContaining({ datasetIndex: 0, index: 1 }),
      ]);
    });

    it('should highlight every series at the category when hovering does', () => {
      chart.data.datasets.push({ label: 'Second', data: [4, 5, 6] });
      chart.options.hover = { mode: 'index', intersect: false };
      chart.update();

      dataPointPlugin.setFocusedDataPoint({ datasetIndex: 1, index: 2 });

      expect(chart.getActiveElements()).toEqual([
        jasmine.objectContaining({ datasetIndex: 0, index: 2 }),
        jasmine.objectContaining({ datasetIndex: 1, index: 2 }),
      ]);
    });

    it('should draw a focus ring just outside the focused data point', () => {
      const rings = spyOnRings();
      const bounds = getElementGeometry(chart.getDatasetMeta(0).data[1]);

      dataPointPlugin.setFocusedDataPoint({ datasetIndex: 0, index: 1 });

      const ring = rings[rings.length - 1];

      expect(ring.bounds[0]).toBeCloseTo(bounds.left - 2, 5);
      expect(ring.bounds[1]).toBeCloseTo(bounds.top - 2, 5);
      expect(ring.bounds[2]).toBeCloseTo(bounds.width + 4, 5);
      expect(ring.bounds[3]).toBeCloseTo(bounds.height + 4, 5);
      expect(ring.strokeStyle).toBe('#008000');
      expect(ring.lineWidth).toBe(2);
    });

    it('should draw rings before the tooltip so the tooltip covers them', () => {
      const drawOrder: string[] = [];
      const { roundRect } = CanvasRenderingContext2D.prototype;

      spyOn(CanvasRenderingContext2D.prototype, 'roundRect').and.callFake(
        function (
          this: CanvasRenderingContext2D,
          ...args: Parameters<CanvasRenderingContext2D['roundRect']>
        ) {
          drawOrder.push('ring');
          roundRect.apply(this, args);
        },
      );
      spyOn(
        chart.tooltip as unknown as { draw: () => void },
        'draw',
      ).and.callFake(() => drawOrder.push('tooltip'));

      dataPointPlugin.setFocusedDataPoint({ datasetIndex: 0, index: 1 });

      // The ring's background and border, then the tooltip.
      expect(drawOrder).toEqual(['ring', 'ring', 'tooltip']);
    });

    it('should clear the tooltip and focus ring when focus is cleared', () => {
      dataPointPlugin.setFocusedDataPoint({ datasetIndex: 0, index: 1 });

      const rings = spyOnRings();
      dataPointPlugin.setFocusedDataPoint(undefined);

      expect(chart.tooltip?.getActiveElements()).toEqual([]);
      expect(rings).toEqual([]);
    });

    it('should not draw a ring for a focused data point that was removed', () => {
      dataPointPlugin.setFocusedDataPoint({ datasetIndex: 0, index: 2 });

      const rings = spyOnRings();
      chart.data.datasets[0].data = [1, 2];
      chart.update();

      expect(rings).toEqual([]);
    });
  });

  describe('hover', () => {
    it('should draw a hover ring with a background around the hovered data point', async () => {
      const rings = spyOnRings();

      await hover({ datasetIndex: 0, index: 1 });

      expect(rings).toEqual([
        jasmine.objectContaining({ fillStyle: '#eeeeef' }),
        jasmine.objectContaining({ strokeStyle: '#ff0000', lineWidth: 1 }),
      ]);
    });

    it('should stop drawing the hover ring when the pointer leaves the data point', async () => {
      await hover({ datasetIndex: 0, index: 1 });

      const rings = spyOnRings();
      await dispatchCanvasEvent('mousemove', getEmptyPlotPosition());

      expect(rings).toEqual([]);
    });

    it('should stop drawing the hover ring when the pointer leaves the canvas', async () => {
      await hover({ datasetIndex: 0, index: 1 });

      const rings = spyOnRings();
      await dispatchCanvasEvent('mouseout');

      expect(rings).toEqual([]);
    });

    it('should draw only the focus ring when the focused data point is hovered', async () => {
      dataPointPlugin.setFocusedDataPoint({ datasetIndex: 0, index: 1 });

      const rings = spyOnRings();
      await hover({ datasetIndex: 0, index: 1 });

      expect(rings).toEqual([
        jasmine.objectContaining({ fillStyle: 'rgba(0, 0, 0, 0)' }),
        jasmine.objectContaining({ strokeStyle: '#008000' }),
      ]);
    });

    it('should draw an active ring while a hovered data point is pressed', async () => {
      await hover({ datasetIndex: 0, index: 1 });

      const center = getCenter({ datasetIndex: 0, index: 1 });
      const rings = spyOnRings();
      await dispatchCanvasEvent('pointerdown', center);

      expect(rings).toEqual([
        jasmine.objectContaining({ fillStyle: 'rgba(0, 0, 0, 0)' }),
        jasmine.objectContaining({ strokeStyle: '#0000ff', lineWidth: 3 }),
      ]);

      rings.length = 0;
      await dispatchCanvasEvent('pointerup', center);

      expect(rings).toEqual([
        jasmine.objectContaining({ fillStyle: '#eeeeef' }),
        jasmine.objectContaining({ strokeStyle: '#ff0000' }),
      ]);
    });
  });

  describe('click', () => {
    it('should report the clicked data point', async () => {
      await dispatchCanvasEvent(
        'click',
        getCenter({ datasetIndex: 0, index: 1 }),
      );

      expect(onClick).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({ datasetIndex: 0, index: 1 }),
      );
    });

    it('should not report a click away from a data point', async () => {
      await dispatchCanvasEvent('click', getEmptyPlotPosition());

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should show a pointer cursor only over a clickable data point', async () => {
      await hover({ datasetIndex: 0, index: 1 });
      expect(chart.canvas.style.cursor).toBe('pointer');

      await dispatchCanvasEvent('mousemove', getEmptyPlotPosition());
      expect(chart.canvas.style.cursor).toBe('');

      clickable = false;
      await hover({ datasetIndex: 0, index: 1 });
      expect(chart.canvas.style.cursor).toBe('');
    });
  });
});
