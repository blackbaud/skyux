import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyChartActivatedDatapoint,
  SkyChartComponent,
  SkyDonutChartComponent,
  SkyDonutChartSeriesComponent,
  SkyDonutChartSeriesDatapointComponent,
  SkyDonutChartSlice,
} from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  selector: 'app-donut-chart-demo',
  templateUrl: 'donut-chart-demo.component.html',
  styles: [],
  imports: [
    SkyPageModule,
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
  protected chart1 = [
    {
      name: 'Securities',
      value: 5_000_000,
      label: '$5,000,000',
    },
    {
      name: 'Income/Compensation',
      value: 2_500_000,
      label: '$2,500,000',
    },
    {
      name: 'Private Co. Valuation',
      value: 1_500_000,
      label: '$1,500,000',
    },
    {
      name: 'Real Estate',
      value: 1_000_000,
      label: '$1,000,000',
    },
  ];

  public onDatapointActivated(
    event: SkyChartActivatedDatapoint<SkyDonutChartSlice>,
  ): void {
    console.log(JSON.stringify(event, null, 2));
  }
}
