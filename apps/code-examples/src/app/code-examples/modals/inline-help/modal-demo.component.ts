import { Component } from '@angular/core';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { ModalDemoModalComponent } from './modal-demo-modal.component';

@Component({
  selector: 'app-modal-demo',
  templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent {
  public modalSize = 'medium';

  #modalSvc: SkyModalService;

  constructor(modalSvc: SkyModalService) {
    this.#modalSvc = modalSvc;
  }

  public onOpenModalClick(): void {
    const options: SkyModalConfigurationInterface = {
      size: this.modalSize,
    };

    this.#modalSvc.open(ModalDemoModalComponent, options);
  }
}
