import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  SkyConfirmButtonAction,
  SkyConfirmInstance,
  SkyConfirmService,
  SkyConfirmType
} from '../../public/public_api';

@Component({
  selector: 'app-confirm-docs',
  templateUrl: './confirm-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDocsComponent {

  public selectedAction: SkyConfirmButtonAction;

  public selectedText: string;

  constructor(
    private confirmService: SkyConfirmService,
    private changeRef: ChangeDetectorRef
  ) { }

  public openOKConfirm() {
    const dialog: SkyConfirmInstance = this.confirmService.open({
      message: 'Use the OK button type for information that does not require user action.',
      type: SkyConfirmType.OK
    });

    dialog.closed.subscribe((result: any) => {
      this.selectedText = undefined;
      this.selectedAction = result.action;
      this.changeRef.markForCheck();
    });
  }

  public openCustomConfirm() {
    const buttons = [
      { text: 'Save', action: 'save', styleType: 'primary' },
      { text: 'Delete', action: 'delete' },
      { text: 'Cancel', action: 'cancel', autofocus: true, styleType: 'link' }
    ];

    const dialog: SkyConfirmInstance = this.confirmService.open({
      message: 'Use the Custom button type to define your own buttons.',
      body: 'Labels should clearly indicate the action occurs when users select the button.',
      type: SkyConfirmType.Custom,
      buttons
    });

    dialog.closed.subscribe((result: any) => {
      this.selectedAction = result.action;

      buttons.some((button: any) => {
        if (button.action === result.action) {
          this.selectedText = button.text;
          return true;
        }
      });
      this.changeRef.markForCheck();
    });
  }
}
