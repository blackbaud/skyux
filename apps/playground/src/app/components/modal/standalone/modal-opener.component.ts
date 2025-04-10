import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalStandaloneComponent } from './modal-standalone.component';

/**
 * This standalone route opens a standalone modal component to ensure providers are correctly setup.
 */
@Component({
  template: `
    <button class="sky-btn sky-btn-default" type="button" (click)="open()">
      Open modal
    </button>
  `,
})
export default class ModalOpenerComponent {
  #modalSvc = inject(SkyModalService);

  protected open(): void {
    this.#modalSvc.open(ModalStandaloneComponent, {});
  }
}
