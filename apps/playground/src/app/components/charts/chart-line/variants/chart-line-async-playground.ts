import { ChangeDetectionStrategy, Component, resource } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartLine,
  SkyChartLineSeries,
} from '@skyux/charts';

interface ChartLineAsyncData {
  categories: string[];
  values: number[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
  ],
  selector: 'app-chart-line-async',
  templateUrl: './chart-line-async-playground.html',
})
export class ChartLineAsyncPlayground {
  // Demonstration resource: an actual SPA might use httpResource to load
  // remote data. While reloading, the resource keeps its previous value, so
  // the chart stays rendered beneath the wait overlay.
  protected readonly donations = resource({
    loader: () => fetchDonationsFromServer(),
  });
}

/**
 * Simulates a server-side call that returns the chart's data after a delay.
 */
async function fetchDonationsFromServer(): Promise<ChartLineAsyncData> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    values: Array.from(
      { length: 4 },
      () => Math.round(Math.random() * 90) + 10,
    ),
  };
}
