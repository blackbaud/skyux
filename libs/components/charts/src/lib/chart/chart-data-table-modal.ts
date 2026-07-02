import { Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

export abstract class SkyChartDataTableModalContext {
  public abstract readonly headingText: string;
}

@Component({
  imports: [SkyChartsResourcesModule, SkyModalModule],
  templateUrl: './chart-data-table-modal.html',
})
export class SkyChartDataTableModal {
  protected readonly context = inject(SkyChartDataTableModalContext);
  protected readonly modal = inject(SkyModalInstance);
}
