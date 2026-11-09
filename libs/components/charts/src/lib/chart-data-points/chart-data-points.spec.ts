import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import {
  type SkyChartDataPoint,
  SkyChartDataPoints,
  type SkyChartDataPointSeries,
} from './chart-data-points';

function createDataPoint(
  datasetIndex: number,
  index: number,
  category: string,
  seriesLabelText: string,
  plotX: number,
  plotY: number,
): SkyChartDataPoint {
  return {
    datasetIndex,
    index,
    key: `${datasetIndex}-${index}`,
    category,
    seriesLabelText,
    accessibleName: `${category}, ${plotY}. ${seriesLabelText}.`,
    left: plotX - 10,
    top: plotY,
    width: 20,
    height: 300 - plotY,
    plotX,
    plotY,
  };
}

function createSeries(
  datasetIndex: number,
  labelText: string,
  seriesCount: number,
  dataPoints: SkyChartDataPoint[],
): SkyChartDataPointSeries {
  return {
    datasetIndex,
    labelText,
    seriesCount,
    valueCount: 3,
    dataPoints,
  };
}

// Two series across categories a, b, and c, 100px apart. "Second" has a gap
// at "b". Canvas y-coordinates grow downward, so a smaller plotY is higher.
const TWO_SERIES = [
  createSeries(0, 'First', 2, [
    createDataPoint(0, 0, 'a', 'First', 50, 200),
    createDataPoint(0, 1, 'b', 'First', 150, 150),
    createDataPoint(0, 2, 'c', 'First', 250, 100),
  ]),
  createSeries(1, 'Second', 2, [
    createDataPoint(1, 0, 'a', 'Second', 50, 60),
    createDataPoint(1, 2, 'c', 'Second', 250, 250),
  ]),
];

@Component({
  imports: [SkyChartDataPoints],
  styles: `
    .container {
      position: relative;
      width: 400px;
      height: 300px;
    }
  `,
  template: `
    <div class="container">
      <sky-chart-data-points
        [chartType]="chartType()"
        [clickable]="clickable()"
        [horizontal]="horizontal()"
        [series]="series()"
        (dataPointClick)="clicks.push($event.key)"
        (dataPointFocusChange)="focusChanges.push($event?.key)"
      />
    </div>
    <button type="button">Outside</button>
  `,
})
class TestComponent {
  public readonly clicks: string[] = [];
  public readonly focusChanges: (string | undefined)[] = [];
  public readonly clickable = signal(true);
  public readonly horizontal = signal(false);
  public readonly chartType = signal<'bar' | 'line'>('bar');
  public readonly series = signal<SkyChartDataPointSeries[]>(TWO_SERIES);
}

