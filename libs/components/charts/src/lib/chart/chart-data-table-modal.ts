import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';

export abstract class SkyChartDataTableModalContext {
  public abstract readonly headingText: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyModalModule],
  templateUrl: './chart-data-table-modal.html',
})
export class SkyChartDataTableModal {
  protected readonly context = inject(SkyChartDataTableModalContext);
}
