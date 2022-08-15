import { Component } from '@angular/core';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent {
  constructor(private confirmService: SkyConfirmService) {}

  public openOkConfirm(): void {
    this.confirmService.open({
      message: 'OK Confirm message',
      body: 'OK Confirm body',
      type: SkyConfirmType.OK,
    });
  }

  public openCustomConfirm(): void {
    this.confirmService.open({
      message: 'Custom Confirm message',
      body: 'Custom Confirm body',
      type: SkyConfirmType.Custom,
      buttons: [
        { text: 'Primary', action: 'save', styleType: 'primary' },
        { text: 'Secondary', action: 'save' },
        { text: 'Link', action: 'save', styleType: 'link' },
      ],
    });
  }
}
