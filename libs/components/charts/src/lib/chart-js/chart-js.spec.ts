import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { Chart, type ChartType } from 'chart.js';

import { type SkyChartTable } from '../chart-table/chart-table';
import { SkyChartTableService } from '../chart-table/chart-table-service';

import {
  SkyChartJs,
  type SkyChartJsConfig,
  type SkyChartJsDataPointIndex,
} from './chart-js';

@Component({
  imports: [SkyChartJs],
  styles: `
    sky-chart-js {
      width: 400px;
      height: 300px;
    }
  `,
  template: `
    <sky-chart-js
      [config]="config()"
      [dataPointsClickable]="clickable()"
      [seriesSummaryResourceKeys]="seriesSummaryResourceKeys"
      (dataPointClick)="clicks.push($event)"
    />
    <button type="button">Outside</button>
  `,
})
class TestComponent {
  public readonly clicks: SkyChartJsDataPointIndex[] = [];
  public readonly clickable = signal(true);
  public readonly seriesSummaryResourceKeys = {
    singular: 'skyux_charts.chart.bar.series_summary_singular',
    plural: 'skyux_charts.chart.bar.series_summary_plural',
  };
  public readonly config = signal<SkyChartJsConfig>(
    buildConfig([1, 2, 3], [4, null, 6]),
  );
}

function buildConfig(
  first: (number | null)[],
  second?: (number | null)[],
  overrides: { type?: ChartType; indexAxis?: 'x' | 'y'; hidden?: boolean } = {},
): SkyChartJsConfig {
  const datasets = [{ label: 'First', data: first }];

  if (second) {
    datasets.push({ label: 'Second', data: second });
  }

  return {
    type: overrides.type ?? 'bar',
    data: {
      labels: ['a', 'b', 'c'].slice(0, first.length),
      datasets: datasets.map((dataset, index) => ({
        ...dataset,
        hidden: index === 0 && overrides.hidden,
      })),
    },
    options: {
      animation: false,
      maintainAspectRatio: false,
      indexAxis: overrides.indexAxis,
    },
  } as SkyChartJsConfig;
}

// Chart.js's element types omit the bar geometry it sets at runtime.
type BarProbe = {
  x: number;
  y: number;
  base: number;
  width: number;
  height: number;
};

const TABLE: SkyChartTable = {
  categoryLabel: 'Letter',
  categories: ['a', 'b', 'c'],
  series: [
    { label: 'First', values: ['1', '2', '3'] },
    { label: 'Second', values: ['4', '', '6'] },
  ],
};

