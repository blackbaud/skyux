import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { ModalContext } from './modal-context';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyButton, SkyModalModule],
})
export class ModalComponent {
  protected readonly context = inject(ModalContext);
  protected readonly instance = inject(SkyModalInstance);

  protected submit(): void {
    this.instance.close(undefined, 'save');
  }
}
