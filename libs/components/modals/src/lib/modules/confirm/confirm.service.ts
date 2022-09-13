import { Injectable, Optional } from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { SkyModalCloseArgs } from '../modal/modal-close-args';
import { SkyModalInstance } from '../modal/modal-instance';
import { SkyModalService } from '../modal/modal.service';

import { SkyConfirmCloseEventArgs } from './confirm-closed-event-args';
import { SkyConfirmConfig } from './confirm-config';
import { SKY_CONFIRM_CONFIG } from './confirm-config-token';
import { SkyConfirmInstance } from './confirm-instance';
import { SkyConfirmComponent } from './confirm.component';

/**
 * Launches a dialog.
 */
@Injectable({
  // Must be 'any' so that the modal component is created in the context of its module's injector.
  // If set to 'root', the component's dependency injections would only be derived from the root
  // injector and may loose context if the modal was opened from within a lazy-loaded module.
  providedIn: 'any',
})
export class SkyConfirmService {
  #modalService: SkyModalService;
  #logService: SkyLogService | undefined;

  constructor(
    modalService: SkyModalService,
    @Optional() logService?: SkyLogService
  ) {
    this.#modalService = modalService;
    this.#logService = logService;
  }

  /**
   * Opens a dialog using the specified options.
   * @param config Specifies configuration options for the dialog.
   */
  public open(config: SkyConfirmConfig): SkyConfirmInstance {
    if (config.buttons?.some((button) => button.autofocus != undefined)) {
      this.#logService?.deprecated('autofocus');
    }

    const modalInstance: SkyModalInstance = this.#modalService.open(
      SkyConfirmComponent,
      {
        providers: [
          {
            provide: SKY_CONFIRM_CONFIG,
            useValue: config,
          },
        ],
      }
    );

    const confirmInstance = new SkyConfirmInstance();

    modalInstance.closed.subscribe((args: SkyModalCloseArgs) => {
      let result: SkyConfirmCloseEventArgs = args.data;

      // The modal was closed using the ESC key.
      if (result === undefined) {
        result = {
          action: 'cancel',
        };
      }

      confirmInstance.closed.emit(result);
      confirmInstance.closed.complete();
    });

    return confirmInstance;
  }
}
