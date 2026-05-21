import { parseCategories } from '../shared/chart-helpers';
import { SkyChartDataPoint } from '../shared/types/chart-data-point';
import { SkyChartSeries } from '../shared/types/chart-series';

export class SkyChartGridModalContext {
  public readonly modalTitle: string;

  /** The category labels for the chart data. */
  public readonly categories: (string | number)[];

  /** The data series to display in the grid. */
  public readonly series: readonly SkyChartSeries<SkyChartDataPoint>[];

  constructor(data: {
    modalTitle: string;
    series: readonly SkyChartSeries<SkyChartDataPoint>[];
  }) {
    this.modalTitle = data.modalTitle;
    this.categories = parseCategories(data.series);
    this.series = data.series;
  }
}
