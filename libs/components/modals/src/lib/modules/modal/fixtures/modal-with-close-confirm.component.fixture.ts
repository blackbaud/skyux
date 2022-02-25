import { Component } from '@angular/core';

import { SkyModalBeforeCloseHandler } from '../modal-before-close-handler';

import { SkyModalInstance } from '../modal-instance';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './modal-with-close-confirm.component.fixture.html',
})
export class ModalWithCloseConfirmTestComponent {
  public unsavedWork = true;

  constructor(private modalInstance: SkyModalInstance) {
    this.modalInstance.beforeClose.subscribe(
      (closeHandler: SkyModalBeforeCloseHandler) => {
        this.beforeCloseHandler(closeHandler);
      }
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
