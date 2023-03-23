import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalModalComponent } from './modal/modal-modal.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(private modal: SkyModalService) {}

  public onOpenModalClick(): void {
    this.modal.open(ModalModalComponent, { providers: [] });
  }
}
