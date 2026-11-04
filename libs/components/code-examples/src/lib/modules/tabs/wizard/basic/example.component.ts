import { Component, inject } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

/**
 * @title Wizard in a modal
 */
@Component({
  selector: 'app-tabs-wizard-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyButton],
})
export class TabsWizardBasicExampleComponent {
  readonly #modalSvc = inject(SkyModalService);

  #modalSize = 'large';

  protected openWizard(): void {
    this.#modalSvc.open(ModalComponent, { size: this.#modalSize });
  }
}
