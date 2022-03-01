import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

import { ErrorModalConfig } from './error-modal-config';

/**
 * @internal
 */
@Component({
  selector: 'sky-error-modal-form',
  templateUrl: './error-modal-form.component.html',
  styleUrls: ['./error-modal-form.component.scss'],
})
export class SkyErrorModalFormComponent {
  constructor(
    public context: ErrorModalConfig,
    public instance: SkyModalInstance
  ) {}
}
