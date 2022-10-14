import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyTabsetAdapterService } from '../tabset-adapter.service';

@Injectable()
export class MockTabsetAdapterService
  extends SkyTabsetAdapterService
  implements OnDestroy
{
  public disableDetectOverflow = false;

  public get overflowChange(): Observable<boolean> {
    return this.#_overflowChangeObs;
  }

  #_overflowChange: BehaviorSubject<boolean>;
  #_overflowChangeObs: Observable<boolean>;

  constructor() {
    super();
    this.#_overflowChange = new BehaviorSubject(false);
    this.#_overflowChangeObs = this.#_overflowChange.asObservable();
  }

  public ngOnDestroy(): void {
    this.#_overflowChange.complete();
  }

  public detectOverflow() {
    if (!this.disableDetectOverflow) {
      super.detectOverflow();
    }
  }

  public fakeOverflowChange(overflow: boolean) {
    this.#_overflowChange.next(overflow);
  }
}
