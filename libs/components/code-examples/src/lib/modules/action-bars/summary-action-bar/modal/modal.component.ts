import { Component, inject } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [SkyKeyInfoModule, SkyModalModule, SkySummaryActionBarModule],
})
export class ModalComponent {
  readonly #modalInstance = inject(SkyModalInstance);

  protected onSecondaryActionClick(): void {
    alert('Secondary action button clicked.');
  }

  protected onSecondaryAction2Click(): void {
    alert('Secondary action 2 button clicked.');
  }

  protected cancel(): void {
    this.#modalInstance.cancel();
  }

  protected save(): void {
    this.#modalInstance.save();
  }
}
