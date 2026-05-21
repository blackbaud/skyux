import {
  ActiveElement,
  ArcElement,
  BarElement,
  Chart,
  PointElement,
} from 'chart.js';

import { drawIndicatorFill, drawIndicatorStroke } from './indicator-draw';
import type { IndicatorStyles } from './indicator-types';

describe('drawIndicatorFill', () => {
  it('should not draw when there are no active elements', () => {
    const { chart, ctx } = createMockBarChart();

    drawIndicatorFill(chart, [], defaultStyles);

    expect(ctx.save).not.toHaveBeenCalled();
    expect(ctx.fill).not.toHaveBeenCalled();
  });

  it('should save and restore the canvas context', () => {
    const { chart, ctx } = createMockBarChart();
    const element = createMockBarElement({
      x: 100,
      y: 100,
      width: 20,
      height: 50,
      base: 300,
      horizontal: false,
    });

    drawIndicatorFill(chart, [element], defaultStyles);

    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });

  it('should set fillStyle to the styles backgroundColor', () => {
    const { chart, ctx } = createMockBarChart();
    const element = createMockBarElement({
      x: 100,
      y: 100,
      width: 20,
      height: 50,
      base: 300,
      horizontal: false,
    });

    drawIndicatorFill(chart, [element], defaultStyles);

    expect(ctx.fillStyle).toBe(defaultStyles.backgroundColor);
  });

  it('should call fill to render the background', () => {
    const { chart, ctx } = createMockBarChart();
    const element = createMockBarElement({
      x: 100,
      y: 100,
      width: 20,
      height: 50,
      base: 300,
      horizontal: false,
    });

    drawIndicatorFill(chart, [element], defaultStyles);

    expect(ctx.fill).toHaveBeenCalledTimes(1);
  });

  describe('bar chart path', () => {
    it('should call roundRect with the bar bounds', () => {
      const { chart, ctx } = createMockBarChart();
      const element = createMockBarElement({
        x: 100,
        y: 100,
        width: 20,
        height: 50,
        base: 300,
        horizontal: false,
      });

      drawIndicatorFill(chart, [element], defaultStyles);

      expect(ctx.roundRect).toHaveBeenCalled();
    });

    it('should round only the top corners for vertical bars', () => {
      const { chart, ctx } = createMockBarChart(false);
      const element = createMockBarElement({
        x: 100,
        y: 100,
        width: 20,
        height: 50,
        base: 300,
        horizontal: false,
      });

      drawIndicatorFill(chart, [element], defaultStyles);

      const radii = ctx.roundRect.calls.mostRecent().args[4];
      expect(radii).toEqual([
        defaultStyles.borderRadius,
        defaultStyles.borderRadius,
        0,
        0,
      ]);
    });

    it('should round only the right corners for horizontal bars', () => {
      const { chart, ctx } = createMockBarChart(true);
      const element = createMockBarElement({
        x: 200,
        y: 150,
        width: 100,
        height: 15,
        base: 50,
        horizontal: true,
      });

      drawIndicatorFill(chart, [element], defaultStyles);

      const radii = ctx.roundRect.calls.mostRecent().args[4];
      expect(radii).toEqual([
        0,
        defaultStyles.borderRadius,
        defaultStyles.borderRadius,
        0,
      ]);
    });
  });

  describe('line chart path', () => {
    it('should call roundRect for line chart elements', () => {
      const { chart, ctx } = createMockLineChart();
      const element = createMockPointElement({ x: 100, y: 100 }, 5);

      drawIndicatorFill(chart, [element], defaultStyles);

      expect(ctx.roundRect).toHaveBeenCalled();
    });

    it('should round all corners for line chart elements', () => {
      const { chart, ctx } = createMockLineChart();
      const element = createMockPointElement({ x: 100, y: 100 }, 5);

      drawIndicatorFill(chart, [element], defaultStyles);

      const radii = ctx.roundRect.calls.mostRecent().args[4];
      expect(radii).toEqual([
        defaultStyles.borderRadius,
        defaultStyles.borderRadius,
        defaultStyles.borderRadius,
        defaultStyles.borderRadius,
      ]);
    });
  });

  describe('doughnut chart path', () => {
    it('should call arc for doughnut chart elements', () => {
      const { chart, ctx } = createMockDoughnutChart();
      const element = createMockArcElement({
        x: 200,
        y: 150,
        startAngle: 0,
        endAngle: Math.PI / 2,
        innerRadius: 50,
        outerRadius: 100,
      });

      drawIndicatorFill(chart, [element], defaultStyles);

      expect(ctx.arc).toHaveBeenCalled();
    });

    it('should call beginPath and closePath for doughnut chart elements', () => {
      const { chart, ctx } = createMockDoughnutChart();
      const element = createMockArcElement({
        x: 200,
        y: 150,
        startAngle: 0,
        endAngle: Math.PI / 2,
        innerRadius: 50,
        outerRadius: 100,
      });

      drawIndicatorFill(chart, [element], defaultStyles);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.closePath).toHaveBeenCalled();
    });

    it('should draw two arcs for the donut slice indicator', () => {
      const { chart, ctx } = createMockDoughnutChart();
      const element = createMockArcElement({
        x: 200,
        y: 150,
        startAngle: 0,
        endAngle: Math.PI / 2,
        innerRadius: 50,
        outerRadius: 100,
      });

      drawIndicatorFill(chart, [element], defaultStyles);

      expect(ctx.arc).toHaveBeenCalledTimes(2);
    });

    it('should set lineWidth to borderWidth + Math.PI for doughnut arcs', () => {
      const { chart, ctx } = createMockDoughnutChart();
      const element = createMockArcElement({
        x: 200,
        y: 150,
        startAngle: 0,
        endAngle: Math.PI / 2,
        innerRadius: 50,
        outerRadius: 100,
      });

      drawIndicatorFill(chart, [element], defaultStyles);

      expect(ctx.lineWidth).toBe(defaultStyles.borderWidth + Math.PI);
    });
  });
});

