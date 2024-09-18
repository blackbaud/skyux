import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { delay } from 'rxjs';

import { ModalViewkeptToolbarsModalComponent } from './modal-viewkept-toolbars-modal.component';

@Component({
  selector: 'app-modal-viewkept-toolbars',
  templateUrl: './modal-viewkept-toolbars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalViewkeptToolbarsComponent {
  protected readonly ready$ = inject(FontLoadingService)
    .ready()
    .pipe(delay(100));

  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public openModal(): void {
    this.#modalService.open(ModalViewkeptToolbarsModalComponent);
  }
}
