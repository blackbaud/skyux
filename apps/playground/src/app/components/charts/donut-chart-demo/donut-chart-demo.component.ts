import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChartComponent,
  type SkyChartDataPointClickArgs,
  SkyDonutChartComponent,
  SkyDonutChartSeriesComponent,
  SkyDonutChartSeriesDatapointComponent,
  SkyDonutDatum,
} from '@skyux/charts';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import {
  ChartDemoUtils,
  type DemoSeriesData,
} from '../shared/chart-demo-utils';

@Component({
  selector: 'app-donut-chart-demo',
  templateUrl: 'donut-chart-demo.component.html',
  styles: [],
  imports: [
    SkyPageModule,
    SkyTabsModule,
    SkyDonutChartComponent,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyChartComponent,
    SkyDonutChartComponent,
    SkyDonutChartSeriesComponent,
    SkyDonutChartSeriesDatapointComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartDemoComponent {
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
    event: SkyChartDataPointClickArgs<SkyDonutDatum>,
  ): void {
    console.log(JSON.stringify(event, null, 2));
  }
}
