import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { Chart, type ChartType } from 'chart.js';

import {
  getElementGeometry,
  type SkyChartJsDataPointIndex,
} from '../chart-js-plugins/data-point-geometry';
import { type SkyChartTable } from '../chart-table/chart-table';
import { SkyChartTableService } from '../chart-table/chart-table-service';

import { SkyChartJs, type SkyChartJsConfig } from './chart-js';

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
      (dataPointClick)="clicks.push($event)"
    />
    <button type="button">Outside</button>
  `,
})
class TestComponent {
  public readonly clicks: SkyChartJsDataPointIndex[] = [];
  public readonly clickable = signal(true);
  public readonly config = signal<SkyChartJsConfig>(
    buildConfig([1, 2, 3], [4, null, 6]),
  );
}

function buildConfig(
  first: (number | null)[],
  second?: (number | null)[],
  overrides: { type?: ChartType; indexAxis?: 'x' | 'y' } = {},
): SkyChartJsConfig {
  const datasets = [{ label: 'First', data: first }];

  if (second) {
    datasets.push({ label: 'Second', data: second });
  }

  return {
    type: overrides.type ?? 'bar',
    data: { labels: ['a', 'b', 'c'], datasets },
    options: {
      animation: false,
      maintainAspectRatio: false,
      indexAxis: overrides.indexAxis,
    },
  } as SkyChartJsConfig;
}

const TABLE: SkyChartTable = {
  categoryLabel: 'Letter',
  categories: ['a', 'b', 'c'],
  series: [
    { label: 'First', values: ['1', '2', '3'] },
    { label: 'Second', values: ['4', '', '6'] },
  ],
};

// Measurement, keyboard navigation, and canvas feedback are covered in depth
// by the specs in chart-js-plugins/ and chart-data-points/. These specs cover
// the chart's lifecycle and how this component connects those pieces.
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
      fixture.nativeElement.querySelectorAll('.sky-chart-data-point'),
    );
  }

  function getDataPoint(category: string, series: string): HTMLElement {
    return fixture.nativeElement.querySelector(
      `[data-sky-chart-category="${category}"][data-sky-chart-series="${series}"]`,
    );
  }

  function getSeriesDescriptions(): (string | null)[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('[role="region"]'),
      (region: Element) => region.getAttribute('aria-label'),
    );
  }

  function getFocusedDataPoint(): string | undefined {
    const focused = document.activeElement as HTMLElement;

    return focused.classList.contains('sky-chart-data-point')
      ? `${focused.dataset['skyChartCategory']}/${focused.dataset['skyChartSeries']}`
      : undefined;
  }

  function pressKey(element: HTMLElement, key: string): void {
    element.dispatchEvent(
      new KeyboardEvent('keydown', { key, cancelable: true }),
    );
  }

  function focusOutside(): void {
    (fixture.nativeElement.querySelector('button') as HTMLElement).focus();
  }

  function getCenter(element: HTMLElement): { x: number; y: number } {
    return {
      x: parseFloat(element.style.left) + parseFloat(element.style.width) / 2,
      y: parseFloat(element.style.top) + parseFloat(element.style.height) / 2,
    };
  }

  // Chart.js throttles canvas events to the next animation frame.
  async function dispatchCanvasEvent(
    type: 'click' | 'mousemove',
    position: { x: number; y: number },
  ): Promise<void> {
    const rect = getCanvas().getBoundingClientRect();

    getCanvas().dispatchEvent(
      new MouseEvent(type, {
        bubbles: true,
        clientX: rect.left + position.x,
        clientY: rect.top + position.y,
      }),
    );

    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  // Data points are measured after Chart.js lays out the chart, which
  // happens after the first render, so render once more to show them.
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

  describe('lifecycle', () => {
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
  });

  describe('data points', () => {
    it('should render a focusable data point over each measured data point', async () => {
      await render();

      const bounds = getElementGeometry(getChart().getDatasetMeta(0).data[1]);
      const dataPoint = getDataPoint('b', 'First');

      expect(
        getDataPoints().map((element) => element.getAttribute('aria-label')),
      ).toEqual([
        'a, 1. First.',
        'b, 2. First.',
        'c, 3. First.',
        'a, 4. Second.',
        'c, 6. Second.',
      ]);
      expect(parseFloat(dataPoint.style.left)).toBeCloseTo(bounds.left, 1);
      expect(parseFloat(dataPoint.style.top)).toBeCloseTo(bounds.top, 1);
    });

    it('should re-measure the data points when the data table changes', async () => {
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

    it('should present data points as buttons when clickable, and as images otherwise', async () => {
      await render();

      expect(getDataPoints()[0].getAttribute('role')).toBe('button');

      component.clickable.set(false);
      await render();

      expect(getDataPoints()[0].getAttribute('role')).toBe('img');
    });

    it('should describe each series of a bar chart as a bar series', async () => {
      await render();

      expect(getSeriesDescriptions()).toEqual([
        'First, bar series 1 of 2 with 3 bars.',
        'Second, bar series 2 of 2 with 3 bars.',
      ]);
    });

    it('should describe each series of a line chart as a line', async () => {
      component.config.set(
        buildConfig([1, 2, 3], [4, null, 6], { type: 'line' }),
      );
      await render();

      expect(getSeriesDescriptions()).toEqual([
        'First, line 1 of 2 with 3 data points.',
        'Second, line 2 of 2 with 3 data points.',
      ]);
    });
  });

  describe('keyboard navigation', () => {
    it('should follow the category axis of a horizontal chart', async () => {
      component.config.set(
        buildConfig([1, 2, 3], [4, null, 6], { indexAxis: 'y' }),
      );
      await render();

      getDataPoint('a', 'First').focus();
      pressKey(getDataPoint('a', 'First'), 'ArrowDown');
      expect(getFocusedDataPoint()).toBe('b/First');

      getDataPoint('c', 'Second').focus();
      pressKey(getDataPoint('c', 'Second'), 'ArrowRight');
      expect(getFocusedDataPoint()).toBe('c/First');
    });

    it('should move a line chart to the nearest point above or below in any series', async () => {
      component.config.set(
        buildConfig([1, 2, 3], [4, null, 6], { type: 'line' }),
      );
      await render();

      getDataPoint('b', 'First').focus();
      pressKey(getDataPoint('b', 'First'), 'ArrowUp');
      expect(getFocusedDataPoint()).toBe('c/First');
    });
  });

  describe('focus', () => {
    it('should show the tooltip for the focused data point', async () => {
      await render();

      getDataPoint('b', 'First').focus();

      expect(getChart().tooltip?.getActiveElements()).toEqual([
        jasmine.objectContaining({ datasetIndex: 0, index: 1 }),
      ]);
    });

    it('should hide the tooltip when a data point loses focus', async () => {
      await render();

      getDataPoint('b', 'First').focus();
      focusOutside();

      expect(getChart().tooltip?.getActiveElements()).toEqual([]);
    });
  });

  describe('click', () => {
    it('should emit the data point when Enter is pressed or the canvas is clicked', async () => {
      await render();

      pressKey(getDataPoint('b', 'First'), 'Enter');
      await dispatchCanvasEvent(
        'click',
        getCenter(getDataPoint('c', 'Second')),
      );

      expect(component.clicks).toEqual([
        { datasetIndex: 0, index: 1 },
        { datasetIndex: 1, index: 2 },
      ]);
    });

    it('should show a pointer cursor over a data point only when clickable', async () => {
      await render();

      const center = getCenter(getDataPoint('b', 'First'));
      await dispatchCanvasEvent('mousemove', center);
      expect(getCanvas().style.cursor).toBe('pointer');

      component.clickable.set(false);
      await render();
      await dispatchCanvasEvent('mousemove', { x: center.x, y: center.y + 1 });

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
