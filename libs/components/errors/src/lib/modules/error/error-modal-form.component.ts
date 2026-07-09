import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyIdModule, SkyModalModule],
})
export class SkyErrorModalFormComponent {
  public readonly context = inject(ErrorModalConfig);
  public readonly instance = inject(SkyModalInstance);
}
