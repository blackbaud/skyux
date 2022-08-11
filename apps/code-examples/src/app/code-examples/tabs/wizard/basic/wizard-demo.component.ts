import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { WizardDemoModalComponent } from './wizard-demo-modal.component';

@Component({
  selector: 'app-wizard-demo',
  templateUrl: './wizard-demo.component.html',
})
export class WizardDemoComponent {
  constructor(private modalService: SkyModalService) {}

  public modalSize = 'large';

  public openWizard(): void {
    this.modalService.open(WizardDemoModalComponent, { size: this.modalSize });
  }
}
