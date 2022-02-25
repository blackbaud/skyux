import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyDescriptionListService implements OnDestroy {
  public get defaultDescription(): Observable<string> {
    return this._defaultDescription.asObservable();
  }

  private _defaultDescription = new BehaviorSubject<string>('');

  public ngOnDestroy(): void {
    this._defaultDescription.complete();
  }

  public updateDefaultDescription(value: string): void {
    this._defaultDescription.next(value);
  }
}
