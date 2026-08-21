import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  type SkyChartBarOrientation,
  SkyChartBarSeries,
  type SkyChartBarSeriesValue,
} from '@skyux/charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss'],
})
export class ChartBarComponent {
  public orientation: SkyChartBarOrientation = 'vertical';

  protected readonly years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
  protected readonly acquisitions = [10, 20, 15, 25, 22, 30, 28];
  protected readonly target = [12, 18, 20, 22, 26, 28, 32];

  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  protected readonly online = [38, 6, 54, 69, 88, 13, 87];
  protected readonly inStore = [37, 84, 28, 84, 97, 22, 63];
  protected readonly phone = [86, 4, 7, 85, 8, 51, 30];

  protected readonly temperatureRanges: SkyChartBarSeriesValue[] = [
    [-2, 5],
    [0, 8],
    [4, 14],
    [9, 19],
    [14, 24],
    [18, 28],
    [20, 30],
  ];
}
