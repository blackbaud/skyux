import {
  ChangeDetectionStrategy,
  Component,
  input,
  resource,
} from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  type SkyChartBarOrientation,
  SkyChartBarSeries,
} from '@skyux/charts';

interface ChartBarAsyncData {
  categories: string[];
  values: number[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
  selector: 'app-chart-bar-async',
  templateUrl: './chart-bar-async-playground.html',
})
export class ChartBarAsyncPlayground {
  protected readonly orientation = input<SkyChartBarOrientation>('vertical');

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
async function fetchDonationsFromServer(): Promise<ChartBarAsyncData> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    values: Array.from(
      { length: 4 },
      () => Math.round(Math.random() * 90) + 10,
    ),
  };
}
