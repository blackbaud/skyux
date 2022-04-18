import { Component } from '@angular/core';
import {
  SkyConfirmButtonConfig,
  SkyConfirmInstance,
  SkyConfirmService,
  SkyConfirmType,
} from '@skyux/modals';

@Component({
  selector: 'app-confirm-demo',
  templateUrl: './confirm-demo.component.html',
})
export class ConfirmDemoComponent {
  public selectedAction: string | undefined;

  public selectedText: string | undefined;

  constructor(private confirmService: SkyConfirmService) {}

  public openOKConfirm(): void {
    const dialog: SkyConfirmInstance = this.confirmService.open({
      message:
        'Use the OK button type for information that does not require user action.',
      type: SkyConfirmType.OK,
    });

    dialog.closed.subscribe((result) => {
      this.selectedText = undefined;
      this.selectedAction = result.action;
    });
  }

  public openCustomConfirm(): void {
    const buttons: SkyConfirmButtonConfig[] = [
      { text: 'Save', action: 'save', styleType: 'primary' },
      { text: 'Delete', action: 'delete' },
      { text: 'Cancel', action: 'cancel', styleType: 'link' },
    ];

    const dialog: SkyConfirmInstance = this.confirmService.open({
      message: 'Use the Custom button type to define your own buttons.',
      body: 'Labels should clearly indicate the action occurs when users select the button.',
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
