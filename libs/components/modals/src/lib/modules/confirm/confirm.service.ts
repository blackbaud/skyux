import { Injectable } from '@angular/core';

import { SkyModalService } from '../modal/modal.service';

import { SkyConfirmConfig } from './confirm-config';
import { SKY_CONFIRM_CONFIG } from './confirm-config-token';
import { SkyConfirmInstance } from './confirm-instance';
import { SkyConfirmServiceInterface } from './confirm-service-interface';
import { SkyConfirmComponent } from './confirm.component';

/**
 * Launches a dialog.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyConfirmService implements SkyConfirmServiceInterface {
  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  /**
   * Opens a dialog using the specified options.
   * @param config Specifies configuration options for the dialog.
   */
  public open(config: SkyConfirmConfig): SkyConfirmInstance {
    const confirmInstance = new SkyConfirmInstance();

    this.#modalService.open(SkyConfirmComponent, {
      providers: [
        {
          provide: SKY_CONFIRM_CONFIG,
          useValue: config,
        },
        {
          provide: SkyConfirmInstance,
          useValue: confirmInstance,
        },
      ],
    });

    return confirmInstance;
  }
}
