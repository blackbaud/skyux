import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals/modules/modal';
import { SkyTextExpandModalContext } from './text-expand-modal-context';

@Component({
  selector: 'sky-text-expand-modal',
  templateUrl: './text-expand-modal.component.html',
  styleUrls: ['./text-expand.component.scss']
})
export class SkyTextExpandModalComponent {
  constructor(
    public context: SkyTextExpandModalContext,
    public instance: SkyModalInstance
  ) {}

  public close() {
    this.instance.close();
  }
}
