import { Component, OnDestroy, inject } from '@angular/core';
import { SkyHelpService } from '@skyux/core';
import {
  SkyModalError,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

import { MyHelpService } from './help.service';
import { ModalContext } from './modal-context';
import { ModalComponent } from './modal.component';

/**
 * @title Modal with basic setup, tested with controller
 */
@Component({
  selector: 'app-modals-modal-basic-with-controller-example',
  template: `<button
    class="sky-btn sky-btn-default"
    type="button"
    (click)="openModal()"
  >
    Open modal
  </button>`,
})
export class ModalsModalBasicWithControllerExampleComponent implements OnDestroy {
  public hasErrors = false;

  protected errors: SkyModalError[] = [];

  readonly #instances: SkyModalInstance[] = [];
  readonly #modalSvc = inject(SkyModalService);

  public ngOnDestroy(): void {
    this.#instances.forEach((i) => {
      i.close();
    });
  }

  public openModal(): void {
    const instance = this.#modalSvc.open(ModalComponent, {
      providers: [
        {
          provide: ModalContext,
          useValue: { value1: 'Hello!' },
        },
        // NOTE: The help service is normally provided at the application root, but
        // it is added here purely for demonstration purposes.
        // See: https://developer.blackbaud.com/skyux/learn/develop/global-help
        {
          provide: SkyHelpService,
          useExisting: MyHelpService,
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
