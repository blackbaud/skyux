import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, SkyModalModule],
})
export class ModalCloseConfirmComponent {
  public showHelp = false;
  public hasUnsavedWork = true;
  public confirmationConfig = true;

  public readonly instance = inject(SkyModalInstance);
  public readonly confirmService = inject(SkyConfirmService);

  constructor() {
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
