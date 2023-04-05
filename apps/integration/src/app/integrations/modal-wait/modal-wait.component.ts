import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalWaitModalComponent } from './modal-wait-modal.component';

@Component({
  selector: 'app-modal-wait',
  templateUrl: './modal-wait.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalWaitComponent {
  public isWaiting = false;

  #changeDetector = inject(ChangeDetectorRef);
  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public openModal(): void {
    this.#modalService.open(ModalWaitModalComponent);
  }

  public triggerWait(): void {
    this.isWaiting = true;
    setTimeout(
      /* istanbul ignore next */ () => {
        this.isWaiting = false;
        this.#changeDetector.markForCheck();
      },
      5000
    );
  }
}
