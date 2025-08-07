import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalWaitModalComponent } from './modal-wait-modal.component';

@Component({
  selector: 'app-modal-wait',
  templateUrl: './modal-wait.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ModalWaitComponent {
  public isWaiting = false;

  #modalService = inject(SkyModalService);

  public openModal(): void {
    this.#modalService.open(ModalWaitModalComponent);
  }

  public triggerWait(): void {
    this.isWaiting = true;
  }
}
