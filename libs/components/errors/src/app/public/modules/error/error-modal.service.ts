import {
  Injectable
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  ErrorModalConfig
} from './error-modal-config';

import {
  SkyErrorModalFormComponent
} from './error-modal-form.component';

@Injectable()
export class SkyErrorModalService {
  constructor(private modal: SkyModalService) {}

  public open(config: ErrorModalConfig) {
    const providers = [{ provide: ErrorModalConfig, useValue: config }];

    this.modal.open(SkyErrorModalFormComponent, {
      ariaRole: 'alertdialog',
      providers: providers
    });
  }
}
