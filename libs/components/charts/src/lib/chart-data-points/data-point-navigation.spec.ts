import {
  getAdjacentDataPoint,
  getAdjacentSeriesDataPoint,
  getVerticalDataPoint,
} from './data-point-navigation';

describe('Data point navigation', () => {
  function point(
    datasetIndex: number,
    plotX: number,
    plotY: number,
  ): { datasetIndex: number; plotX: number; plotY: number } {
    return { datasetIndex, plotX, plotY };
  }

  // Two series of three categories, 100px apart along the category axis.
  const a1 = point(0, 0, 50);
  const a2 = point(0, 100, 40);
  const a3 = point(0, 200, 30);
  const b1 = point(1, 0, 10);
  const b2 = point(1, 100, 90);
  const b3 = point(1, 200, 20);
  const dataPoints = [a1, a2, a3, b1, b2, b3];

  describe('getAdjacentDataPoint', () => {
    it('should move to the next and previous point in the series', () => {
      expect(getAdjacentDataPoint(dataPoints, a1, true)).toBe(a2);
      expect(getAdjacentDataPoint(dataPoints, a2, false)).toBe(a1);
    });

    it('should continue into the adjacent series at the end of a series', () => {
      expect(getAdjacentDataPoint(dataPoints, a3, true)).toBe(b1);
      expect(getAdjacentDataPoint(dataPoints, b1, false)).toBe(a3);
    });

    it('should wrap around at the ends of the chart', () => {
      expect(getAdjacentDataPoint(dataPoints, b3, true)).toBe(a1);
      expect(getAdjacentDataPoint(dataPoints, a1, false)).toBe(b3);
    });
  });

  describe('getAdjacentSeriesDataPoint', () => {
    it('should move "down" to the previous series and "up" to the next', () => {
      expect(getAdjacentSeriesDataPoint(dataPoints, b2, true)).toBe(a2);
      expect(getAdjacentSeriesDataPoint(dataPoints, a2, false)).toBe(b2);
    });

    it('should not wrap past the first or last series', () => {
      expect(getAdjacentSeriesDataPoint(dataPoints, a2, true)).toBeUndefined();
      expect(getAdjacentSeriesDataPoint(dataPoints, b2, false)).toBeUndefined();
    });

    it('should land on the nearest point, weighing category distance most', () => {
      // a3 is nearer by straight-line distance, but a2 is in the nearer
      // category once category distance is weighted.
      const current = point(1, 145, -100);

      expect(
        getAdjacentSeriesDataPoint([a1, a2, a3, current], current, true),
      ).toBe(a2);
    });

    it('should skip series that are not navigable', () => {
      const c1 = point(3, 0, 0);

      expect(getAdjacentSeriesDataPoint([a1, c1], c1, true)).toBe(a1);
    });

    it('should resolve ties to the later point, like Highcharts', () => {
      const left = point(0, 0, 0);
      const right = point(0, 200, 0);
      const current = point(1, 100, 0);

      expect(
        getAdjacentSeriesDataPoint([left, right, current], current, true),
      ).toBe(right);
    });
  });

  describe('getVerticalDataPoint', () => {
    it('should move to the nearest point drawn below or above, in any series', () => {
      // Canvas y-coordinates grow downward, so "down" means a larger plotY.
      expect(getVerticalDataPoint(dataPoints, a2, true)).toBe(b2);
      expect(getVerticalDataPoint(dataPoints, b2, false)).toBe(a2);
    });

    it('should move within the same series when its point is nearest', () => {
      expect(getVerticalDataPoint(dataPoints, a3, true)).toBe(a2);
    });

    it('should return undefined when no point is drawn in that direction', () => {
      expect(getVerticalDataPoint(dataPoints, b2, true)).toBeUndefined();
    });

    it('should skip points that overlap the current point', () => {
      const overlapping = point(1, 0, 52);

      expect(getVerticalDataPoint([a1, overlapping], a1, true)).toBeUndefined();
    });
  });
});
