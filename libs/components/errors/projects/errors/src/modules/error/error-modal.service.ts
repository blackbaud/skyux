import { Injectable } from '@angular/core';

import { SkyModalService } from '@skyux/modals';

import { ErrorModalConfig } from './error-modal-config';

import { SkyErrorModalFormComponent } from './error-modal-form.component';

/**
 * Opens a modal to display a SKY UX-themed error message.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyErrorModalService {
  constructor(private modal: SkyModalService) {}
  /**
   * Specifies text for the the error message, including title, description, and action label.
   */
  public open(config: ErrorModalConfig) {
    const providers = [{ provide: ErrorModalConfig, useValue: config }];

    this.modal.open(SkyErrorModalFormComponent, {
      ariaRole: 'alertdialog',
      providers: providers,
    });
  }
}
