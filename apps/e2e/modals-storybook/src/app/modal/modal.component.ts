import { Component, Input } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalBasicComponent } from './modals/modal-basic.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input()
  public fullPage = false;

  constructor(private modal: SkyModalService) {}

  public onOpenModalClick(): void {
    this.modal.open(ModalBasicComponent, {
      providers: [],
      fullPage: this.fullPage,
    });
  }
}
