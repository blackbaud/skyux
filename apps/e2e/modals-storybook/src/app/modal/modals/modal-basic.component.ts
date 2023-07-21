import { Component } from '@angular/core';
import { SkyModalError, SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-basic.component.html',
})
export class ModalBasicComponent {
  public showHelp = false;
  public errors: SkyModalError[] | undefined;
  public title = 'Hello world';

  #instance: SkyModalInstance;

  constructor(instance: SkyModalInstance) {
    this.#instance = instance;
  }

  public closeModal(): void {
    this.#instance.close();
  }
}
