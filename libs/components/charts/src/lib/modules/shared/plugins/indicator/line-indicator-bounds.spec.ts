import { ActiveElement, PointElement } from 'chart.js';

import type { IndicatorStyles } from './indicator-types';
import { getLineIndicatorBounds } from './line-indicator-bounds';

describe('getLineIndicatorBounds', () => {
  it('should return a square bounding box centered on the point', () => {
    const element = createMockPointElement({ x: 100, y: 150 }, 5);

    const result = getLineIndicatorBounds([element], defaultStyles);

    expect(result.width).toBe(result.height);
  });

  it('should position the bounding box at the correct coordinates', () => {
    // effective padding = styles.padding + 1.5 = 4 + 1.5 = 5.5
    // x = 100 - radius(5) - padding(5.5) = 89.5
    // y = 150 - radius(5) - padding(5.5) = 139.5
    const element = createMockPointElement({ x: 100, y: 150 }, 5);

    const result = getLineIndicatorBounds([element], defaultStyles);

    expect(result.x).toBe(89.5);
    expect(result.y).toBe(139.5);
  });

  it('should add styles.padding + 1.5 of space around the point radius', () => {
    const radius = 5;
    const effectivePadding = defaultStyles.padding + 1.5; // 5.5
    const element = createMockPointElement({ x: 100, y: 150 }, radius);

    const result = getLineIndicatorBounds([element], defaultStyles);

    const expectedSize = radius * 2 + effectivePadding * 2;
    expect(result.width).toBe(expectedSize);
    expect(result.height).toBe(expectedSize);
  });

  it('should scale the bounding box with the point radius', () => {
    const radius = 8;
    const effectivePadding = defaultStyles.padding + 1.5;
    const element = createMockPointElement({ x: 50, y: 50 }, radius);

    const result = getLineIndicatorBounds([element], defaultStyles);

    const expectedSize = radius * 2 + effectivePadding * 2;
    expect(result.width).toBe(expectedSize);
    expect(result.height).toBe(expectedSize);
  });

  it('should adjust dimensions when styles padding changes', () => {
    const styles: IndicatorStyles = { ...defaultStyles, padding: 8 };
    const radius = 5;
    const element = createMockPointElement({ x: 100, y: 100 }, radius);

    const result = getLineIndicatorBounds([element], styles);

    const effectivePadding = 8 + 1.5;
    const expectedSize = radius * 2 + effectivePadding * 2;
    expect(result.width).toBe(expectedSize);
  });

  it('should fall back to 0 when x and y props are undefined', () => {
    const element: ActiveElement = {
      element: {
        getProps: () => ({ x: undefined, y: undefined }),
        options: { radius: 5 },
      } as unknown as PointElement,
      datasetIndex: 0,
      index: 0,
    } as ActiveElement;

    // effective padding = 4 + 1.5 = 5.5; x = 0 - 5 - 5.5 = -10.5
    const result = getLineIndicatorBounds([element], defaultStyles);

    expect(result.x).toBe(-10.5);
    expect(result.y).toBe(-10.5);
  });

  it('should use only the first active element', () => {
    const element1 = createMockPointElement({ x: 100, y: 150 }, 5);
    const element2 = createMockPointElement({ x: 200, y: 250 }, 5);

    const result = getLineIndicatorBounds([element1, element2], defaultStyles);

    // effective padding = 5.5; x = 100 - 5 - 5.5 = 89.5
    expect(result.x).toBe(89.5);
    expect(result.y).toBe(139.5);
  });
});

// #region Test Helpers
const defaultStyles: IndicatorStyles = {
  padding: 4,
  borderRadius: 3,
  borderColor: '#000',
  borderWidth: 1,
  backgroundColor: '#fff',
};

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

// #endregion
