import { Component, OnDestroy } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { WizardModalComponent } from './wizard-modal.component';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
})
export class WizardComponent implements OnDestroy {
  constructor(private modalService: SkyModalService) {}

  public ngOnDestroy(): void {
    this.modalService.dispose();
  }

  public openWizard(): void {
    this.modalService.open(WizardModalComponent);
  }
}
