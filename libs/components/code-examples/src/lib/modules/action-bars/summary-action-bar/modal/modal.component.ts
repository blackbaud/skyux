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

  public onSecondaryActionClick(): void {
    alert('Secondary action button clicked.');
  }

  public onSecondaryAction2Click(): void {
    alert('Secondary action 2 button clicked.');
  }

  protected cancel(): void {
    this.#modalInstance.cancel();
  }

  public save(): void {
    this.#modalInstance.save();
  }
}
