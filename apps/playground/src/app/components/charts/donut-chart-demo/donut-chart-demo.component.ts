import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyDonutChartComponent, SkyDonutChartConfig } from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyFluidGridModule } from '@skyux/layout';

import { ChartDemoUtils } from '../shared/chart-demo-utils';

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
      label: '$5,000,000',
    },
    {
      name: 'Income/Compensation - WP',
      value: 2_500_000,
      label: '$2,500,000',
    },
    {
      name: 'Private Co. Valuation - WP',
      value: 1_500_000,
      label: '$1,500,000',
    },
    {
      name: 'Real Estate - WP',
      value: 1_000_000,
      label: '$1,000,000',
    },
  ];

  protected readonly chart1: SkyDonutChartConfig = {
    series: {
      label: 'Series 1',
      data: this.assetCategories.map((c) => ({
        category: c.name,
        label: c.label,
        value: c.value,
      })),
    },
  };

  protected readonly chart2: SkyDonutChartConfig = {
    series: {
      label: 'Series 1',
      data: ChartDemoUtils.numbers({
        count: 4,
        min: 1,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 4 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
  };

  protected readonly chart3: SkyDonutChartConfig = {
    series: {
      label: 'Series 1',
      data: ChartDemoUtils.numbers({
        count: 8,
        min: 1,
        max: 100,
        decimals: 0,
      }).map((value, index) => {
        return {
          category: ChartDemoUtils.months({ count: 8 })[index],
          label: `$${value}`,
          value,
        };
      }),
    },
  };
}
