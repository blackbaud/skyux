import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyConfirmCloseEventArgs,
  SkyConfirmService,
  SkyConfirmType,
  SkyModalBeforeCloseHandler,
  SkyModalInstance,
  SkyModalModule,
} from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-close-confirm',
  templateUrl: './modal-close-confirm.component.html',
  imports: [FormsModule, SkyModalModule],
})
export class ModalCloseConfirmComponent {
  public showHelp = false;
  public hasUnsavedWork = true;
  public confirmationConfig = true;

  constructor(
    public instance: SkyModalInstance,
    public confirmService: SkyConfirmService,
  ) {
    this.instance.beforeClose.subscribe(
      (closeHandler: SkyModalBeforeCloseHandler) => {
        this.onClose(closeHandler);
      },
    );
  }

  public onClose(closeHandler: SkyModalBeforeCloseHandler): void {
    if (this.hasUnsavedWork) {
      this.confirmService
        .open({
          message:
            'You have unsaved work. Are you sure you want to close this dialog?',
          type: SkyConfirmType.YesCancel,
        })
        .closed.subscribe((closeArgs: SkyConfirmCloseEventArgs) => {
          if (closeArgs.action.toLowerCase() === 'yes') {
            closeHandler.closeModal();
          }
        });
    } else {
      closeHandler.closeModal();
    }
  }
}
