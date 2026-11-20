import { Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartLine,
  SkyChartLineSeries,
} from '@skyux/charts';

/**
 * @title Line chart with an emphasized series
 */
@Component({
  selector: 'app-chart-line-emphasized-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartLine,
    SkyChartLineSeries,
  ],
})
export class ChartsChartLineEmphasizedExample {
  protected readonly years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  protected readonly annualFund = [42, 48, 45, 53, 58, 61, 67];
  protected readonly capitalCampaign = [30, 26, 34, 38, 35, 41, 39];
  protected readonly scholarships = [18, 22, 21, 25, 29, 27, 32];
}
