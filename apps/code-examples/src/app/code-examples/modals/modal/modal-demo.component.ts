import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalDemoModalComponent } from './modal-demo-modal.component';

@Component({
  selector: 'app-modal-demo',
  templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
  public helpKey = 'help-demo.html';

  public modalSize = 'medium';

  constructor(private modal: SkyModalService) {}

  public onOpenModalClick(): void {
    const modalInstanceType: any = ModalDemoModalComponent;
    const options: any = {
      helpKey: this.helpKey,
      size: this.modalSize,
    };

    this.modal.open(modalInstanceType, options);
  }
}
