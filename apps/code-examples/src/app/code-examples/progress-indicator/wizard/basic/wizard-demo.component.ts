import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { WizardDemoModalComponent } from './wizard-demo-modal.component';

@Component({
  selector: 'app-wizard-demo',
  templateUrl: './wizard-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardDemoComponent {
  readonly #modalSvc = inject(SkyModalService);

  public openWizard(): void {
    this.#modalSvc.open(WizardDemoModalComponent);
  }
}
