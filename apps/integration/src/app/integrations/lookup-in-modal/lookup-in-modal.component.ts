import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { FontLoadingService } from '@skyux/storybook';

import { delay } from 'rxjs';

import { ModalLookupComponent } from './modal-lookup.component';

@Component({
  selector: 'app-lookup-in-modal',
  template: '@if (ready$ | async) {<span id="ready"></span>}',
})
export class LookupInModalComponent implements OnInit, OnDestroy {
  protected readonly ready$ = inject(FontLoadingService)
    .ready()
    .pipe(delay(100));

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
