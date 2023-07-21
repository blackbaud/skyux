import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyModalError } from './modal-error';

/**
 * @internal
 */
@Injectable()
export class SkyModalErrorsService {
  public formErrors: Observable<SkyModalError[] | undefined>;

  #formErrors = new BehaviorSubject<SkyModalError[] | undefined>(undefined);

  constructor() {
    this.formErrors = this.#formErrors.asObservable();
  }

  public updateErrors(value: SkyModalError[] | undefined): void {
    this.#formErrors.next(value);
  }
}
