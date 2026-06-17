import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyActionButtonModule } from '@skyux/layout';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  imports: [SkyActionButtonModule, SkyModalModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './action-button-modal.component.html',
})
export class ActionButtonModalComponent {
  #instance = inject(SkyModalInstance);

  protected cancel(): void {
    this.#instance.cancel();
  }
}
