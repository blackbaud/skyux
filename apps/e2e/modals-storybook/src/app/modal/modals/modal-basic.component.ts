import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyModalError, SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { ModalTestContext } from './modal-context';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-basic.component.html',
  imports: [CommonModule, SkyHelpInlineModule, SkyModalModule],
})
export class ModalBasicComponent {
  public showHelp = false;
  public errors: SkyModalError[] | undefined;
  public title = 'Hello world';

  protected readonly context = inject(ModalTestContext, { optional: true });
  protected readyFonts = toSignal(inject(FontLoadingService).ready());
  protected readyIcons = toSignal(inject(FontLoadingService).ready(true));

  #instance: SkyModalInstance;

  constructor(instance: SkyModalInstance) {
    this.#instance = instance;
  }

  public closeModal(): void {
    this.#instance.close();
  }
}
