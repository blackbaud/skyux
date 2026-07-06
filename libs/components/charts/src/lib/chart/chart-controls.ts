import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';
import {
  SkyChartDataTableModal,
  SkyChartDataTableModalContext,
} from './chart-data-table-modal';
import { SkyChartTableService } from './chart-table.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChartsResourcesModule, SkyDropdownModule],
  selector: 'sky-chart-controls',
  templateUrl: './chart-controls.html',
})
export class SkyChartControls {
  readonly #destroyRef = inject(DestroyRef);
  readonly #modalSvc = inject(SkyModalService);
  // Optional so the component can be tested in isolation from `sky-chart`.
  readonly #tableService = inject(SkyChartTableService, { optional: true });

  public readonly headingText = input.required<string>();

  protected openDataTableModal(): void {
    const instance = this.#modalSvc.open(SkyChartDataTableModal, {
      size: 'large',
      providers: [
        {
          provide: SkyChartDataTableModalContext,
          useValue: {
            headingText: this.headingText(),
            table: this.#tableService?.table(),
          },
        },
      ],
    });

    this.#destroyRef.onDestroy(() => instance.close());
  }
}
