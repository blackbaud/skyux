import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalColorpickerModalComponent } from './modal-colorpicker-modal.component';

@Component({
  selector: 'app-modal-colorpicker',
  templateUrl: './modal-colorpicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ModalColorpickerComponent {
  public isWaiting = false;

  #modalService = inject(SkyModalService);

  public openModal(): void {
    this.#modalService.open(ModalColorpickerModalComponent);
  }
}