describe('drawIndicatorStroke', () => {
  it('should not draw when there are no active elements', () => {
    const { chart, ctx } = createMockBarChart();

    drawIndicatorStroke(chart, [], defaultStyles);

    expect(ctx.save).not.toHaveBeenCalled();
    expect(ctx.stroke).not.toHaveBeenCalled();
  });

  it('should save and restore the canvas context', () => {
    const { chart, ctx } = createMockBarChart();
    const element = createMockBarElement({
      x: 100,
      y: 100,
      width: 20,
      height: 50,
      base: 300,
      horizontal: false,
    });

    drawIndicatorStroke(chart, [element], defaultStyles);

    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });

  it('should set strokeStyle to the styles borderColor', () => {
    const { chart, ctx } = createMockBarChart();
    const element = createMockBarElement({
      x: 100,
      y: 100,
      width: 20,
      height: 50,
      base: 300,
      horizontal: false,
    });

    drawIndicatorStroke(chart, [element], defaultStyles);

    expect(ctx.strokeStyle).toBe(defaultStyles.borderColor);
  });

  it('should set lineWidth to the styles borderWidth', () => {
    const { chart, ctx } = createMockBarChart();
    const element = createMockBarElement({
      x: 100,
      y: 100,
      width: 20,
      height: 50,
      base: 300,
      horizontal: false,
    });

    drawIndicatorStroke(chart, [element], defaultStyles);

    expect(ctx.lineWidth).toBe(defaultStyles.borderWidth);
  });

  it('should call stroke to render the border', () => {
    const { chart, ctx } = createMockBarChart();
    const element = createMockBarElement({
      x: 100,
      y: 100,
      width: 20,
      height: 50,
      base: 300,
      horizontal: false,
    });

    drawIndicatorStroke(chart, [element], defaultStyles);

    expect(ctx.stroke).toHaveBeenCalledTimes(1);
  });

  it('should call roundRect for bar charts', () => {
    const { chart, ctx } = createMockBarChart();
    const element = createMockBarElement({
      x: 100,
      y: 100,
      width: 20,
      height: 50,
      base: 300,
      horizontal: false,
    });

    drawIndicatorStroke(chart, [element], defaultStyles);

    expect(ctx.roundRect).toHaveBeenCalled();
  });

  it('should call roundRect for line charts', () => {
    const { chart, ctx } = createMockLineChart();
    const element = createMockPointElement({ x: 100, y: 100 }, 5);

    drawIndicatorStroke(chart, [element], defaultStyles);

    expect(ctx.roundRect).toHaveBeenCalled();
  });

  it('should call arc for doughnut charts', () => {
    const { chart, ctx } = createMockDoughnutChart();
    const element = createMockArcElement({
      x: 200,
      y: 150,
      startAngle: 0,
      endAngle: Math.PI / 2,
      innerRadius: 50,
      outerRadius: 100,
    });

    drawIndicatorStroke(chart, [element], defaultStyles);

    expect(ctx.arc).toHaveBeenCalled();
  });

  it('should throw for unsupported dataset types on cartesian charts', () => {
    const ctx = createMockCtx();
    const chart = {
      ctx,
      config: { type: 'scatter', options: {} },
      data: { datasets: [{ data: [1] }] },
      chartArea: defaultChartArea,
    } as unknown as Chart;
    const element: ActiveElement = {
      element: {
        getProps: () => ({ x: 100, y: 100 }),
      } as unknown as PointElement,
      datasetIndex: 0,
      index: 0,
    } as ActiveElement;

    expect(() =>
      drawIndicatorStroke(chart, [element], defaultStyles),
    ).toThrowError('Unsupported dataset type for indicator plugin: scatter');
  });
});

