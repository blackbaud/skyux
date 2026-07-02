import { Component, DestroyRef, inject, input } from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';
import {
  SkyChartDataTableModal,
  SkyChartDataTableModalContext,
} from './chart-data-table-modal';

@Component({
  imports: [SkyChartsResourcesModule, SkyDropdownModule],
  selector: 'sky-chart-controls',
  templateUrl: './chart-controls.html',
})
export class SkyChartControls {
  readonly #destroyRef = inject(DestroyRef);
  readonly #modalSvc = inject(SkyModalService);

  public readonly headingText = input.required<string>();

  protected openDataTableModal(): void {
    const instance = this.#modalSvc.open(SkyChartDataTableModal, {
      size: 'large',
      providers: [
        {
          provide: SkyChartDataTableModalContext,
          useValue: {
            headingText: this.headingText(),
          },
        },
      ],
    });

    this.#destroyRef.onDestroy(() => instance.close());
  }
}
