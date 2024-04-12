import { Component, OnDestroy, inject } from '@angular/core';
import {
  SkyModalError,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

import { ModalContext } from './modal-context';
import { ModalComponent } from './modal.component';

@Component({
  imports: [],
  standalone: true,
  template: `<button
    class="sky-btn sky-btn-default"
    type="button"
    (click)="openModal()"
  >
    Open modal
  </button>`,
})
export class DemoComponent implements OnDestroy {
  public hasErrors = false;

  protected errors: SkyModalError[] = [];

  readonly #instances: SkyModalInstance[] = [];
  readonly #modalSvc = inject(SkyModalService);

  public ngOnDestroy(): void {
    this.#instances.forEach((i) => i.close());
  }

  public openModal(): void {
    const instance = this.#modalSvc.open(ModalComponent, {
      providers: [
        {
          provide: ModalContext,
          useValue: { value1: 'Hello!' },
        },
      ],
    });

    instance.beforeClose.subscribe((handler) => {
      if (this.hasErrors && handler.closeArgs.reason !== 'cancel') {
        this.errors = [
          {
            message: 'Something bad happened.',
          },
        ];
      } else {
        handler.closeModal();
      }
    });

    this.#instances.push(instance);
  }
}
