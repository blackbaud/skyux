/**
 * Keyboard navigation between a chart's data points, modeled on Highcharts'
 * series navigation so keyboard users get the same behavior across the
 * charting libraries in our products. Each function receives the navigable
 * data points in series order, then category order, excluding gaps and hidden
 * series.
 *
 * Positions are measured like Highcharts' `plotX` and `plotY`: `plotX` runs
 * along the category axis and `plotY` along the value axis, in pixels.
 * https://github.com/highcharts/highcharts/blob/master/ts/Accessibility/Components/SeriesComponent/SeriesKeyboardNavigation.ts
 */

interface SkyChartNavigableDataPoint {
  datasetIndex: number;
  plotX: number;
  plotY: number;
}

// Highcharts weighs category-axis distance four times as heavily as value-axis
// distance, so moving between series favors staying on the same category.
const CATEGORY_DISTANCE_WEIGHT = 4;

// Points closer than this are treated as overlapping. Skipping them prevents
// vertical navigation from bouncing between points in the same spot.
const OVERLAP_DISTANCE = 5;

/**
 * Gets the next or previous data point, continuing into the adjacent series
 * at the end of a series and wrapping around at the ends of the chart.
 */
export function getAdjacentDataPoint<T extends SkyChartNavigableDataPoint>(
  dataPoints: readonly T[],
  current: T,
  next: boolean,
): T {
  const index = dataPoints.indexOf(current) + (next ? 1 : -1);

  return dataPoints[(index + dataPoints.length) % dataPoints.length];
}

/**
 * Gets the data point in the adjacent series nearest the current data point,
 * or `undefined` at the first or last series. Like Highcharts, "down" moves to
 * the previous series.
 */
export function getAdjacentSeriesDataPoint<
  T extends SkyChartNavigableDataPoint,
>(dataPoints: readonly T[], current: T, down: boolean): T | undefined {
  const datasetIndexes = [
    ...new Set(dataPoints.map((dataPoint) => dataPoint.datasetIndex)),
  ];

  const targetDatasetIndex =
    datasetIndexes[
      datasetIndexes.indexOf(current.datasetIndex) + (down ? -1 : 1)
    ];

  let nearest: T | undefined;
  let minDistance = Infinity;

  // Scan from the end, as Highcharts does, so ties resolve the same way.
  for (const dataPoint of [...dataPoints].reverse()) {
    if (dataPoint.datasetIndex !== targetDatasetIndex) {
      continue;
    }

    const distance =
      (dataPoint.plotX - current.plotX) ** 2 * CATEGORY_DISTANCE_WEIGHT +
      (dataPoint.plotY - current.plotY) ** 2;

    if (distance < minDistance) {
      minDistance = distance;
      nearest = dataPoint;
    }
  }

  return nearest;
}

/**
 * Gets the nearest data point in any series that is drawn below ("down") or
 * above the current data point, or `undefined` when there is none. Highcharts
 * uses this for line series instead of moving between series.
 */
export function getVerticalDataPoint<T extends SkyChartNavigableDataPoint>(
  dataPoints: readonly T[],
  current: T,
  down: boolean,
): T | undefined {
  let nearest: T | undefined;
  let minDistance = Infinity;

  for (const dataPoint of dataPoints) {
    // Canvas y-coordinates grow downward.
    const yDistance = dataPoint.plotY - current.plotY;
    const distance =
      yDistance ** 2 +
      (dataPoint.plotX - current.plotX) ** 2 * CATEGORY_DISTANCE_WEIGHT;

    if (
      (down ? yDistance > 0 : yDistance < 0) &&
      distance >= OVERLAP_DISTANCE &&
      distance < minDistance
    ) {
      minDistance = distance;
      nearest = dataPoint;
    }
  }

  return nearest;
}
