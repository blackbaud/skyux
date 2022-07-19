import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalViewkeptToolbarsModalComponent } from './modal-viewkept-toolbars-modal.component';

@Component({
  selector: 'app-modal-viewkept-toolbars',
  templateUrl: './modal-viewkept-toolbars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalViewkeptToolbarsComponent {
  #modalService: SkyModalService | undefined;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public openModal(): void {
    this.#modalService.open(ModalViewkeptToolbarsModalComponent);
  }
}
