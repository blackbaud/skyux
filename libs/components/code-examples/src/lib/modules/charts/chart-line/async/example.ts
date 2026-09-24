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
  SkyChartLine,
  SkyChartLineSeries,
} from '@skyux/charts';

interface ChartLineAsyncData {
  categories: string[];
  values: number[];
}

/**
 * @title Line chart with asynchronously loaded data
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-line-async-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
  ],
})
export class ChartsChartLineAsyncExample {
  // Simulate network latency.
  public readonly delay = input(1200);

  // A real SPA might use `httpResource` to load remote data. While reloading,
  // the resource keeps its previous value, so the chart stays rendered
  // beneath the wait overlay.
  protected readonly donations = resource({
    params: () => ({ delay: this.delay() }),
    loader: ({ params }) => fetchDonationsFromServer(params.delay),
  });
}

/**
 * Simulates a server-side call that returns the chart's data after a delay.
 */
async function fetchDonationsFromServer(
  delay: number,
): Promise<ChartLineAsyncData> {
  await new Promise((resolve) => setTimeout(resolve, delay));

  return {
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    values: [45, 72, 38, 90],
  };
}
