import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPieChartComponent, SkyPieChartConfig } from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';

@Component({
  selector: 'app-bar-chart-demo',
  templateUrl: 'pie-chart-demo.component.html',
  styles: [
    `
      :host {
        display: block;
        margin: 20px;
      }
    `,
  ],
  imports: [SkyPieChartComponent, SkyBoxModule, SkyFluidGridModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartDemoComponent {
  protected readonly chart1: SkyPieChartConfig = {
    title: undefined,
    subtitle: undefined,
    categories: ['Red', 'Blue', 'Green'],
    series: {
      label: 'Dataset 1',
      data: [
        { label: '$30', value: 30 },
        { label: '$50', value: 50 },
        { label: '$20', value: 20 },
      ],
    },
  };

  protected readonly chart2: SkyPieChartConfig = {
    title: undefined,
    subtitle: undefined,
    categories: ['Red', 'Blue', 'Green'],
    series: {
      label: 'Dataset 1',
      data: [
        { label: '$30', value: 30 },
        { label: '$50', value: 50 },
        { label: '$20', value: 20 },
      ],
    },
  };

  protected readonly chart3: SkyPieChartConfig = {
    title: undefined,
    subtitle: undefined,
    categories: ['Red', 'Blue', 'Green'],
    series: {
      label: 'Dataset 1',
      data: [
        { label: '$30', value: 30 },
        { label: '$50', value: 50 },
        { label: '$20', value: 20 },
      ],
    },
  };
}
