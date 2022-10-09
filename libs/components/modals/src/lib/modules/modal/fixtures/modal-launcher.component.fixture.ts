import { Component, Type } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

/**
 * Use this component to launch modals using the modal service.
 * This is useful when you need a `fixture` instance in your test.
 */
@Component({
  selector: 'sky-modal-launcher-test',
  template: '',
})
export class ModalLauncherTestComponent {
  #modalSvc: SkyModalService;

  constructor(modalSvc: SkyModalService) {
    this.#modalSvc = modalSvc;
  }

  public launchModal(modalComponent: Type<Component>): void {
    this.#modalSvc.open(modalComponent);
  }
}
