import { Component } from '@angular/core';

import { SkyModalBeforeCloseHandler } from '../modal-before-close-handler';
import { SkyModalInstance } from '../modal-instance';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './modal-with-close-confirm.component.fixture.html',
  standalone: false,
})
export class ModalWithCloseConfirmTestComponent {
  public unsavedWork = true;

  #modalInstance: SkyModalInstance;

  constructor(modalInstance: SkyModalInstance) {
    this.#modalInstance = modalInstance;
    this.#modalInstance.beforeClose.subscribe(
      (closeHandler: SkyModalBeforeCloseHandler) => {
        this.beforeCloseHandler(closeHandler);
      },
    );
  }

  public beforeCloseHandler(handler: SkyModalBeforeCloseHandler): void {
    if (!this.unsavedWork) {
      handler.closeModal();
    }
  }

  public toggleUnsavedWork(): void {
    this.unsavedWork = !this.unsavedWork;
  }
}
