import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { WizardDemoModalComponent } from './wizard-demo-modal.component';

@Component({
  selector: 'app-wizard-demo',
  templateUrl: './wizard-demo.component.html',
})
export class WizardDemoComponent {
  readonly #modalSvc = inject(SkyModalService);

  public modalSize = 'large';

  public openWizard(): void {
    this.#modalSvc.open(WizardDemoModalComponent, { size: this.modalSize });
  }
}