describe('Chart data points component', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

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

  function describeDataPoint(element: Element | null): string | undefined {
    return element instanceof HTMLElement &&
      element.classList.contains('sky-chart-data-point')
      ? `${element.dataset['skyChartCategory']}/${element.dataset['skyChartSeries']}`
      : undefined;
  }

  function getFocusedDataPoint(): string | undefined {
    return describeDataPoint(document.activeElement);
  }

  function getTabStops(): (string | undefined)[] {
    return getDataPoints()
      .filter((dataPoint) => dataPoint.tabIndex === 0)
      .map(describeDataPoint);
  }

  function getSeriesRegions(): HTMLElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('[role="region"]'),
    );
  }

  function focusOutside(): void {
    (fixture.nativeElement.querySelector('button') as HTMLElement).focus();
  }

  function press(key: string): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    (document.activeElement as HTMLElement).dispatchEvent(event);
    fixture.detectChanges();

    return event;
  }

  async function focusDataPoint(
    category: string,
    series: string,
  ): Promise<void> {
    getDataPoint(category, series).focus();
    await render();
  }

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestComponent] });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('rendering', () => {
    it('should render a stand-in over each data point', async () => {
      await render();

      const dataPoint = getDataPoint('b', 'First');

      expect(getDataPoints().length).toBe(5);
      expect(dataPoint.getAttribute('aria-label')).toBe('b, 150. First.');
      expect(dataPoint.style.left).toBe('140px');
      expect(dataPoint.style.top).toBe('150px');
      expect(dataPoint.style.width).toBe('20px');
      expect(dataPoint.style.height).toBe('150px');
    });

    it('should present data points as buttons when clickable, and as images otherwise', async () => {
      await render();

      expect(getDataPoints()[0].getAttribute('role')).toBe('button');

      component.clickable.set(false);
      await render();

      expect(getDataPoints()[0].getAttribute('role')).toBe('img');
    });

    it('should describe each series as a region when there are multiple series', async () => {
      await render();

      expect(
        getSeriesRegions().map((region) => region.getAttribute('aria-label')),
      ).toEqual([
        'First, bar series 1 of 2 with 3 bars.',
        'Second, bar series 2 of 2 with 3 bars.',
      ]);
    });

    it('should use the singular series description for a series with one value', async () => {
      component.series.set([
        { ...TWO_SERIES[0], valueCount: 1 },
        TWO_SERIES[1],
      ]);
      await render();

      expect(getSeriesRegions()[0].getAttribute('aria-label')).toBe(
        'First, bar series 1 of 2 with 1 bar.',
      );
    });

    it('should not describe the series of a single-series chart', async () => {
      component.series.set([{ ...TWO_SERIES[0], seriesCount: 1 }]);
      await render();

      expect(getSeriesRegions()).toEqual([]);
      expect(getDataPoints().length).toBe(3);
    });
  });

  describe('tab stop', () => {
    it('should make the first data point the only tab stop', async () => {
      await render();

      expect(getTabStops()).toEqual(['a/First']);
    });

    it('should make the focused data point the tab stop', async () => {
      await render();

      await focusDataPoint('b', 'First');

      expect(getTabStops()).toEqual(['b/First']);
    });

    it('should keep the tab stop when focus moves between data points', async () => {
      await render();

      await focusDataPoint('b', 'First');
      await focusDataPoint('c', 'First');

      expect(getTabStops()).toEqual(['c/First']);
    });

    it('should reset the tab stop to the first data point when focus leaves', async () => {
      await render();

      await focusDataPoint('b', 'First');
      focusOutside();
      await render();

      expect(getTabStops()).toEqual(['a/First']);
    });

    it('should reset the tab stop when the focused data point is removed', async () => {
      await render();

      await focusDataPoint('c', 'Second');
      component.series.set([TWO_SERIES[0]]);
      await render();

      expect(getTabStops()).toEqual(['a/First']);
    });
  });

  describe('keyboard navigation', () => {
    it('should move through every series with the left and right arrow keys, wrapping at the ends', async () => {
      await render();

      await focusDataPoint('c', 'First');

      expect(press('ArrowRight').defaultPrevented).toBeTrue();
      expect(getFocusedDataPoint()).toBe('a/Second');

      press('ArrowLeft');
      expect(getFocusedDataPoint()).toBe('c/First');

      await focusDataPoint('c', 'Second');
      press('ArrowRight');
      expect(getFocusedDataPoint()).toBe('a/First');

      press('ArrowLeft');
      expect(getFocusedDataPoint()).toBe('c/Second');
    });

    it('should move to the previous series with ArrowDown and the next series with ArrowUp, like Highcharts', async () => {
      await render();

      await focusDataPoint('c', 'Second');
      press('ArrowDown');
      expect(getFocusedDataPoint()).toBe('c/First');

      // Second has a gap at "b", so ArrowUp lands on its nearest data point.
      await focusDataPoint('b', 'First');
      press('ArrowUp');
      expect(getFocusedDataPoint()).toBe('a/Second');
    });

    it('should keep focus when there is no series in the arrow direction', async () => {
      await render();

      await focusDataPoint('b', 'First');

      expect(press('ArrowDown').defaultPrevented).toBeTrue();
      expect(getFocusedDataPoint()).toBe('b/First');
    });

    it('should move between series with Page Down and Page Up', async () => {
      await render();

      await focusDataPoint('a', 'First');
      press('PageUp');
      expect(getFocusedDataPoint()).toBe('a/Second');

      press('PageDown');
      expect(getFocusedDataPoint()).toBe('a/First');
    });

    it('should move to the first and last data points with Home and End', async () => {
      await render();

      await focusDataPoint('b', 'First');
      press('End');
      expect(getFocusedDataPoint()).toBe('c/Second');

      press('Home');
      expect(getFocusedDataPoint()).toBe('a/First');
    });

    it('should swap the arrow key pairs when horizontal', async () => {
      component.horizontal.set(true);
      await render();

      await focusDataPoint('a', 'First');
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

    it('should move to the nearest data point above or below, in any series, in a line chart', async () => {
      component.chartType.set('line');
      await render();

      await focusDataPoint('b', 'First');
      press('ArrowUp');
      expect(getFocusedDataPoint()).toBe('c/First');

      await focusDataPoint('b', 'First');
      press('ArrowDown');
      expect(getFocusedDataPoint()).toBe('a/First');
    });

    it('should ignore other keys, including Escape', async () => {
      await render();

      await focusDataPoint('a', 'First');

      expect(press('a').defaultPrevented).toBeFalse();
      expect(press('Escape').defaultPrevented).toBeFalse();
      expect(getFocusedDataPoint()).toBe('a/First');
    });
  });

  describe('events', () => {
    it('should emit the focused data point, and undefined when it loses focus', async () => {
      await render();

      await focusDataPoint('b', 'First');
      focusOutside();

      expect(component.focusChanges).toEqual(['0-1', undefined]);
    });

    it('should emit the data point when Enter or Space is pressed', async () => {
      await render();

      await focusDataPoint('b', 'First');
      expect(press('Enter').defaultPrevented).toBeTrue();

      await focusDataPoint('c', 'Second');
      expect(press(' ').defaultPrevented).toBeTrue();

      expect(component.clicks).toEqual(['0-1', '1-2']);
    });

    it('should emit the data point when it is clicked', async () => {
      await render();

      getDataPoint('b', 'First').click();

      expect(component.clicks).toEqual(['0-1']);
    });
  });

  describe('a11y', () => {
    it('should be accessible with multiple series and clickable data points', async () => {
      await render();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with a single series and data points that are not clickable', async () => {
      component.clickable.set(false);
      component.series.set([{ ...TWO_SERIES[0], seriesCount: 1 }]);
      await render();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
