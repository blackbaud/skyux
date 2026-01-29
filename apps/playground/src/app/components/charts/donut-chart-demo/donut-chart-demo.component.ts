import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyDonutChartComponent, SkyDonutChartConfig } from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';

@Component({
  selector: 'app-donut-chart-demo',
  templateUrl: 'donut-chart-demo.component.html',
  styles: [
    `
      :host {
        display: block;
        margin: 20px;
      }
    `,
  ],
  imports: [SkyDonutChartComponent, SkyBoxModule, SkyFluidGridModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartDemoComponent {
  protected assetCategories = [
    {
      name: 'Securities - WP',
      value: 5_000_000,
      percentage: 50,
      label: '$5,000,000',
    },
    {
      name: 'Income/Compensation - WP',
      value: 2_500_000,
      percentage: 25,
      label: '$2,500,000',
    },
    {
      name: 'Private Co. Valuation - WP',
      value: 1_500_000,
      percentage: 15,
      label: '$1,500,000',
    },
    {
      name: 'Real Estate - WP',
      value: 1_000_000,
      percentage: 10,
      label: '$1,000,000',
    },
  ];

  protected readonly chart1: SkyDonutChartConfig = {
    title: undefined,
    subtitle: undefined,
    categories: this.assetCategories.map((c) => c.name),
    series: {
      label: '',
      data: this.assetCategories.map((c) => ({
        label: c.label,
        value: c.value,
      })),
    },
  };

  protected readonly chart2: SkyDonutChartConfig = {
    title: undefined,
    subtitle: undefined,
    categories: this.assetCategories.map((c) => c.name),
    series: {
      label: '',
      data: this.assetCategories.map((c) => ({
        label: c.label,
        value: c.value,
      })),
    },
  };

  protected readonly chart3: SkyDonutChartConfig = {
    title: undefined,
    subtitle: undefined,
    categories: this.assetCategories.map((c) => c.name),
    series: {
      label: '',
      data: this.assetCategories.map((c) => ({
        label: c.label,
        value: c.value,
      })),
    },
  };
}
