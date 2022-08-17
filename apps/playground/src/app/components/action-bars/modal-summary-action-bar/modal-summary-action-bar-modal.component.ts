import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-modal-summary-action-bar-modal',
  templateUrl: './modal-summary-action-bar-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSummaryActionBarModalComponent {
  #modalInstance: SkyModalInstance;

  constructor(modalInstance: SkyModalInstance) {
    this.#modalInstance = modalInstance;
  }

  public closeModal(): void {
    this.#modalInstance.close();
  }

  public printHello(): void {
    console.log('Hello');
  }
}
