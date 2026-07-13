import { Component, Type, inject } from '@angular/core';

import { SkyModalService } from '../modal.service';

/**
 * Use this component to launch modals using the modal service.
 * This is useful when you need a `fixture` instance in your test.
 */
@Component({
  selector: 'sky-modal-launcher-test',
  template: '',
  standalone: false,
})
export class ModalLauncherTestComponent {
  readonly #modalSvc = inject(SkyModalService);

  public launchModal(modalComponent: Type<Component>): void {
    this.#modalSvc.open(modalComponent);
  }
}
