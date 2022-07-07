import { Injectable, Optional } from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyModalService } from '@skyux/modals';

import { ErrorModalConfig } from './error-modal-config';
import { SkyErrorModalFormComponent } from './error-modal-form.component';

/**
 * Opens a modal to display a SKY UX-themed error message.
 * @deprecated We recommend using a standard modal with an error component instead.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyErrorModalService {
  #_logService: SkyLogService;

  constructor(
    private modal: SkyModalService,
    @Optional() logService?: SkyLogService
  ) {
    this.#_logService = logService;
  }
  /**
   * Specifies text for the the error message, including title, description, and action label.
   * @deprecated We recommend using a standard modal with an error component instead.
   */
  public open(config: ErrorModalConfig) {
    this.#_logService?.deprecated("SkyErrorService's open method", {
      deprecationMajorVersion: 6,
      replacementRecommendation:
        'We recommend using a standard modal with an error component instead.',
    });

    const providers = [{ provide: ErrorModalConfig, useValue: config }];

    this.modal.open(SkyErrorModalFormComponent, {
      ariaRole: 'alertdialog',
      providers: providers,
    });
  }
}
