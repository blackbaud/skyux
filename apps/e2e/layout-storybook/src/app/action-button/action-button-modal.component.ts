import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SkyActionButtonModule } from '@skyux/layout';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  imports: [CommonModule, SkyActionButtonModule, SkyModalModule],
  templateUrl: './action-button-modal.component.html',
})
export class ActionButtonModalComponent {
  #instance = inject(SkyModalInstance);

  protected cancel(): void {
    this.#instance.cancel();
  }
}
