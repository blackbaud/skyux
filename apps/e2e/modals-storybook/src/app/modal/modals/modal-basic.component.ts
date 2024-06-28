import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyModalError, SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { ModalTestContext } from './modal-context';

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

  protected readonly context = inject(ModalTestContext, { optional: true });

  #instance: SkyModalInstance;

  constructor(instance: SkyModalInstance) {
    this.#instance = instance;
  }

  public closeModal(): void {
    this.#instance.close();
  }
}
