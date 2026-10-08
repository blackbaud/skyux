import {
  ChangeDetectionStrategy,
  Component,
  input,
  resource,
} from '@angular/core';
import { SkyChart, SkyChartPie, SkyChartPieSlice } from '@skyux/charts';

interface ChartPieAsyncData {
  slices: { label: string; value: number }[];
}

/**
 * @title Pie chart with asynchronously loaded data
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-pie-async-example',
  templateUrl: './example.html',
  imports: [SkyChart, SkyChartPie, SkyChartPieSlice],
})
export class ChartsChartPieAsyncExample {
  // Simulate network latency.
  public readonly delay = input(1200);

  // A real SPA might use `httpResource` to load remote data. While reloading,
  // the resource keeps its previous value, so the chart stays rendered
  // beneath the wait overlay.
  protected readonly sales = resource({
    params: () => ({ delay: this.delay() }),
    loader: ({ params }) => fetchSalesFromServer(params.delay),
  });
}

/**
 * Simulates a server-side call that returns the chart's data after a delay.
 */
async function fetchSalesFromServer(delay: number): Promise<ChartPieAsyncData> {
  await new Promise((resolve) => setTimeout(resolve, delay));

  return {
    slices: [
      { label: 'North', value: 250 },
      { label: 'South', value: 180 },
      { label: 'East', value: 320 },
      { label: 'West', value: 210 },
    ],
  };
}
