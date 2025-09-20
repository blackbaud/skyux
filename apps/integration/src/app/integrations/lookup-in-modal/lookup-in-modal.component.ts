import { Component, DOCUMENT, OnDestroy, OnInit, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalLookupComponent } from './modal-lookup.component';

@Component({
  selector: 'app-lookup-in-modal',
  template: '',
  standalone: false,
})
export class LookupInModalComponent implements OnInit, OnDestroy {
  #document = inject(DOCUMENT);
  #modalService = inject(SkyModalService);

  public ngOnInit(): void {
    this.#document.body.setAttribute('style', 'margin-top: 50px');
    this.#modalService.open(ModalLookupComponent, {
      size: 'small',
    });
  }

  public ngOnDestroy(): void {
    this.#document.body.removeAttribute('style');
  }
}
