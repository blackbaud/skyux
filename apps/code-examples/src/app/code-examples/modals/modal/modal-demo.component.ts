import { Component } from '@angular/core';
import { SkyModalConfiguration, SkyModalService } from '@skyux/modals';

import { ModalDemoModalComponent } from './modal-demo-modal.component';

@Component({
  selector: 'app-modal-demo',
  templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
  public helpKey = 'help-demo.html';

  public modalSize = 'medium';

  #modalSvc: SkyModalService;

  constructor(modalSvc: SkyModalService) {
    this.#modalSvc = modalSvc;
  }

  public onOpenModalClick(): void {
    const options: SkyModalConfiguration = {
      helpKey: this.helpKey,
      size: this.modalSize,
    };

    this.#modalSvc.open(ModalDemoModalComponent, options);
  }
}
