import { ActiveElement, ArcElement } from 'chart.js';

import { getDonutIndicatorBounds } from './donut-indicator-bounds';

describe('getDonutIndicatorBounds', () => {
  it('should return the center coordinates from the arc element', () => {
    const element = createMockArcElement({
      x: 200,
      y: 150,
      startAngle: 0,
      endAngle: Math.PI / 2,
      innerRadius: 50,
      outerRadius: 100,
    });

    const result = getDonutIndicatorBounds([element]);

    expect(result.x).toBe(200);
    expect(result.y).toBe(150);
  });

  it('should return the start and end angles from the arc element', () => {
    const startAngle = Math.PI / 4;
    const endAngle = Math.PI * 1.5;
    const element = createMockArcElement({
      x: 200,
      y: 150,
      startAngle,
      endAngle,
      innerRadius: 50,
      outerRadius: 100,
    });

    const result = getDonutIndicatorBounds([element]);

    expect(result.startAngle).toBe(startAngle);
    expect(result.endAngle).toBe(endAngle);
  });

  it('should expand the outer radius by Math.PI', () => {
    const outerRadius = 100;
    const element = createMockArcElement({
      x: 200,
      y: 150,
      startAngle: 0,
      endAngle: Math.PI / 2,
      innerRadius: 50,
      outerRadius,
    });

    const result = getDonutIndicatorBounds([element]);

    expect(result.outerRadius).toBe(outerRadius + Math.PI);
  });

  it('should use only the first active element', () => {
    const element1 = createMockArcElement({
      x: 100,
      y: 75,
      startAngle: 0,
      endAngle: Math.PI,
      innerRadius: 30,
      outerRadius: 60,
    });
    const element2 = createMockArcElement({
      x: 200,
      y: 150,
      startAngle: Math.PI,
      endAngle: Math.PI * 2,
      innerRadius: 30,
      outerRadius: 60,
    });

    const result = getDonutIndicatorBounds([element1, element2]);

    expect(result.x).toBe(100);
    expect(result.y).toBe(75);
  });

  it('should fall back to 0 when x and y props are undefined', () => {
    const element: ActiveElement = {
      element: {
        getProps: () => ({
          x: undefined,
          y: undefined,
          startAngle: 0,
          endAngle: Math.PI,
          innerRadius: 30,
          outerRadius: 60,
        }),
      } as unknown as ArcElement,
      datasetIndex: 0,
      index: 0,
    } as ActiveElement;

    const result = getDonutIndicatorBounds([element]);

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('should handle a slice covering the full circle', () => {
    const element = createMockArcElement({
      x: 150,
      y: 150,
      startAngle: 0,
      endAngle: Math.PI * 2,
      innerRadius: 40,
      outerRadius: 80,
    });

    const result = getDonutIndicatorBounds([element]);

    expect(result.startAngle).toBe(0);
    expect(result.endAngle).toBe(Math.PI * 2);
    expect(result.outerRadius).toBeCloseTo(80 + Math.PI, 5);
  });
});

// #region Test Helpers
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
