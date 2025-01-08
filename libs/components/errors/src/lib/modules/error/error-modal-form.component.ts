import { Component } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { ErrorModalConfig } from './error-modal-config';

/**
 * @internal
 */
@Component({
  selector: 'sky-error-modal-form',
  templateUrl: './error-modal-form.component.html',
  styleUrls: ['./error-modal-form.component.scss'],
  imports: [SkyIdModule, SkyModalModule],
})
export class SkyErrorModalFormComponent {
  constructor(
    public context: ErrorModalConfig,
    public instance: SkyModalInstance,
  ) {}
}
