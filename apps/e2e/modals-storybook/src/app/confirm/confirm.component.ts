import { Component } from '@angular/core';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  standalone: false,
})
export class ConfirmComponent {
  #confirmService: SkyConfirmService;

  constructor(confirmService: SkyConfirmService) {
    this.#confirmService = confirmService;
  }

  public openOkConfirm(): void {
    this.#confirmService.open({
      message: 'OK Confirm message',
      body: 'OK Confirm body',
      type: SkyConfirmType.OK,
    });
  }

  public openCustomConfirm(): void {
    this.#confirmService.open({
      message: 'Custom Confirm message',
      body: 'Custom Confirm body',
      type: SkyConfirmType.Custom,
      buttons: [
        { text: 'Primary', action: 'save', styleType: 'primary' },
        { text: 'Danger', action: 'delete', styleType: 'danger' },
        { text: 'Default', action: 'close' },
        { text: 'Link', action: 'cancel', styleType: 'link' },
      ],
    });
  }
}
