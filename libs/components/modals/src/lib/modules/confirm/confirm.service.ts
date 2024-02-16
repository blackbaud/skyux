import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

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
  providedIn: 'root',
})
export class SkyConfirmService {
  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  /**
   * Opens a dialog using the specified options.
   * @param config Specifies configuration options for the dialog.
   */
  public open(config: SkyConfirmConfig): SkyConfirmInstance {
    const modalInstance: SkyModalInstance = this.#modalService.open(
      SkyConfirmComponent,
      {
        providers: [
          {
            provide: SKY_CONFIRM_CONFIG,
            useValue: config,
          },
        ],
      },
    );

    const closedSubject = new ReplaySubject<SkyConfirmCloseEventArgs>();
    const confirmInstance = new SkyConfirmInstance(
      closedSubject.asObservable(),
    );

    modalInstance.closed.subscribe((args: SkyModalCloseArgs) => {
      let result: SkyConfirmCloseEventArgs = args.data;

      // The modal was closed using the ESC key.
      if (result === undefined) {
        result = {
          action: 'cancel',
        };
      }

      closedSubject.next(result);
      closedSubject.complete();
    });

    return confirmInstance;
  }
}
