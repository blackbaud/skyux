import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';
import type { SkyChartTable } from './chart-table';

export abstract class SkyChartTableModalContext {
  public abstract readonly headingText: string;
  public abstract readonly table: SkyChartTable | undefined;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChartsResourcesModule, SkyModalModule],
  styleUrl: './chart-table-modal.scss',
  templateUrl: './chart-table-modal.html',
})
export class SkyChartTableModal {
  protected readonly context = inject(SkyChartTableModalContext);
  protected readonly modal = inject(SkyModalInstance);
}
