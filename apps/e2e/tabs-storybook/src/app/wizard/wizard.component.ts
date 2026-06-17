import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { WizardModalComponent } from './wizard-modal.component';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class WizardComponent implements OnDestroy {
  readonly #modalService = inject(SkyModalService);

  public ngOnDestroy(): void {
    this.#modalService.dispose();
  }

  public openWizard(): void {
    this.#modalService.open(WizardModalComponent);
  }
}
