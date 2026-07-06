import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';
import type { SkyChartTable } from './chart-table';

export abstract class SkyChartDataTableModalContext {
  public abstract readonly headingText: string;
  public abstract readonly table: SkyChartTable | undefined;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChartsResourcesModule, SkyModalModule],
  templateUrl: './chart-data-table-modal.html',
})
export class SkyChartDataTableModal {
  protected readonly context = inject(SkyChartDataTableModalContext);
  protected readonly modal = inject(SkyModalInstance);
}
