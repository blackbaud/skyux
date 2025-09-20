import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-modal-summary-action-bar-modal',
  templateUrl: './modal-summary-action-bar-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyKeyInfoModule, SkyModalModule, SkySummaryActionBarModule],
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
