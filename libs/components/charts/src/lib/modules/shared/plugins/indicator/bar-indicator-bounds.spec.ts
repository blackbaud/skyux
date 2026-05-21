import { ActiveElement, BarElement, ChartArea } from 'chart.js';

import { getBarIndicatorBounds } from './bar-indicator-bounds';
import type { IndicatorStyles } from './indicator-types';

describe('getBarIndicatorBounds', () => {
  describe('vertical bar', () => {
    it('should calculate correct bounds for a vertical bar', () => {
      const element = createMockBarElement({
        x: 100,
        y: 200,
        width: 20,
        height: 50,
        base: 250,
        horizontal: false,
      });

      const result = getBarIndicatorBounds(
        defaultChartArea,
        [element],
        defaultStyles,
      );

      // x = 100 - 20/2 - 4 = 86
      // y = 200 - 4 = 196
      // width = 20 + 4*2 = 28
      // height = 50 + 4*2 = 58 (no clamping since 254 < bottom=300)
      expect(result).toEqual({ x: 86, y: 196, width: 28, height: 58 });
    });

    it('should clamp the bottom edge to the chart area bottom', () => {
      const element = createMockBarElement({
        x: 100,
        y: 240,
        width: 20,
        height: 80,
        base: 300,
        horizontal: false,
      });

      // y = 240 - 4 = 236
      // y + height = 236 + 88 = 324 > chartArea.bottom (300)
      // clampedBottom = 300 → effective height = 300 - 236 = 64
      const result = getBarIndicatorBounds(
        defaultChartArea,
        [element],
        defaultStyles,
      );

      expect(result.y).toBe(236);
      expect(result.y + result.height).toBe(300);
    });

    it('should not clamp the top edge above the chart area', () => {
      const element = createMockBarElement({
        x: 100,
        y: 12,
        width: 20,
        height: 50,
        base: 300,
        horizontal: false,
      });

      // y = 12 - 4 = 8 (below chart top=10) — vertical bars do not clamp the top
      const result = getBarIndicatorBounds(
        defaultChartArea,
        [element],
        defaultStyles,
      );

      expect(result.y).toBe(8);
    });

    it('should apply padding to the bounds', () => {
      const styles: IndicatorStyles = { ...defaultStyles, padding: 10 };
      const element = createMockBarElement({
        x: 100,
        y: 100,
        width: 20,
        height: 50,
        base: 150,
        horizontal: false,
      });

      // x = 100 - 10 - 10 = 80
      // y = 100 - 10 = 90
      // width = 20 + 10*2 = 40
      // height = 50 + 10*2 = 70
      const result = getBarIndicatorBounds(defaultChartArea, [element], styles);

      expect(result).toEqual({ x: 80, y: 90, width: 40, height: 70 });
    });
  });

  describe('horizontal bar', () => {
    it('should calculate correct bounds for a horizontal bar', () => {
      const element = createMockBarElement({
        x: 200,
        y: 150,
        width: 100,
        height: 15,
        base: 100,
        horizontal: true,
      });

      // x = 200 - 100 - 4 = 96
      // y = 150 - 15/2 - 4 = 138.5
      // width = 100 + 4*2 = 108
      // height = 15 + 4*2 = 23
      // clampedLeft = Math.max(96, 50) = 96 (no clamping)
      const result = getBarIndicatorBounds(
        defaultChartArea,
        [element],
        defaultStyles,
      );

      expect(result).toEqual({ x: 96, y: 138.5, width: 108, height: 23 });
    });

    it('should clamp the left edge to the chart area left', () => {
      const element = createMockBarElement({
        x: 60,
        y: 150,
        width: 20,
        height: 15,
        base: 50,
        horizontal: true,
      });

      // x = 60 - 20 - 4 = 36 < chartArea.left (50)
      // clampedLeft = 50
      // clampedRight = 36 + 28 = 64
      // width = 64 - 50 = 14
      const result = getBarIndicatorBounds(
        defaultChartArea,
        [element],
        defaultStyles,
      );

      expect(result.x).toBe(50);
      expect(result.width).toBe(14);
    });

    it('should not clamp the right edge beyond the chart area', () => {
      const element = createMockBarElement({
        x: 390,
        y: 150,
        width: 100,
        height: 15,
        base: 50,
        horizontal: true,
      });

      // x = 390 - 100 - 4 = 286; right = 286 + 108 = 394 — not clamped for horizontal
      const result = getBarIndicatorBounds(
        defaultChartArea,
        [element],
        defaultStyles,
      );

      expect(result.x + result.width).toBe(394);
    });

    it('should apply padding to the bounds', () => {
      const styles: IndicatorStyles = { ...defaultStyles, padding: 6 };
      const element = createMockBarElement({
        x: 200,
        y: 150,
        width: 100,
        height: 20,
        base: 100,
        horizontal: true,
      });

      // x = 200 - 100 - 6 = 94
      // y = 150 - 10 - 6 = 134
      // width = 100 + 6*2 = 112
      // height = 20 + 6*2 = 32
      const result = getBarIndicatorBounds(defaultChartArea, [element], styles);

      expect(result).toEqual({ x: 94, y: 134, width: 112, height: 32 });
    });
  });

  it('should fall back to 0 when x and y props are undefined', () => {
    const element: ActiveElement = {
      element: {
        getProps: () => ({
          x: undefined,
          y: undefined,
          width: 20,
          height: 50,
          base: 300,
          horizontal: false,
        }),
      } as unknown as BarElement,
      datasetIndex: 0,
      index: 0,
    } as ActiveElement;

    // x = 0 - 10 - 4 = -14; y = 0 - 4 = -4
    const result = getBarIndicatorBounds(
      defaultChartArea,
      [element],
      defaultStyles,
    );

    expect(result.x).toBe(-14);
    expect(result.y).toBe(-4);
  });

  it('should use only the first active element', () => {
    const element1 = createMockBarElement({
      x: 100,
      y: 100,
      width: 20,
      height: 50,
      base: 300,
      horizontal: false,
    });
    const element2 = createMockBarElement({
      x: 200,
      y: 100,
      width: 20,
      height: 80,
      base: 300,
      horizontal: false,
    });

    // Expected bounds based on element1 only
    const result = getBarIndicatorBounds(
      defaultChartArea,
      [element1, element2],
      defaultStyles,
    );

    // x = 100 - 10 - 4 = 86
    expect(result.x).toBe(86);
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

const defaultChartArea: ChartArea = {
  left: 50,
  top: 10,
  right: 400,
  bottom: 300,
  width: 350,
  height: 290,
};

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
// #endregion
