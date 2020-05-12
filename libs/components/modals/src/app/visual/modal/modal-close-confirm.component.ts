import {
  Component
} from '@angular/core';

import {
  SkyModalInstance,
  SkyConfirmService,
  SkyConfirmType,
  SkyConfirmCloseEventArgs,
  SkyModalBeforeCloseHandler
} from '../../public/public_api';

@Component({
  selector: 'sky-test-cmp-modal-close-confirm',
  templateUrl: './modal-close-confirm.component.html'
})
export class ModalCloseConfirmComponent {
  public hasUnsavedWork = true;
  public confirmationConfig = true;

  constructor(
    public instance: SkyModalInstance,
    public confirmService: SkyConfirmService
  ) {
    this.instance.beforeClose.subscribe((closeHandler: SkyModalBeforeCloseHandler) => {
      this.onClose(closeHandler);
    });
  }

  public onClose(closeHandler: SkyModalBeforeCloseHandler) {
    if (this.hasUnsavedWork) {
      this.confirmService.open({
        message: 'You have unsaved work. Are you sure you want to close this dialog?',
        type: SkyConfirmType.YesCancel
      }).closed.subscribe((closeArgs: SkyConfirmCloseEventArgs) => {
        if (closeArgs.action.toLowerCase() === 'yes') {
          closeHandler.closeModal();
        }
      });
    } else {
      closeHandler.closeModal();
    }
  }
}