// #region Test Helpers
const defaultStyles: IndicatorStyles = {
  padding: 4,
  borderRadius: 3,
  borderColor: '#112233',
  borderWidth: 2,
  backgroundColor: '#aabbcc',
};

const defaultChartArea = {
  left: 0,
  top: 0,
  right: 400,
  bottom: 300,
  width: 400,
  height: 300,
};

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

function createMockBarChart(horizontal = false): {
  chart: Chart;
  ctx: MockCtx;
} {
  const ctx = createMockCtx();
  const chart = {
    ctx,
    config: {
      type: 'bar',
      options: horizontal ? { indexAxis: 'y' } : {},
    },
    data: { datasets: [{ data: [1] }] },
    chartArea: defaultChartArea,
  } as unknown as Chart;
  return { chart, ctx };
}

function createMockLineChart(): { chart: Chart; ctx: MockCtx } {
  const ctx = createMockCtx();
  const chart = {
    ctx,
    config: { type: 'line', options: {} },
    data: { datasets: [{ data: [1] }] },
    chartArea: defaultChartArea,
  } as unknown as Chart;
  return { chart, ctx };
}

function createMockDoughnutChart(): { chart: Chart; ctx: MockCtx } {
  const ctx = createMockCtx();
  const chart = {
    ctx,
    config: { type: 'doughnut', options: {} },
    data: { datasets: [{ data: [10, 20] }] },
    chartArea: defaultChartArea,
  } as unknown as Chart;
  return { chart, ctx };
}

function createMockBarElement(props: {
  x: number;
  y: number;
  width: number;
  height: number;
  base: number;
  horizontal: boolean;
}): ActiveElement {
  return {
    element: {
      getProps: () => props,
    } as unknown as BarElement,
    datasetIndex: 0,
    index: 0,
  } as ActiveElement;
}

function createMockPointElement(
  props: { x: number; y: number },
  radius: number,
): ActiveElement {
  return {
    element: {
      getProps: () => props,
      options: { radius },
    } as unknown as PointElement,
    datasetIndex: 0,
    index: 0,
  } as ActiveElement;
}

function createMockArcElement(props: {
  x: number;
  y: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}): ActiveElement {
  return {
    element: {
      getProps: () => props,
    } as unknown as ArcElement,
    datasetIndex: 0,
    index: 0,
  } as ActiveElement;
}
// #endregion
