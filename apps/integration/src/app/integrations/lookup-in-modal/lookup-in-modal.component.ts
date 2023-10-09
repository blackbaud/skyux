import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { BehaviorSubject } from 'rxjs';

import { ModalLookupComponent } from './modal-lookup.component';

@Component({
  selector: 'app-lookup-in-modal',
  template: '<span *ngIf="ready$ | async" id="ready"></span>',
})
export class LookupInModalComponent implements AfterViewInit, OnDestroy {
  protected readonly ready$ = new BehaviorSubject(false);

  #document = inject(DOCUMENT);
  #modalService = inject(SkyModalService);

  public ngAfterViewInit(): void {
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
