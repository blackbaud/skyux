import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyModalError, SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal-basic.component.html',
  imports: [CommonModule, SkyHelpInlineModule, SkyModalModule],
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