describe('Chart.js component', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let tableSvc: SkyChartTableService;
  let destroyed: boolean;

  function getCanvas(): HTMLCanvasElement {
    return fixture.nativeElement.querySelector('canvas');
  }

  function getChart(): Chart {
    return Chart.getChart(getCanvas()) as Chart;
  }

  function getDataPoints(): HTMLElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.sky-chart-js-data-point'),
    );
  }

  function getDataPoint(category: string, series: string): HTMLElement {
    return fixture.nativeElement.querySelector(
      `[data-sky-chart-category="${category}"][data-sky-chart-series="${series}"]`,
    );
  }

  function getFocusedDataPoint(): string | undefined {
    const focused = document.activeElement as HTMLElement;

    return focused.classList.contains('sky-chart-js-data-point')
      ? `${focused.dataset['skyChartCategory']}/${focused.dataset['skyChartSeries']}`
      : undefined;
  }

  function getTabStops(): string[] {
    return getDataPoints()
      .filter((dataPoint) => dataPoint.tabIndex === 0)
      .map(
        (dataPoint) =>
          `${dataPoint.dataset['skyChartCategory']}/${dataPoint.dataset['skyChartSeries']}`,
      );
  }

  function getSeriesGroups(): HTMLElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('[role="region"]'),
    );
  }

  function getCenter(element: HTMLElement): { x: number; y: number } {
    const bounds = getBounds(element);

    return {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    };
  }

  // Records each ring drawn on the canvas, with the styles it was filled and
  // stroked with. Chart.js itself never calls roundRect, so every call is a
  // ring.
  function spyOnRings(): {
    bounds: number[];
    fillStyle?: string;
    strokeStyle?: string;
    lineWidth?: number;
  }[] {
    const rings: ReturnType<typeof spyOnRings> = [];
    const proto = CanvasRenderingContext2D.prototype;
    const { roundRect, fill, stroke } = proto;
    let pending: ReturnType<typeof spyOnRings>[number] | undefined;

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

  function getBounds(element: HTMLElement): {
    left: number;
    top: number;
    width: number;
    height: number;
  } {
    return {
      left: parseFloat(element.style.left),
      top: parseFloat(element.style.top),
      width: parseFloat(element.style.width),
      height: parseFloat(element.style.height),
    };
  }

  function pressKey(element: HTMLElement, key: string): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    element.dispatchEvent(event);

    return event;
  }

  function getActiveTooltipElements(): SkyChartJsDataPointIndex[] {
    return getChart().tooltip?.getActiveElements() ?? [];
  }

  // Chart.js throttles canvas events to the next animation frame.
  async function dispatchCanvasEvent(
    type: 'click' | 'mousemove',
    x: number,
    y: number,
  ): Promise<void> {
    const rect = getCanvas().getBoundingClientRect();

    getCanvas().dispatchEvent(
      new MouseEvent(type, {
        bubbles: true,
        clientX: rect.left + x,
        clientY: rect.top + y,
      }),
    );

    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  // Data points are positioned after Chart.js lays out the chart, which
  // happens after the first render, so render once more to show them.
  // Chart.js only reports pointer events inside the plot area. The top-left
  // corner of these charts' plot area is empty.
  function getEmptyPlotPosition(): { x: number; y: number } {
    const { left, top } = getChart().chartArea;

    return { x: left + 2, y: top + 2 };
  }

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [SkyChartTableService],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    tableSvc = TestBed.inject(SkyChartTableService);
    tableSvc.table.set(TABLE);
    destroyed = false;
  });

  afterEach(() => {
    if (!destroyed) {
      fixture.destroy();
    }
  });

  it('should create a chart from the configuration', () => {
    fixture.detectChanges();

    expect(getChart().data.datasets[0].data).toEqual([1, 2, 3]);
  });

  it('should update the existing chart when the configuration changes', () => {
    fixture.detectChanges();

    const chart = getChart();
    component.config.set(buildConfig([3, 4, 5]));
    fixture.detectChanges();

    expect(getChart()).toBe(chart);
    expect(chart.data.datasets[0].data).toEqual([3, 4, 5]);
  });

  it('should destroy the chart when destroyed', () => {
    fixture.detectChanges();

    const canvas = getCanvas();
    expect(Chart.getChart(canvas)).toBeTruthy();

    fixture.destroy();
    destroyed = true;

    expect(Chart.getChart(canvas)).toBeUndefined();
  });

  describe('data points', () => {
    it('should render a data point for each plotted value, skipping gaps', async () => {
      await render();

      expect(
        getDataPoints().map((dataPoint) =>
          dataPoint.getAttribute('aria-label'),
        ),
      ).toEqual([
        'a, 1. First.',
        'b, 2. First.',
        'c, 3. First.',
        'a, 4. Second.',
        'c, 6. Second.',
      ]);
    });

    it('should skip hidden series', async () => {
      component.config.set(buildConfig([1, 2, 3], [4, 5, 6], { hidden: true }));
      await render();

      expect(getDataPoints().length).toBe(3);
      expect(getDataPoints()[0].getAttribute('aria-label')).toBe(
        'a, 4. Second.',
      );
    });

    it('should refresh the data point names when the table changes', async () => {
      await render();

      tableSvc.table.set({
        ...TABLE,
        series: [
          { label: 'Renamed', values: ['$1', '$2', '$3'] },
          TABLE.series[1],
        ],
      });
      await render();

      expect(getDataPoints()[0].getAttribute('aria-label')).toBe(
        'a, $1. Renamed.',
      );
    });

    it('should name data points from the chart alone before the table is published', async () => {
      tableSvc.table.set(undefined);
      await render();

      expect(getDataPoints()[0].getAttribute('aria-label')).toBe(', . .');
    });

    it('should position a data point over a vertical bar', async () => {
      await render();

      const bar = getChart().getDatasetMeta(0).data[1] as unknown as BarProbe;
      const bounds = getBounds(getDataPoint('b', 'First'));

      expect(bounds.left).toBeCloseTo(bar.x - bar.width / 2, 1);
      expect(bounds.top).toBeCloseTo(bar.y, 1);
      expect(bounds.width).toBeCloseTo(bar.width, 1);
      expect(bounds.height).toBeCloseTo(bar.base - bar.y, 1);
    });

    it('should position a data point over a horizontal bar', async () => {
      component.config.set(
        buildConfig([1, 2, 3], undefined, { indexAxis: 'y' }),
      );
      await render();

      const bar = getChart().getDatasetMeta(0).data[1] as unknown as BarProbe;
      const bounds = getBounds(getDataPoint('b', 'First'));

      expect(bounds.left).toBeCloseTo(bar.base, 1);
      expect(bounds.top).toBeCloseTo(bar.y - bar.height / 2, 1);
      expect(bounds.width).toBeCloseTo(bar.x - bar.base, 1);
      expect(bounds.height).toBeCloseTo(bar.height, 1);
    });

    it('should position a data point over a line point', async () => {
      component.config.set(buildConfig([1, 2, 3], undefined, { type: 'line' }));
      await render();

      const point = getChart().getDatasetMeta(0).data[1];
      const radius = (point.options as { hoverRadius: number }).hoverRadius;
      const bounds = getBounds(getDataPoint('b', 'First'));

      expect(bounds.left).toBeCloseTo(point.x - radius, 1);
      expect(bounds.top).toBeCloseTo(point.y - radius, 1);
      expect(bounds.width).toBeCloseTo(radius * 2, 1);
      expect(bounds.height).toBeCloseTo(radius * 2, 1);
    });

    it('should present data points as buttons when clickable, and as images otherwise', async () => {
      await render();

      expect(getDataPoints()[0].getAttribute('role')).toBe('button');

      component.clickable.set(false);
      await render();

      expect(getDataPoints()[0].getAttribute('role')).toBe('img');
    });
  });

  describe('series descriptions', () => {
    it('should describe each series as a region when there are multiple series', async () => {
      await render();

      expect(
        getSeriesGroups().map((group) => group.getAttribute('aria-label')),
      ).toEqual([
        'First, bar series 1 of 2 with 3 bars.',
        'Second, bar series 2 of 2 with 3 bars.',
      ]);
    });

    it('should use the singular description for a series with one value', async () => {
      component.config.set(buildConfig([1], [2]));
      await render();

      expect(getSeriesGroups()[0].getAttribute('aria-label')).toBe(
        'First, bar series 1 of 2 with 1 bar.',
      );
    });

    it('should not describe the series of a single-series chart', async () => {
      component.config.set(buildConfig([1, 2, 3]));
      await render();

      expect(getSeriesGroups()).toEqual([]);
      expect(getDataPoints().length).toBe(3);
    });
  });

  describe('keyboard navigation', () => {
    function press(key: string): KeyboardEvent {
      return pressKey(document.activeElement as HTMLElement, key);
    }

    it('should make the first data point the only tab stop', async () => {
      await render();

      expect(getTabStops()).toEqual(['a/First']);
    });

    it('should move through every series with the left and right arrow keys, wrapping at the ends', async () => {
      await render();

      getDataPoint('c', 'First').focus();

      expect(press('ArrowRight').defaultPrevented).toBeTrue();
      expect(getFocusedDataPoint()).toBe('a/Second');

      press('ArrowLeft');
      expect(getFocusedDataPoint()).toBe('c/First');

      getDataPoint('c', 'Second').focus();
      press('ArrowRight');
      expect(getFocusedDataPoint()).toBe('a/First');

      press('ArrowLeft');
      expect(getFocusedDataPoint()).toBe('c/Second');
    });

    it('should move to the previous series with ArrowDown and the next series with ArrowUp, like Highcharts', async () => {
      await render();

      getDataPoint('c', 'Second').focus();
      press('ArrowDown');
      expect(getFocusedDataPoint()).toBe('c/First');

      // Second has a gap at "b", so ArrowUp lands on its nearest point.
      getDataPoint('b', 'First').focus();
      press('ArrowUp');
      expect(getFocusedDataPoint()).toBe('a/Second');
    });

    it('should stay put when there is no series in the arrow direction', async () => {
      await render();

      getDataPoint('b', 'First').focus();

      expect(press('ArrowDown').defaultPrevented).toBeTrue();
      expect(getFocusedDataPoint()).toBe('b/First');
    });

    it('should move between series with Page Down and Page Up', async () => {
      await render();

      getDataPoint('a', 'First').focus();
      press('PageUp');
      expect(getFocusedDataPoint()).toBe('a/Second');

      press('PageDown');
      expect(getFocusedDataPoint()).toBe('a/First');
    });

    it('should move to the first and last data points with Home and End', async () => {
      await render();

      getDataPoint('b', 'First').focus();
      press('End');
      expect(getFocusedDataPoint()).toBe('c/Second');

      press('Home');
      expect(getFocusedDataPoint()).toBe('a/First');
    });

    it('should swap the arrow key pairs for a horizontal chart', async () => {
      component.config.set(
        buildConfig([1, 2, 3], [4, null, 6], { indexAxis: 'y' }),
      );
      await render();

      getDataPoint('a', 'First').focus();
      press('ArrowDown');
      expect(getFocusedDataPoint()).toBe('b/First');

      press('ArrowUp');
      press('ArrowUp');
      expect(getFocusedDataPoint()).toBe('c/Second');

      press('ArrowRight');
      expect(getFocusedDataPoint()).toBe('c/First');

      press('ArrowLeft');
      expect(getFocusedDataPoint()).toBe('c/Second');
    });

    it('should move a line chart to the nearest point above or below in any series', async () => {
      component.config.set(
        buildConfig([1, 2, 3], [4, null, 6], { type: 'line' }),
      );
      await render();

      getDataPoint('b', 'First').focus();
      press('ArrowUp');
      expect(getFocusedDataPoint()).toBe('c/First');

      getDataPoint('b', 'First').focus();
      press('ArrowDown');
      expect(getFocusedDataPoint()).toBe('a/First');
    });

    it('should make the focused data point the tab stop', async () => {
      await render();

      getDataPoint('b', 'First').focus();
      await render();

      expect(getTabStops()).toEqual(['b/First']);
    });

    it('should keep the tab stop when focus moves between data points', async () => {
      await render();

      getDataPoint('b', 'First').focus();
      getDataPoint('c', 'First').focus();
      await render();

      expect(getTabStops()).toEqual(['c/First']);
    });

    it('should reset the tab stop to the first data point when focus leaves the chart', async () => {
      await render();

      getDataPoint('b', 'First').focus();
      (fixture.nativeElement.querySelector('button') as HTMLElement).focus();
      await render();

      expect(getTabStops()).toEqual(['a/First']);
    });

    it('should ignore other keys, including Escape', async () => {
      await render();

      getDataPoints()[0].focus();

      expect(press('a').defaultPrevented).toBeFalse();
      expect(press('Escape').defaultPrevented).toBeFalse();
    });
  });

  describe('tooltip', () => {
    it('should show the tooltip for the focused data point', async () => {
      await render();

      getDataPoint('b', 'First').focus();

      expect(getActiveTooltipElements()).toEqual([
        jasmine.objectContaining({ datasetIndex: 0, index: 1 }),
      ]);
    });

    it('should hide the tooltip when a data point loses focus', async () => {
      await render();

      getDataPoint('b', 'First').focus();
      (fixture.nativeElement.querySelector('button') as HTMLElement).focus();

      expect(getActiveTooltipElements()).toEqual([]);
    });
  });

  describe('rings', () => {
    it('should draw a focus ring just outside the focused data point', async () => {
      await render();

      const rings = spyOnRings();
      const dataPoint = getDataPoint('b', 'First');
      const bounds = getBounds(dataPoint);
      dataPoint.focus();

      const ring = rings[rings.length - 1];

      expect(ring.bounds[0]).toBeCloseTo(bounds.left - 2, 1);
      expect(ring.bounds[1]).toBeCloseTo(bounds.top - 2, 1);
      expect(ring.bounds[2]).toBeCloseTo(bounds.width + 4, 1);
      expect(ring.bounds[3]).toBeCloseTo(bounds.height + 4, 1);
      expect(ring.lineWidth).toBe(2);
      expect(ring.strokeStyle).toBe('#0974a1');
    });

    it('should draw rings before the tooltip so the tooltip covers them', async () => {
      await render();

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
        getChart().tooltip as unknown as { draw: () => void },
        'draw',
      ).and.callFake(() => drawOrder.push('tooltip'));

      getDataPoint('b', 'First').focus();

      // Each frame draws the ring's background and border, then the tooltip.
      expect(drawOrder.length).toBeGreaterThan(0);
      expect(drawOrder.join()).toMatch(/^(ring,ring,tooltip,?)+$/);
    });

    it('should stop drawing the focus ring when the data point loses focus', async () => {
      await render();

      getDataPoint('b', 'First').focus();
      const rings = spyOnRings();
      (fixture.nativeElement.querySelector('button') as HTMLElement).focus();

      expect(rings).toEqual([]);
    });

    it('should draw a hover ring with a background around the hovered data point', async () => {
      await render();

      const rings = spyOnRings();
      const center = getCenter(getDataPoint('b', 'First'));
      await dispatchCanvasEvent('mousemove', center.x, center.y);

      expect(rings).toEqual([
        jasmine.objectContaining({ fillStyle: '#eeeeef' }),
        jasmine.objectContaining({ strokeStyle: '#0974a1', lineWidth: 1 }),
      ]);
    });

    it('should stop drawing the hover ring when the pointer leaves the data point', async () => {
      await render();

      const center = getCenter(getDataPoint('b', 'First'));
      await dispatchCanvasEvent('mousemove', center.x, center.y);

      const rings = spyOnRings();
      const empty = getEmptyPlotPosition();
      await dispatchCanvasEvent('mousemove', empty.x, empty.y);

      expect(rings).toEqual([]);
    });

    it('should stop drawing the hover ring when the pointer leaves the canvas', async () => {
      await render();

      const center = getCenter(getDataPoint('b', 'First'));
      await dispatchCanvasEvent('mousemove', center.x, center.y);

      const rings = spyOnRings();
      getCanvas().dispatchEvent(new MouseEvent('mouseout'));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(rings).toEqual([]);
    });

    it('should draw an active ring while a hovered data point is pressed', async () => {
      await render();

      const center = getCenter(getDataPoint('b', 'First'));
      await dispatchCanvasEvent('mousemove', center.x, center.y);

      const rings = spyOnRings();
      getCanvas().dispatchEvent(new PointerEvent('pointerdown'));

      expect(rings).toEqual([
        jasmine.objectContaining({ fillStyle: 'rgba(0, 0, 0, 0)' }),
        jasmine.objectContaining({ lineWidth: 2 }),
      ]);

      rings.length = 0;
      getCanvas().dispatchEvent(new PointerEvent('pointerup'));

      expect(rings).toEqual([
        jasmine.objectContaining({ fillStyle: '#eeeeef' }),
        jasmine.objectContaining({ lineWidth: 1 }),
      ]);
    });
  });

  describe('click', () => {
    it('should emit the data point when Enter or Space is pressed', async () => {
      await render();

      pressKey(getDataPoint('b', 'First'), 'Enter');
      expect(
        pressKey(getDataPoint('c', 'Second'), ' ').defaultPrevented,
      ).toBeTrue();

      expect(component.clicks).toEqual([
        { datasetIndex: 0, index: 1 },
        { datasetIndex: 1, index: 2 },
      ]);
    });

    it('should emit the data point when it is clicked', async () => {
      await render();

      getDataPoint('b', 'First').click();

      expect(component.clicks).toEqual([{ datasetIndex: 0, index: 1 }]);
    });

    it('should not emit when data points are not clickable', async () => {
      component.clickable.set(false);
      await render();

      pressKey(getDataPoint('b', 'First'), 'Enter');
      getDataPoint('b', 'First').click();

      expect(component.clicks).toEqual([]);
    });

    it('should emit the data point under the pointer when the canvas is clicked', async () => {
      await render();

      const center = getCenter(getDataPoint('b', 'First'));
      await dispatchCanvasEvent('click', center.x, center.y);

      expect(component.clicks).toEqual([{ datasetIndex: 0, index: 1 }]);
    });

    it('should not emit when the canvas is clicked away from a data point', async () => {
      await render();

      const { x, y } = getEmptyPlotPosition();
      await dispatchCanvasEvent('click', x, y);

      expect(component.clicks).toEqual([]);
    });

    it('should not emit for a canvas click when data points are not clickable', async () => {
      component.clickable.set(false);
      await render();

      const center = getCenter(getDataPoint('b', 'First'));
      await dispatchCanvasEvent('click', center.x, center.y);

      expect(component.clicks).toEqual([]);
    });

    it('should show a pointer cursor only over a clickable data point', async () => {
      await render();

      const center = getCenter(getDataPoint('b', 'First'));

      await dispatchCanvasEvent('mousemove', center.x, center.y);
      expect(getCanvas().style.cursor).toBe('pointer');

      const empty = getEmptyPlotPosition();
      await dispatchCanvasEvent('mousemove', empty.x, empty.y);
      expect(getCanvas().style.cursor).toBe('');

      component.clickable.set(false);
      await render();

      await dispatchCanvasEvent('mousemove', center.x, center.y);
      expect(getCanvas().style.cursor).toBe('');
    });
  });

  describe('a11y', () => {
    it('should be accessible with multiple series and clickable data points', async () => {
      await render();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with a single series and data points that are not clickable', async () => {
      component.config.set(buildConfig([1, 2, 3]));
      component.clickable.set(false);
      await render();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
