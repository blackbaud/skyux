import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  SkyChart,
  type SkyChartDataPointClickArgs,
  SkyChartPie,
  SkyChartPieSlice,
} from '@skyux/charts';

/**
 * @title Pie chart with clickable slices
 */
@Component({
  imports: [CurrencyPipe, SkyChart, SkyChartPie, SkyChartPieSlice],
  selector: 'app-chart-pie-data-point-click-example',
  templateUrl: './example.html',
})
export class ChartsChartPieDataPointClickExample {
  protected readonly channels = [
    { name: 'Online', donations: 90700 },
    { name: 'In person', donations: 64600 },
    { name: 'Mail', donations: 28300 },
  ];

  protected readonly selection = signal<
    SkyChartDataPointClickArgs<number> | undefined
  >(undefined);
}
