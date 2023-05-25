import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-affixer',
  templateUrl: './affixer.component.html',
})
export class AffixerComponent {
  constructor(private modal: SkyModalService) {}

  public openModal(): void {
    this.modal.open(ModalComponent);
  }
}
