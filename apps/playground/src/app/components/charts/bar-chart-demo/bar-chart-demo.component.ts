import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyBarChartComponent, SkyBarChartConfig } from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';

@Component({
  selector: 'app-bar-chart-demo',
  templateUrl: './bar-chart-demo.component.html',
  styles: [
    `
      :host {
        display: block;
        margin: 20px;
      }
    `,
  ],
  imports: [SkyBarChartComponent, SkyBoxModule, SkyFluidGridModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartDemoComponent {
  protected readonly chart1: SkyBarChartConfig = {
    orientation: 'horizontal',
    categories: ['Revenue', 'Expenses'],
    series: [
      {
        label: 'Budget',
        data: [
          { label: '$120K', value: 120_000 },
          { label: '$85K', value: 85_000 },
        ],
      },
      {
        label: 'Actuals',
        data: [
          { label: '$115K', value: 115_000 },
          { label: '$78K', value: 78_000 },
        ],
      },
    ],
    valueAxis: { beginAtZero: true },
  };

  protected readonly chart2: SkyBarChartConfig = {
    orientation: 'vertical',
    categories: ['January', 'February', 'March', 'April'],
    series: [
      {
        label: 'Spending',
        data: [
          { label: '$50K', value: 50_000 },
          { label: '$100K', value: 100_000 },
          { label: '$150K', value: 150_000 },
          { label: '$200K', value: 200_000 },
        ],
      },
    ],
    valueAxis: { beginAtZero: true },
  };

  protected readonly chart3: SkyBarChartConfig = {
    orientation: 'horizontal',
    categories: ['January', 'February', 'March', 'April'],
    series: [
      {
        label: 'Spending',
        data: [
          { label: '$50K', value: 50_000 },
          { label: '$100K', value: 100_000 },
          { label: '$150K', value: 150_000 },
          { label: '$200K', value: 200_000 },
        ],
      },
    ],
    valueAxis: { beginAtZero: true },
  };
}
