import { Component, inject } from '@angular/core';
import { SkyModalConfigurationSizeType, SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

/**
 * @title Wizard in a modal
 */
@Component({
  selector: 'app-tabs-wizard-basic-example',
  templateUrl: './example.component.html',
})
export class TabsWizardBasicExampleComponent {
  readonly #modalSvc = inject(SkyModalService);

  #modalSize: SkyModalConfigurationSizeType = 'large';

  protected openWizard(): void {
    this.#modalSvc.open(ModalComponent, { size: this.#modalSize });
  }
}
