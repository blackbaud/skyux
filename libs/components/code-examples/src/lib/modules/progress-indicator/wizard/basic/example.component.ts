import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

/**
 * @title Wizard (progress indicator)
 */
@Component({
  selector: 'app-progress-indicator-wizard-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressIndicatorWizardBasicExampleComponent {
  readonly #modalSvc = inject(SkyModalService);

  protected openWizard(): void {
    this.#modalSvc.open(ModalComponent);
  }
}
