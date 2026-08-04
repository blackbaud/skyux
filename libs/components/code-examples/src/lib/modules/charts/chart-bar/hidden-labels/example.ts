import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
} from '@skyux/charts';

/**
 * @title Bar chart with hidden axis labels
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar-hidden-labels-example',
  templateUrl: './example.html',
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
})
export class ChartsChartBarHiddenLabelsExample {
  protected readonly years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
  protected readonly acquisitions = [10, 20, 15, 25, 22, 30, 28];
}
