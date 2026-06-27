import { Component, OnDestroy, inject } from '@angular/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

/**
 * @title Modal with banner
 */
@Component({
  selector: 'app-modals-modal-basic-with-controller-example',
  template: `<button
    class="sky-btn sky-btn-default"
    type="button"
    (click)="openModal()"
  >
    Open modal example
  </button>`,
})
export class ModalsModalBasicWithBannerExampleComponent implements OnDestroy {
  readonly #instances: SkyModalInstance[] = [];
  readonly #modalSvc = inject(SkyModalService);

  public ngOnDestroy(): void {
    this.#instances.forEach((i) => {
      i.close();
    });
  }

  public openModal(): void {
    const instance = this.#modalSvc.open(ModalComponent);

    this.#instances.push(instance);
  }
}
