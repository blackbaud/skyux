import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import {
  SkyChartTableModal,
  SkyChartTableModalContext,
} from '../chart-table/chart-table-modal';
import { SkyChartTableService } from '../chart-table/chart-table-service';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChartsResourcesModule, SkyDropdownModule],
  selector: 'sky-chart-controls',
  templateUrl: './chart-controls.html',
})
export class SkyChartControls {
  readonly #destroyRef = inject(DestroyRef);
  readonly #modalSvc = inject(SkyModalService);
  readonly #tableSvc = inject(SkyChartTableService);

  public readonly headingText = input.required<string>();

  /**
   * The plot's data table. The context menu's only action is viewing the
   * data table, so the menu renders only while a table is available — a
   * plot that has not published one (no data yet, or still loading for the
   * first time) has no actions to offer.
   */
  protected readonly table = this.#tableSvc.table;

  protected openDataTableModal(): void {
    const instance = this.#modalSvc.open(SkyChartTableModal, {
      size: 'large',
      providers: [
        {
          provide: SkyChartTableModalContext,
          useValue: {
            headingText: this.headingText(),
            table: this.#tableSvc.table(),
          },
        },
      ],
    });

    this.#destroyRef.onDestroy(() => instance.close());
  }
}
