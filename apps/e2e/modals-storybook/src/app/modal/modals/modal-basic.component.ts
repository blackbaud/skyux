import { Component, inject } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyModalError, SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { ModalTestContext } from './modal-context';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-basic.component.html',
  imports: [SkyHelpInlineModule, SkyModalModule],
})
export class ModalBasicComponent {
  public showHelp = false;
  public errors: SkyModalError[] | undefined;
  public title = 'Hello world';

  protected readonly context = inject(ModalTestContext, { optional: true });

  readonly #instance = inject(SkyModalInstance);

  public closeModal(): void {
    this.#instance.close();
  }
}
