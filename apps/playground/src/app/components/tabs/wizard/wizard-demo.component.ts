import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { WizardDemoModalComponent } from './wizard-demo-modal.component';
import { WizardDropdownDemoModalComponent } from './wizard-dropdown-demo-modal.component';

@Component({
  selector: 'app-wizard-demo',
  templateUrl: './wizard-demo.component.html',
  standalone: false,
})
export class WizardDemoComponent {
  readonly #modal = inject(SkyModalService);

  public openWizard(): void {
    this.#modal.open(WizardDemoModalComponent);
  }

  public openDropdownWizard(): void {
    this.#modal.open(WizardDropdownDemoModalComponent);
  }
}
