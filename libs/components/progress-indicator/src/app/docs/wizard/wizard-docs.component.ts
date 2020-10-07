import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  WizardDemoModalComponent
} from './wizard-docs-demo-modal.component';

@Component({
  selector: 'app-wizard-docs',
  templateUrl: './wizard-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardDocsComponent {

  constructor(
    private modal: SkyModalService
  ) { }

  public openWizard(): void {
    this.modal.open(WizardDemoModalComponent);
  }

}
