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
        data: [120_000, 85_000],
        tooltipLabels: ['$120K', '$85K'],
      },
      {
        label: 'Actuals',
        data: [115_000, 78_000],
        tooltipLabels: ['$115K', '$78K'],
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
        data: [50_000, 100_000, 150_000, 200_000],
        tooltipLabels: ['$50K', '$100K', '$150K', '$200K'],
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
        data: [50_000, 100_000, 150_000, 200_000],
        tooltipLabels: ['$50K', '$100K', '$150K', '$200K'],
      },
    ],
    valueAxis: { beginAtZero: true },
  };
}
