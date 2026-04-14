import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChartComponent,
  type SkyChartDataPointClickArgs,
  SkyChartDonutComponent,
  SkyChartDonutDatum,
  SkyChartDonutSeriesComponent,
  SkyChartDonutSeriesDataPointComponent,
} from '@skyux/charts';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import {
  ChartDemoUtils,
  type DemoSeriesData,
} from '../shared/chart-demo-utils';

@Component({
  selector: 'app-chart-donut-demo',
  templateUrl: 'chart-donut-demo.component.html',
  styles: [],
  imports: [
    SkyPageModule,
    SkyTabsModule,
    SkyChartDonutComponent,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyChartComponent,
    SkyChartDonutComponent,
    SkyChartDonutSeriesComponent,
    SkyChartDonutSeriesDataPointComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDonutDemoComponent {
  protected chart1: DemoSeriesData[] = [
    {
      category: 'Securities',
      value: 5_000_000,
      label: '$5,000,000',
    },
    {
      category: 'Income/Compensation',
      value: 2_500_000,
      label: '$2,500,000',
    },
    {
      category: 'Private Co. Valuation',
      value: 1_500_000,
      label: '$1,500,000',
    },
    {
      category: 'Real Estate',
      value: 1_000_000,
      label: '$1,000,000',
    },
  ];

  // #region Data density
  protected readonly density = {
    three: ChartDemoUtils.createRandomData({ count: 3 }),
    six: ChartDemoUtils.createRandomData({ count: 6 }),
    nine: ChartDemoUtils.createRandomData({ count: 9 }),
    twelve: ChartDemoUtils.createRandomData({ count: 12 }),
  };

  // #endregion

  public onDataPointClicked(
    event: SkyChartDataPointClickArgs<SkyChartDonutDatum>,
  ): void {
    console.log(JSON.stringify(event, null, 2));
  }
}
