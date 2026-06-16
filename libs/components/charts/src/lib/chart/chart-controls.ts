import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';
import { ChartsResourcesModule } from '../shared/charts-resources.module';
import {
  SkyChartDataTableModal,
  SkyChartDataTableModalContext,
} from './chart-data-table-modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDropdownModule, ChartsResourcesModule],
  selector: 'sky-chart-controls',
  templateUrl: './chart-controls.html',
})
export class SkyChartControls {
  readonly #modalSvc = inject(SkyModalService);

  public readonly headingText = input.required<string>();

  protected openDataTableModal(): void {
    this.#modalSvc.open(SkyChartDataTableModal, {
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
  }
}
