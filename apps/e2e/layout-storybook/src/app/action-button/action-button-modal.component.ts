import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyActionButtonModule } from '@skyux/layout';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  imports: [CommonModule, SkyActionButtonModule, SkyModalModule],
  templateUrl: './action-button-modal.component.html',
})
export class ActionButtonModalComponent {
  protected ready = toSignal(inject(FontLoadingService).ready(true));

  #instance = inject(SkyModalInstance);

  protected cancel(): void {
    this.#instance.cancel();
  }
}
