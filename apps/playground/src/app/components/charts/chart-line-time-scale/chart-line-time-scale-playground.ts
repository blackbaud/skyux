import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyChart,
  SkyChartAxisCategoryTime,
  SkyChartAxisValue,
  SkyChartLine,
  SkyChartLineSeries,
  type SkyChartTimeUnit,
} from '@skyux/charts';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

import {
  TEAMS,
  TIME_SCALE_SCENARIOS,
  type TimeScaleScenario,
  timeScaleReadings,
  unitReadings,
} from './chart-line-time-scale-data';

const TIME_UNITS: SkyChartTimeUnit[] = [
  'millisecond',
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
];

@Component({
  imports: [
    FormsModule,
    SkyBoxModule,
    SkyChart,
    SkyChartAxisCategoryTime,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
    SkyFluidGridModule,
    SkyInputBoxModule,
    SkyPageModule,
  ],
  selector: 'app-chart-line-time-scale-playground',
  templateUrl: './chart-line-time-scale-playground.html',
})
export default class ChartLineTimeScalePlayground {
  protected readonly scenarios = Object.entries(TIME_SCALE_SCENARIOS);
  protected readonly unitCharts = TIME_UNITS.map((unit) => ({
    unit,
    ...unitReadings(unit),
  }));

  protected readonly scenario = signal<TimeScaleScenario>('year');

  readonly #readings = computed(() => timeScaleReadings(this.scenario()));

  protected readonly dates = computed(() =>
    this.#readings().map((reading) => reading.date),
  );

  protected readonly series = computed(() => [
    {
      labelText: 'Average',
      values: this.#readings().map((reading) => reading.average),
    },
    ...TEAMS.map((team) => ({
      labelText: team,
      values: this.#readings().map((reading) => reading.teams[team]),
    })),
  ]);
}
