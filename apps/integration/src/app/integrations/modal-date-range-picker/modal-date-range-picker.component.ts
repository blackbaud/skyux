import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalDateRangePickerModalComponent } from './modal-date-range-picker-modal.component';

@Component({
  selector: 'app-modal-date-range-picker',
  templateUrl: './modal-date-range-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDateRangePickerComponent {
  public isWaiting = false;

  #modalService = inject(SkyModalService);

  public openModal(): void {
    this.#modalService.open(ModalDateRangePickerModalComponent);
  }

  public openFullPageModal(): void {
    this.#modalService.open(ModalDateRangePickerModalComponent, {
      fullPage: true,
    });
  }
}
