import { SkyChartSeries } from '../shared/chart-types';

export class SkyChartGridModalContext {
  public readonly modalTitle: string;

  /** The category labels for the chart data. */
  public readonly categories: string[];

  /** The data series to display in the grid. */
  public readonly series: SkyChartSeries[];

  constructor(data: {
    modalTitle: string;
    categories: string[];
    series: SkyChartSeries[];
  }) {
    this.modalTitle = data.modalTitle;
    this.categories = data.categories;
    this.series = data.series;
  }
}
