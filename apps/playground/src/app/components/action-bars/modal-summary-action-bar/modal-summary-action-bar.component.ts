import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalSummaryActionBarModalComponent } from './modal-summary-action-bar-modal.component';

@Component({
  selector: 'app-modal-summary-action-bar',
  templateUrl: './modal-summary-action-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ModalSummaryActionBarComponent {
  #modalSvc: SkyModalService;

  constructor(modalSvc: SkyModalService) {
    this.#modalSvc = modalSvc;
  }

  public openModal(): void {
    this.#modalSvc.open(ModalSummaryActionBarModalComponent, {
      fullPage: true,
    });
  }
}
