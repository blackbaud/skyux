import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { BehaviorSubject } from 'rxjs';

import { ModalLookupComponent } from './modal-lookup.component';

@Component({
  selector: 'app-lookup-in-modal',
  template: '<span *ngIf="ready$ | async" id="ready"></span>',
})
export class LookupInModalComponent implements OnInit, OnDestroy {
  protected readonly ready$ = new BehaviorSubject(false);

  #document = inject(DOCUMENT);
  #modalService = inject(SkyModalService);

  public ngOnInit(): void {
    this.#document.body.setAttribute('style', 'margin-top: 50px');
    this.#modalService.open(ModalLookupComponent, {
      size: 'small',
    });
    setTimeout(() => this.ready$.next(true), 100);
  }

  public ngOnDestroy(): void {
    this.#document.body.removeAttribute('style');
  }
}
