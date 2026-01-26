import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyBarChartConfig, SkyLineChartComponent } from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';

@Component({
  selector: 'app-bar-chart-demo',
  templateUrl: 'line-chart-demo.component.html',
  styles: [
    `
      :host {
        display: block;
        margin: 20px;
      }
    `,
  ],
  imports: [SkyLineChartComponent, SkyBoxModule, SkyFluidGridModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartDemoComponent {
  protected readonly chart1: SkyBarChartConfig = {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    series: [
      {
        label: '2022',
        data: [
          { label: '$25K', value: 25 },
          { label: '$28K', value: 28 },
          { label: '$22K', value: 22 },
          { label: '$35K', value: 35 },
          { label: '$30K', value: 30 },
          { label: '$45K', value: 45 },
          { label: '$38K', value: 38 },
          { label: '$42K', value: 42 },
          { label: '$50K', value: 50 },
          { label: '$40K', value: 40 },
          { label: '$55K', value: 55 },
          { label: '$48K', value: 48 },
        ],
      },
      {
        label: '2023',
        data: [
          { label: '$28K', value: 28 },
          { label: '$35K', value: 35 },
          { label: '$30K', value: 30 },
          { label: '$42K', value: 42 },
          { label: '$38K', value: 38 },
          { label: '$50K', value: 50 },
          { label: '$42K', value: 42 },
          { label: '$48K', value: 48 },
          { label: '$58K', value: 58 },
          { label: '$45K', value: 45 },
          { label: '$62K', value: 62 },
          { label: '$55K', value: 55 },
        ],
      },
      {
        label: '2024',
        data: [
          { label: '$32K', value: 32 },
          { label: '$42K', value: 42 },
          { label: '$35K', value: 35 },
          { label: '$48K', value: 48 },
          { label: '$40K', value: 40 },
          { label: '$55K', value: 55 },
          { label: '$48K', value: 48 },
          { label: '$52K', value: 52 },
          { label: '$65K', value: 65 },
          { label: '$50K', value: 50 },
          { label: '$68K', value: 68 },
          { label: '$60K', value: 60 },
        ],
      },
      {
        label: '2025',
        data: [
          { label: '$35K', value: 35 },
          { label: '$48K', value: 48 },
          { label: '$38K', value: 38 },
          { label: '$52K', value: 52 },
          { label: '$45K', value: 45 },
          { label: '$60K', value: 60 },
          { label: '$52K', value: 52 },
          { label: '$58K', value: 58 },
          { label: '$70K', value: 70 },
          { label: '$55K', value: 55 },
          { label: '$75K', value: 75 },
          { label: '$65K', value: 65 },
        ],
      },
    ],
    valueAxis: { beginAtZero: true },
  };
}
