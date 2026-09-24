import {
  ChangeDetectionStrategy,
  Component,
  input,
  resource,
} from '@angular/core';
import {
  SkyChart,
  SkyChartPie,
  type SkyChartPieDisplayMode,
  SkyChartPieSlice,
} from '@skyux/charts';

interface ChartPieAsyncData {
  slices: { label: string; value: number }[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChart, SkyChartPie, SkyChartPieSlice],
  selector: 'app-chart-pie-async',
  templateUrl: './chart-pie-async-playground.html',
})
export class ChartPieAsyncPlayground {
  protected readonly displayMode = input<SkyChartPieDisplayMode>('pie');

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
async function fetchDonationsFromServer(): Promise<ChartPieAsyncData> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    slices: ['Events', 'Direct mail', 'Online', 'Major gifts'].map((label) => ({
      label,
      value: Math.round(Math.random() * 90) + 10,
    })),
  };
}
