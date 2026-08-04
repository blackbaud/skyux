import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
} from '@skyux/charts';

/**
 * @title Bar chart with fixed value bounds
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar-value-bounds-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
})
export class ChartsChartBarValueBoundsExample {
  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];

  // Percent values are fractional, so 0.85 displays as 85%. Pinning the axis
  // to [0, 1] keeps the scale at 0–100% regardless of the plotted values.
  protected readonly goalCompletion = [
    0.62, 0.71, 0.68, 0.79, 0.85, 0.91, 0.88,
  ];
}
