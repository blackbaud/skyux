import { Component, inject } from '@angular/core';
import {
  SkyConfirmButtonConfig,
  SkyConfirmInstance,
  SkyConfirmService,
  SkyConfirmType,
} from '@skyux/modals';

/**
 * @title Confirm, tested with harness
 */
@Component({
  selector: 'app-modals-confirm-basic-with-harness-example',
  standalone: true,
  templateUrl: './example.component.html',
})
export class ModalsConfirmBasicWithHarnessExampleComponent {
  protected selectedAction: string | undefined;
  protected selectedText: string | undefined;

  readonly #confirmSvc = inject(SkyConfirmService);

  protected openOKConfirm(): void {
    const dialog: SkyConfirmInstance = this.#confirmSvc.open({
      message:
        'Cannot delete invoice because it has vendor, credit memo, or purchase order activity.',
    });

    dialog.closed.subscribe((result) => {
      this.selectedText = undefined;
      this.selectedAction = result.action;
    });
  }

  protected openTwoActionConfirm(): void {
    const buttons: SkyConfirmButtonConfig[] = [
      { text: 'Finalize', action: 'save', styleType: 'primary' },
      { text: 'Cancel', action: 'cancel', styleType: 'link' },
    ];

    const dialog: SkyConfirmInstance = this.#confirmSvc.open({
      message: 'Finalize report cards?',
      body: 'Grades cannot be changed once the report cards are finalized.',
      type: SkyConfirmType.Custom,
      buttons,
    });

    dialog.closed.subscribe((result) => {
      this.selectedAction = result.action;

      for (const button of buttons) {
        if (button.action === result.action) {
          this.selectedText = button.text;
          break;
        }
      }
    });
  }

  protected openThreeActionConfirm(): void {
    const buttons: SkyConfirmButtonConfig[] = [
      { text: 'Save', action: 'save', styleType: 'primary' },
      { text: 'Delete', action: 'delete' },
      { text: 'Keep working', action: 'cancel', styleType: 'link' },
    ];

    const dialog = this.#confirmSvc.open({
      message: 'Save your changes before leaving?',
      type: SkyConfirmType.Custom,
      buttons,
    });

    dialog.closed.subscribe((result) => {
      this.selectedAction = result.action;

      for (const button of buttons) {
        if (button.action === result.action) {
          this.selectedText = button.text;
          break;
        }
      }
    });
  }

  protected openDeleteConfirm(): void {
    const buttons: SkyConfirmButtonConfig[] = [
      { text: 'Delete', action: 'delete', styleType: 'danger' },
      { text: 'Cancel', action: 'cancel', styleType: 'link' },
    ];

    const dialog = this.#confirmSvc.open({
      message: 'Delete this account?',
      body: 'Deleting this account may affect processes that are currently running.',
      type: SkyConfirmType.Custom,
      buttons,
    });

    dialog.closed.subscribe((result) => {
      this.selectedAction = result.action;

      for (const button of buttons) {
        if (button.action === result.action) {
          this.selectedText = button.text;
          break;
        }
      }
    });
  }
}
