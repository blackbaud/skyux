import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyModalService } from '@skyux/modals';
import { FontLoadingService } from '@skyux/storybook';

import { ActionButtonModalComponent } from './action-button-modal.component';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  standalone: false,
})
export class ActionButtonComponent {
  #modalSvc = inject(SkyModalService);

  protected ready = toSignal(inject(FontLoadingService).ready(true));

  protected openActionButtonModal(): void {
    this.#modalSvc.open(ActionButtonModalComponent);
  }
}
