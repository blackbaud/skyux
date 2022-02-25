import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyModalService } from '@skyux/modals';

import { WizardDemoModalComponent } from './wizard-demo-modal.component';

@Component({
  selector: 'app-wizard-demo',
  templateUrl: './wizard-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardDemoComponent {
  constructor(private modal: SkyModalService) {}

  public openWizard(): void {
    this.modal.open(WizardDemoModalComponent);
  }
}
