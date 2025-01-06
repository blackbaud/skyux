import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ActionButtonModalComponent } from './action-button-modal.component';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  standalone: false,
})
export class ActionButtonComponent {
  #modalSvc = inject(SkyModalService);

  protected openActionButtonModal(): void {
    this.#modalSvc.open(ActionButtonModalComponent);
  }
}
