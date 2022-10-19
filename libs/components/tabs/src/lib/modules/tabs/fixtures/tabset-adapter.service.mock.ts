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
    return this.#overflowChangeObs;
  }

  #overflowChange: BehaviorSubject<boolean>;
  #overflowChangeObs: Observable<boolean>;

  constructor() {
    super();
    this.#overflowChange = new BehaviorSubject(false);
    this.#overflowChangeObs = this.#overflowChange.asObservable();
  }

  public ngOnDestroy(): void {
    this.#overflowChange.complete();
  }

  public detectOverflow() {
    if (!this.disableDetectOverflow) {
      super.detectOverflow();
    }
  }

  public fakeOverflowChange(overflow: boolean) {
    this.#overflowChange.next(overflow);
  }
}
