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
  #modalSvc: SkyModalService;
  #logSvc: SkyLogService | undefined;

  constructor(
    modalSvc: SkyModalService,
    @Optional() logService?: SkyLogService,
  ) {
    this.#modalSvc = modalSvc;
    this.#logSvc = logService;
  }
  /**
   * Text for the the error message, including title, description, and action label.
   * @deprecated We recommend using a standard modal with an error component instead.
   */
  public open(config: ErrorModalConfig): void {
    this.#logSvc?.deprecated("SkyErrorModalService's open method", {
      deprecationMajorVersion: 6,
      replacementRecommendation:
        'We recommend using a standard modal with an error component instead.',
    });

    const providers = [{ provide: ErrorModalConfig, useValue: config }];

    this.#modalSvc.open(SkyErrorModalFormComponent, {
      ariaRole: 'alertdialog',
      providers: providers,
    });
  }
}
