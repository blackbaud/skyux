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
