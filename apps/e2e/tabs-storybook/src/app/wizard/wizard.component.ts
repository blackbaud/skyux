import { Component, OnDestroy } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { WizardModalComponent } from './wizard-modal.component';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  standalone: false,
})
export class WizardComponent implements OnDestroy {
  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public ngOnDestroy(): void {
    this.#modalService.dispose();
  }

  public openWizard(): void {
    this.#modalService.open(WizardModalComponent);
  }
}
