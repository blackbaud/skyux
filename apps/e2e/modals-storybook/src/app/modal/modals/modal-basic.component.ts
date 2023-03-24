import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-basic.component.html',
})
export class ModalBasicComponent {
  #instance: SkyModalInstance;
  constructor(instance: SkyModalInstance) {
    this.#instance = instance;
  }
  public showHelp = false;
  public title = 'Hello world';
  public closeModal(): void {
    this.#instance.close();
  }
}
